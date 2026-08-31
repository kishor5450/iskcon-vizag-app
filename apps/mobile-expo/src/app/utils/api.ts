import { Platform, NativeModules } from 'react-native';
import {
  IDevotee,
  ISadhanaRecord,
  IAnnouncement,
  LoginResponseDto,
  RegisterRequestDto,
  LoginRequestDto,
  SadhanaLogRequestDto
} from '@temple/models';

const DEV_IP_OVERRIDE = ''; // Set to your PC's Wi-Fi IP (e.g. '192.168.99.80') if auto-detection fails

const getApiUrl = () => {
  if (__DEV__) {
    if (DEV_IP_OVERRIDE) {
      return `http://${DEV_IP_OVERRIDE}:3000/api`;
    }

    // 1. Try NativeModules (legacy / Old Architecture)
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const address = scriptURL.split('://')[1].split('/')[0];
      const host = address.split(':')[0];
      return `http://${host}:3000/api`;
    }

    // 2. Try expo-constants (works in Expo Go / New Architecture)
    try {
      const Constants = require('expo-constants').default;
      const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest?.hostUri;
      if (hostUri) {
        const host = hostUri.split(':')[0];
        return `http://${host}:3000/api`;
      }
    } catch (e) {
      // expo-constants is not available
    }
  }
  return Platform.select({
    android: 'http://10.0.2.2:3000/api',
    ios: 'http://localhost:3000/api',
    default: 'http://localhost:3000/api',
  }) as string;
};

const API_URL = getApiUrl();
console.log('[API] Resolved API_URL:', API_URL);

/**
 * Resolves local API image paths by replacing localhost/127.0.0.1/10.0.2.2
 * with the dynamically determined server host IP (from scriptURL).
 * This ensures that uploaded images display correctly on physical devices
 * on the LAN and on emulators.
 */
export const resolveImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;

  // Match absolute local URLs pointing to localhost, loopback, or any IP address on port 3000
  const match = url.match(/^http:\/\/(?:localhost|127\.0\.0\.1|10\.0\.2\.2|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):3000(.*)$/);
  if (match) {
    const apiBase = API_URL.replace('/api', ''); // e.g. http://192.168.99.80:3000
    return `${apiBase}${match[1]}`;
  }

  // Prepend server base URL if it's a relative uploads path
  if (url.startsWith('/uploads')) {
    const apiBase = API_URL.replace('/api', '');
    return `${apiBase}${url}`;
  }

  return url;
};

// Helper for standard JSON headers
const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async login(email: string, passwordPlain: string): Promise<LoginResponseDto> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, passwordPlain }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();
    if (data.devotee && data.devotee.avatarUrl) {
      data.devotee.avatarUrl = resolveImageUrl(data.devotee.avatarUrl);
    }
    return data;
  },

  async register(devotee: RegisterRequestDto): Promise<IDevotee> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(devotee),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }

    const data = await res.json();
    if (data.avatarUrl) {
      data.avatarUrl = resolveImageUrl(data.avatarUrl);
    }
    return data;
  },

  async getProfile(token: string): Promise<IDevotee> {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await res.json();
    if (data.avatarUrl) {
      data.avatarUrl = resolveImageUrl(data.avatarUrl);
    }
    return data;
  },

  async getTodayRecord(token: string, date: string): Promise<ISadhanaRecord | null> {
    const res = await fetch(`${API_URL}/sadhana/today?date=${date}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch today sadhana log');
    }

    const data = await res.text();
    return data ? JSON.parse(data) : null;
  },

  async submitSadhanaLog(token: string, dto: SadhanaLogRequestDto): Promise<ISadhanaRecord> {
    const res = await fetch(`${API_URL}/sadhana/log`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit Sadhana log');
    }

    return res.json();
  },

  async getSadhanaHistory(token: string): Promise<ISadhanaRecord[]> {
    const res = await fetch(`${API_URL}/sadhana/history`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch sadhana history');
    }

    return res.json();
  },

  async getAnnouncements(token: string, officialOnly?: boolean): Promise<IAnnouncement[]> {
    const query = officialOnly !== undefined ? `?official=${officialOnly}` : '';
    const res = await fetch(`${API_URL}/announcements${query}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch announcements');
    }

    const data = await res.json();
    return data.map((ann: any) => ({
      ...ann,
      image: ann.image ? resolveImageUrl(ann.image) : ann.image,
    }));
  },

  async getDevotees(token: string): Promise<IDevotee[]> {
    const res = await fetch(`${API_URL}/auth/devotees`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch devotees list');
    }
    const data = await res.json();
    return data.map((d: any) => ({
      ...d,
      avatarUrl: d.avatarUrl ? resolveImageUrl(d.avatarUrl) : d.avatarUrl,
    }));
  },

  async createAnnouncement(token: string, dto: any): Promise<IAnnouncement> {
    const res = await fetch(`${API_URL}/announcements`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      throw new Error('Failed to create announcement');
    }
    const data = await res.json();
    if (data.image) {
      data.image = resolveImageUrl(data.image);
    }
    return data;
  },

  async deleteAnnouncement(token: string, id: number): Promise<void> {
    const res = await fetch(`${API_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) {
      throw new Error('Failed to delete announcement');
    }
  },

  async uploadAnnouncementImage(token: string, fileUri: string): Promise<{ url: string }> {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('file', {
      uri: fileUri,
      name: filename,
      type: type.toLowerCase(),
    } as any);

    const res = await fetch(`${API_URL}/announcements/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Image upload failed');
    }

    const data = await res.json();
    if (data.url) {
      data.url = resolveImageUrl(data.url);
    }
    return data;
  },

  async updateAvatar(token: string, avatarUrl: string): Promise<IDevotee> {
    const res = await fetch(`${API_URL}/auth/avatar`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ avatarUrl }),
    });
    if (!res.ok) {
      throw new Error('Failed to update avatar image');
    }
    const data = await res.json();
    if (data.avatarUrl) {
      data.avatarUrl = resolveImageUrl(data.avatarUrl);
    }
    return data;
  },
};
