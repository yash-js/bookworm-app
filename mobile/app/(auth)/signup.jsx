import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import styles from '../../assets/styles/signup.styles'
import COLORS from '../../constants/colors'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { user, isLoading, register } = useAuthStore()
    const router = useRouter();

    const handleSignup = async () => {
        const result = await register({ username, email, password });
        if (!result.success) {
            Alert.alert('Error', result.error);
            return
        }
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
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>BookWorm🐛</Text>
                        <Text style={styles.subtitle}>Share your favorite reads</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={COLORS.placeholderText}
                                    placeholder="johndoe"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>

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
                                    placeholderTextColor={COLORS.placeholderText}
                                    placeholder="john.doe@me.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
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
                            onPress={handleSignup}
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
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.link}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>

        </KeyboardAvoidingView>
    )
}

export default Signup