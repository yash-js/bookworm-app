import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import styles from '../../assets/styles/login.styles'
import { useState } from 'react'
import COLORS from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { useAuthStore } from '../../store/authStore'
import Loader from '../../components/Loader'
const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { login, isLoading, checkingAuth } = useAuthStore()

    const handleLogin = async () => {
        const result = await login({ email, password });
    }

    if (checkingAuth) {
        return (
            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image
                        source={require('../../assets/images/book.png')}
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                </View>
                <Loader />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: COLORS.background
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image
                        source={require('../../assets/images/book.png')}
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.card}>
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    value={email}
                                    placeholderTextColor={COLORS.placeholderText}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name={'lock-closed-outline'}
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="********"
                                    value={password}
                                    placeholderTextColor={COLORS.placeholderText}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={!showPassword ? 'eye-outline' : 'eye-off-outline'}
                                        size={20}
                                        color={COLORS.primary}
                                        style={styles.inputIcon}
                                    />
                                </TouchableOpacity>

                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            {isLoading ?
                                <ActivityIndicator color={COLORS.white} />
                                :
                                <Text style={styles.buttonText}>Login</Text>
                            }
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <Link href={'/(auth)/signup'} asChild>
                                <TouchableOpacity>
                                    <Text style={styles.link}>Sign up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login