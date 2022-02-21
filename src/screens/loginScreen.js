import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import deviceStorage from '../services/deviceStorage';
import client from '../apiAuth/basicApiAuth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });

    const _onLoginPressed = async () => {
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);

        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            return;
        }
        const data = {
            "userName": email.value,
            "password": password.value
        }
        //const client = await client();
        client
            .post('User/AuthenticateUser', data)
            .then(response => {
                if (response && response.data) {
                    if (response.data.status == 1) {
                        Alert.alert(response.data.message);
                        deviceStorage.saveItem("token", response.data.object.sessionToken);
                        deviceStorage.saveItem("userId", response.data.object.userID.toString());
                        deviceStorage.saveItem("userName", response.data.object.userName);
                        deviceStorage.saveItem("userEmail", response.data.object.userEmail);
                        navigation.navigate('Dashboard');
                    }
                    else {
                        Alert.alert(response.data.message);
                    }
                }

            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <Background>
            <BackButton goBack={() => navigation.navigate('HomeScreen')} />
            <Logo />
            <Header>AppStudio99 Retail</Header>
            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                style={styles.textInput}
            />

            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
                style={styles.textInput}
            />

            <View style={styles.forgotPassword}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPasswordScreen')}
                >
                    <Text style={styles.label}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>

            <Button mode="contained" onPress={_onLoginPressed}>
                Login
      </Button>

            <View style={styles.row}>
                <Text style={styles.label}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    label: {
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    textInput: {
        height: 50
    }
});

export default memo(LoginScreen);