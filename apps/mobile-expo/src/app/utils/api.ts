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

const getApiUrl = () => {
  if (__DEV__) {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const address = scriptURL.split('://')[1].split('/')[0];
      const host = address.split(':')[0];
      return `http://${host}:3000/api`;
    }
  }
  return Platform.select({
    android: 'http://10.0.2.2:3000/api',
    ios: 'http://localhost:3000/api',
    default: 'http://localhost:3000/api',
  }) as string;
};

const API_URL = getApiUrl();

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

    return res.json();
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

    return res.json();
  },

  async getProfile(token: string): Promise<IDevotee> {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }

    return res.json();
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

    return res.json();
  },

  async getDevotees(token: string): Promise<IDevotee[]> {
    const res = await fetch(`${API_URL}/auth/devotees`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch devotees list');
    }
    return res.json();
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
    return res.json();
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
      uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
      name: filename,
      type,
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

    return res.json();
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
    return res.json();
  },
};
