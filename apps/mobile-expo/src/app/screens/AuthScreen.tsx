import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { IDevotee, RegisterRequestDto, PreferredLanguage } from '@temple/models';
import { api } from '../utils/api';

interface AuthScreenProps {
  colors: any;
  onLoginSuccess: (token: string, devotee: IDevotee) => void;
  isDarkMode: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  colors,
  onLoginSuccess,
  isDarkMode,
}) => {
  const [authState, setAuthState] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Input fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(email.trim(), password);
      onLoginSuccess(res.token, res.devotee);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setErrorMsg('Name, email, and password are required');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      // Register
      await api.register(
        new RegisterRequestDto(
          name.trim(),
          email.trim().toLowerCase(),
          password,
          phone.trim() || undefined,
          PreferredLanguage.ENGLISH
        )
      );
      // Automatically log in after registration
      const loginRes = await api.login(email.trim().toLowerCase(), password);
      onLoginSuccess(loginRes.token, loginRes.devotee);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    setErrorMsg('');
    const guestEmail = 'guest@iskcondevotee.com';
    const guestPass = 'guest123';
    try {
      // Try to login guest
      const loginRes = await api.login(guestEmail, guestPass);
      onLoginSuccess(loginRes.token, loginRes.devotee);
    } catch (err) {
      // If login fails (user does not exist), register and log in
      try {
        await api.register(
          new RegisterRequestDto(
            'Guest Devotee',
            guestEmail,
            guestPass,
            undefined,
            PreferredLanguage.ENGLISH
          )
        );
        const loginRes = await api.login(guestEmail, guestPass);
        onLoginSuccess(loginRes.token, loginRes.devotee);
      } catch (regErr: any) {
        setErrorMsg('Failed to log in as guest: ' + regErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authState === 'welcome') {
    return (
      <ImageBackground
        source={require('../../../assets/images/temple.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        
        <SafeAreaView style={styles.welcomeContainer}>
          <View style={styles.welcomeHeader}>
            <Image 
              source={require('../../../assets/images/iskcon_vizag_logo.jpg')} 
              style={styles.welcomeLogo}
              resizeMode="contain"
            />
            <Text style={[styles.welcomeBrand, { color: colors.accentGold }]}>ISKCON VIZAG</Text>
            <Text style={styles.welcomeSlogan}>My Bhakti. My Temple. My Family.</Text>
          </View>

          <View style={styles.welcomeMiddle}>
            <Text style={styles.welcomeTitle}>Welcome to ISKCON VIZAG</Text>
            <Text style={styles.welcomeSubtitle}>
              Connect with Krishna,{"\n"}connect with family.
            </Text>
          </View>

          <View style={styles.welcomeFooter}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.accentGold} style={{ marginBottom: 20 }} />
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.primaryBtn, { backgroundColor: colors.accentGold }]}
                  onPress={() => setAuthState('login')}
                >
                  <Text style={[styles.primaryBtnText, { color: '#160826' }]}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.secondaryBtn, { borderColor: colors.accentGold }]}
                  onPress={() => setAuthState('signup')}
                >
                  <Text style={[styles.secondaryBtnText, { color: colors.pureWhite }]}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.guestBtn}
                  onPress={handleGuest}
                >
                  <Text style={styles.guestBtnText}>Continue as Guest</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={[styles.formContainer, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollForm}>
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => {
              setErrorMsg('');
              setAuthState('welcome');
            }}
          >
            <Text style={[styles.backBtnText, { color: colors.textMain }]}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.formHeader}>
            <Image 
              source={require('../../../assets/images/iskcon_vizag_logo.jpg')} 
              style={styles.formLogo}
              resizeMode="contain"
            />
            <Text style={[styles.formTitle, { color: colors.textMain }]}>
              {authState === 'login' ? 'Welcome Back' : 'Create Devotee Account'}
            </Text>
            <Text style={[styles.formSubtitle, { color: colors.textSub }]}>
              {authState === 'login' 
                ? 'Sign in to log your daily Sadhana and connect.' 
                : 'Join the ISKCON Vizag congregation portal.'
              }
            </Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.formFields}>
            {authState === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSub }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card, 
                    borderColor: colors.cardBorder,
                    color: isDarkMode ? '#FFF' : '#000'
                  }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={isDarkMode ? '#796796' : '#B0A38F'}
                  value={name}
                  onChangeText={setName}
                  autoCorrect={false}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSub }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card, 
                  borderColor: colors.cardBorder,
                  color: isDarkMode ? '#FFF' : '#000'
                }]}
                placeholder="Enter your email"
                placeholderTextColor={isDarkMode ? '#796796' : '#B0A38F'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {authState === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSub }]}>Phone Number</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card, 
                    borderColor: colors.cardBorder,
                    color: isDarkMode ? '#FFF' : '#000'
                  }]}
                  placeholder="Enter phone number"
                  placeholderTextColor={isDarkMode ? '#796796' : '#B0A38F'}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSub }]}>Password</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card, 
                  borderColor: colors.cardBorder,
                  color: isDarkMode ? '#FFF' : '#000'
                }]}
                placeholder="Enter password"
                placeholderTextColor={isDarkMode ? '#796796' : '#B0A38F'}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.accentGold} style={{ marginVertical: 12 }} />
          ) : (
            <TouchableOpacity 
              style={[styles.formSubmitBtn, { backgroundColor: colors.accentGold }]}
              onPress={authState === 'login' ? handleLogin : handleSignup}
            >
              <Text style={[styles.formSubmitBtnText, { color: '#160826' }]}>
                {authState === 'login' ? 'Log In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.formFooter}>
            {authState === 'login' ? (
              <TouchableOpacity onPress={() => {
                setErrorMsg('');
                setAuthState('signup');
              }}>
                <Text style={[styles.toggleAuthText, { color: colors.accentGold }]}>
                  Don't have an account? <Text style={styles.underline}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => {
                setErrorMsg('');
                setAuthState('login');
              }}>
                <Text style={[styles.toggleAuthText, { color: colors.accentGold }]}>
                  Already have an account? <Text style={styles.underline}>Log In</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 5, 28, 0.85)',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginTop: 30,
  },
  welcomeLogo: {
    width: 180,
    height: 180,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  formLogo: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#ffd700',
  },
  welcomeBrand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1BD3C',
    letterSpacing: 2,
  },
  welcomeSlogan: {
    fontSize: 12,
    color: '#D4C9E8',
    marginTop: 4,
    fontWeight: '500',
  },
  welcomeMiddle: {
    alignItems: 'center',
    marginVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#E5DCFA',
    textAlign: 'center',
    lineHeight: 24,
  },
  welcomeFooter: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestBtn: {
    paddingVertical: 8,
  },
  guestBtnText: {
    color: '#D4C9E8',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
  },
  scrollForm: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 20,
    marginBottom: 15,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIconLarge: {
    fontSize: 48,
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  errorContainer: {
    backgroundColor: 'rgba(235, 87, 87, 0.1)',
    borderColor: '#EB5757',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#EB5757',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  formFields: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  formSubmitBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 3,
  },
  formSubmitBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formFooter: {
    alignItems: 'center',
  },
  toggleAuthText: {
    fontSize: 14,
    fontWeight: '500',
  },
  underline: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
