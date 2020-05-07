import React from 'react';
import { Button, Text } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import Screen from '../components/Screen';
import * as AuthActions from '../store/AuthActions';
import { useIsLoggedIn, useAuthState } from '../components/AuthItem';

// @ts-ignore
export default function LoginScreen({navigation}) {

    const isLoggedIn = useIsLoggedIn()
    if( isLoggedIn ) {
        navigation.goBack()
    }

    const authState = useAuthState()

    const dispatch = useDispatch()

    const email = "elmar.zander5@googlemail.com"
    const password = "293478"

    function handleLogin() {
        dispatch(AuthActions.login(email, password))
    }
    function handleLoginErr() {
        dispatch(AuthActions.login(email, password+"asdlfkjsldjslfjdlk"))
    }
    function handleSignUp() {
        dispatch(AuthActions.signUp(email, password))
    }

    return (
        <Screen>
            {
                authState.error && <Text>{JSON.stringify(authState.error)}</Text>
            }
            <Button title="Login" onPress={handleLogin} />
            <Text/>
            <Button title="Login (w. Error)" onPress={handleLoginErr} />
            <Text/>
            <Button title="Sign up" onPress={handleSignUp} />
        </Screen>
    );
}
