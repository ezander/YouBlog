import React from 'react';
import { Button, Text } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import Screen from '../components/Screen';
import * as AuthActions from '../store/AuthActions';
import { useIsLoggedIn, useAuthState } from '../components/AuthItem';

// @ts-ignore
export default function LoginScreen({ navigation }) {

    const isLoggedIn = useIsLoggedIn()
    if (isLoggedIn) {
        navigation.goBack()
    }

    const authState = useAuthState()

    const dispatch = useDispatch()

    function handleLoginAA() {
        const email = "aa@testmail.com"
        const password = "test1234"

        dispatch(AuthActions.doLogin(email, password))
    }
    function handleLoginCC() {
        const email = "cc@testmail.com"
        const password = "test1234"

        dispatch(AuthActions.doLogin(email, password))
    }
    function handleLoginErr() {
        const email = "cc@testmail.com"
        const password = "test1235"

        dispatch(AuthActions.doLogin(email, password))
    }
    // function handleSignUp() {
    //     dispatch(AuthActions.doSignUp(email, password))
    // }

    return (
        <Screen>
            {
                authState.error && <Text>{JSON.stringify(authState.error)}</Text>
            }
            <Button title="Login AA" onPress={handleLoginAA} />
            <Text />
            <Button title="Login (w. Error)" onPress={handleLoginErr} />
            <Text />
            <Button title="Login CC" onPress={handleLoginCC} />
        </Screen>
    );
}
