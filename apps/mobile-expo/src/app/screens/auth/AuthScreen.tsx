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
  Modal,
} from 'react-native';
import { IDevotee, RegisterRequestDto, PreferredLanguage } from '@temple/models';
import { api } from '../../utils/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleStep, setGoogleStep] = useState<1 | 2>(1);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState('');
  const [googlePasswordInput, setGooglePasswordInput] = useState('');
  const [showCustomGoogleEmail, setShowCustomGoogleEmail] = useState(false);
  const [googleAccounts, setGoogleAccounts] = useState<string[]>(['devotee108@gmail.com']);

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

  const handleGoogleSignIn = () => {
    setErrorMsg('');
    setGoogleStep(1);
    setShowCustomGoogleEmail(false);
    setShowGoogleModal(true);
  };

  const handleAddAccount = () => {
    if (!googleEmailInput || !googleEmailInput.includes('@')) {
      setErrorMsg('Please enter a valid Google email address');
      return;
    }
    const newEmail = googleEmailInput.trim().toLowerCase();
    if (!googleAccounts.includes(newEmail)) {
      setGoogleAccounts([...googleAccounts, newEmail]);
    }
    setSelectedGoogleEmail(newEmail);
    setGoogleStep(2);
    setErrorMsg('');
    setGoogleEmailInput('');
  };

  const submitGoogleSignIn = async () => {
    if (!googlePasswordInput) {
      setErrorMsg('Please enter your password');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const email = selectedGoogleEmail;
    const username = email.split('@')[0];
    const name = username.charAt(0).toUpperCase() + username.slice(1);
    const password = googlePasswordInput;
    try {
      const loginRes = await api.login(email, password);
      onLoginSuccess(loginRes.token, loginRes.devotee);
      setShowGoogleModal(false);
      setGoogleEmailInput('');
      setGooglePasswordInput('');
      setSelectedGoogleEmail('');
      setGoogleStep(1);
      setShowCustomGoogleEmail(false);
    } catch (err: any) {
      if (err.message && err.message.includes('credentials')) {
        setErrorMsg('Invalid password for this account.');
      } else {
        try {
          await api.register(
            new RegisterRequestDto(
              name + ' (Google)',
              email,
              password,
              undefined,
              PreferredLanguage.ENGLISH
            )
          );
          const loginRes = await api.login(email, password);
          onLoginSuccess(loginRes.token, loginRes.devotee);
          setShowGoogleModal(false);
          setGoogleEmailInput('');
          setGooglePasswordInput('');
          setSelectedGoogleEmail('');
          setGoogleStep(1);
          setShowCustomGoogleEmail(false);
        } catch (regErr: any) {
          setErrorMsg('Failed to log in with Google: ' + regErr.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const renderGoogleModal = () => {
    return (
      <Modal
        visible={showGoogleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowGoogleModal(false);
          setErrorMsg('');
          setGoogleEmailInput('');
          setGooglePasswordInput('');
          setSelectedGoogleEmail('');
          setGoogleStep(1);
          setShowCustomGoogleEmail(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={[styles.dragBar, { backgroundColor: colors.divider }]} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 12 }}>
              <MaterialCommunityIcons name="google" size={24} color={colors.accentGold} style={{ marginRight: 8 }} />
              <Text style={[styles.modalTitle, { color: colors.pureWhite, fontSize: 18, marginBottom: 0 }]}>Sign in with Google</Text>
            </View>

            {googleStep === 1 ? (
              <>
                <Text style={[styles.modalSubtitle, { color: '#D4C9E8', marginBottom: 16 }]}>
                  Choose an account to continue to ISKCON Vizag
                </Text>

                {!showCustomGoogleEmail ? (
                  <View style={{ width: '100%', marginBottom: 16 }}>
                    {googleAccounts.map((account, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.accountOptionBtn, { backgroundColor: 'rgba(27, 12, 48, 0.6)', borderColor: colors.cardBorder }]}
                        onPress={() => {
                          setSelectedGoogleEmail(account);
                          setGoogleStep(2);
                        }}
                      >
                        <View style={[styles.avatarCircle, { backgroundColor: colors.accentGold }]}>
                          <Text style={styles.avatarText}>{account.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>{account.split('@')[0]}</Text>
                          <Text style={{ color: '#D4C9E8', fontSize: 12 }}>{account}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                      style={[styles.accountOptionBtn, { backgroundColor: 'rgba(27, 12, 48, 0.3)', borderColor: colors.cardBorder, borderStyle: 'dashed' }]}
                      onPress={() => {
                        setShowCustomGoogleEmail(true);
                        setErrorMsg('');
                      }}
                    >
                      <MaterialCommunityIcons name="plus-circle-outline" size={20} color={colors.accentGold} style={{ marginRight: 12, marginLeft: 4 }} />
                      <Text style={{ color: colors.accentGold, fontSize: 14, fontWeight: '600' }}>Use another account</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ width: '100%', marginBottom: 16 }}>
                    <Text style={[styles.inputLabel, { color: '#D4C9E8', fontSize: 12 }]}>Email or phone</Text>
                    <TextInput
                      style={[styles.modalInput, { 
                        backgroundColor: 'rgba(27, 12, 48, 0.85)', 
                        borderColor: 'rgba(255, 215, 0, 0.35)',
                        color: '#FFF'
                      }]}
                      placeholder="example@gmail.com"
                      placeholderTextColor="#796796"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={googleEmailInput}
                      onChangeText={setGoogleEmailInput}
                    />

                    {errorMsg ? (
                      <Text style={styles.modalErrorText}>⚠️ {errorMsg}</Text>
                    ) : null}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8 }}>
                      <TouchableOpacity 
                        style={[styles.modalBtnCancel, { borderColor: colors.accentGold }]}
                        onPress={() => {
                          setShowCustomGoogleEmail(false);
                          setErrorMsg('');
                          setGoogleEmailInput('');
                        }}
                      >
                        <Text style={[styles.modalBtnCancelText, { color: colors.pureWhite }]}>Back</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={[styles.modalBtnSubmit, { backgroundColor: colors.accentGold }]}
                        onPress={handleAddAccount}
                      >
                        <Text style={[styles.modalBtnSubmitText, { color: '#160826' }]}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {!showCustomGoogleEmail && (
                  <TouchableOpacity 
                    style={[styles.modalBtnCancel, { width: '100%', borderColor: colors.accentGold, marginTop: 8 }]}
                    onPress={() => {
                      setShowGoogleModal(false);
                      setErrorMsg('');
                    }}
                  >
                    <Text style={[styles.modalBtnCancelText, { color: colors.pureWhite }]}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
                  <View style={[styles.avatarCircleLarge, { backgroundColor: colors.accentGold, marginBottom: 8 }]}>
                    <Text style={styles.avatarTextLarge}>{selectedGoogleEmail.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>
                    {selectedGoogleEmail}
                  </Text>
                </View>

                <View style={{ width: '100%' }}>
                  <Text style={[styles.inputLabel, { color: '#D4C9E8', fontSize: 12 }]}>Enter your password</Text>
                  <TextInput
                    style={[styles.modalInput, { 
                      backgroundColor: 'rgba(27, 12, 48, 0.85)', 
                      borderColor: 'rgba(255, 215, 0, 0.35)',
                      color: '#FFF'
                    }]}
                    placeholder="Enter password"
                    placeholderTextColor="#796796"
                    secureTextEntry
                    value={googlePasswordInput}
                    onChangeText={setGooglePasswordInput}
                  />
                </View>

                {errorMsg ? (
                  <Text style={styles.modalErrorText}>⚠️ {errorMsg}</Text>
                ) : null}

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalBtnCancel, { borderColor: colors.accentGold }]}
                    onPress={() => {
                      setGoogleStep(1);
                      setGooglePasswordInput('');
                      setErrorMsg('');
                    }}
                  >
                    <Text style={[styles.modalBtnCancelText, { color: colors.pureWhite }]}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.modalBtnSubmit, { backgroundColor: colors.accentGold }]}
                    onPress={submitGoogleSignIn}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#160826" />
                    ) : (
                      <Text style={[styles.modalBtnSubmitText, { color: '#160826' }]}>Sign In</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
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
              source={require('../../../assets/images/iskcon_vizag_logo.png')} 
              style={styles.welcomeLogo}
              resizeMode="contain"
            />
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
                  style={styles.googleBtn}
                  onPress={handleGoogleSignIn}
                >
                  <MaterialCommunityIcons name="google" size={20} color="#FFF" style={{ marginRight: 10 }} />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
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
        {renderGoogleModal()}
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/temple.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.formContainer}>
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
              <Text style={[styles.backBtnText, { color: colors.accentGold }]}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.formHeader}>
              <Image 
                source={require('../../../assets/images/iskcon_vizag_logo.png')} 
                style={styles.formLogo}
                resizeMode="contain"
              />
              <Text style={[styles.formTitle, { color: colors.pureWhite }]}>
                {authState === 'login' ? 'Welcome Back' : 'Create Devotee Account'}
              </Text>
              <Text style={[styles.formSubtitle, { color: '#D4C9E8' }]}>
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
                  <Text style={[styles.inputLabel, { color: '#D4C9E8' }]}>Full Name</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: 'rgba(27, 12, 48, 0.85)', 
                      borderColor: 'rgba(255, 215, 0, 0.35)',
                      color: '#FFF'
                    }]}
                    placeholder="Enter your full name"
                    placeholderTextColor="#796796"
                    value={name}
                    onChangeText={setName}
                    autoCorrect={false}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: '#D4C9E8' }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: 'rgba(27, 12, 48, 0.85)', 
                    borderColor: 'rgba(255, 215, 0, 0.35)',
                    color: '#FFF'
                  }]}
                  placeholder="Enter your email"
                  placeholderTextColor="#796796"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {authState === 'signup' && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: '#D4C9E8' }]}>Phone Number</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: 'rgba(27, 12, 48, 0.85)', 
                      borderColor: 'rgba(255, 215, 0, 0.35)',
                      color: '#FFF'
                    }]}
                    placeholder="Enter phone number"
                    placeholderTextColor="#796796"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: '#D4C9E8' }]}>Password</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: 'rgba(27, 12, 48, 0.85)', 
                    borderColor: 'rgba(255, 215, 0, 0.35)',
                    color: '#FFF'
                  }]}
                  placeholder="Enter password"
                  placeholderTextColor="#796796"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={colors.accentGold} style={{ marginVertical: 12 }} />
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.formSubmitBtn, { backgroundColor: colors.accentGold }]}
                  onPress={authState === 'login' ? handleLogin : handleSignup}
                >
                  <Text style={[styles.formSubmitBtnText, { color: '#160826' }]}>
                    {authState === 'login' ? 'Log In' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.googleBtn}
                  onPress={handleGoogleSignIn}
                >
                  <MaterialCommunityIcons name="google" size={20} color="#FFF" style={{ marginRight: 10 }} />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </TouchableOpacity>
              </>
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
      {renderGoogleModal()}
    </ImageBackground>
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
    backgroundColor: 'rgba(50, 10, 85, 0.90)', // Rich royal purple overlay inspired by ISKCON Vizag logo
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
    width: 360,
    height: 210,
    marginBottom: 20,
  },
  formLogo: {
    width: 220,
    height: 125,
    marginBottom: 16,
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
  googleBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  googleBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 5, 28, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 16,
  },
  modalErrorText: {
    color: '#EB5757',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalBtnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  modalBtnCancelText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalBtnSubmit: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  modalBtnSubmitText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  accountOptionBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dragBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#160826',
    fontWeight: 'bold',
    fontSize: 14,
  },
  avatarCircleLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextLarge: {
    color: '#160826',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
