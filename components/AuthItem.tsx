import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Item } from 'react-navigation-header-buttons'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/AuthActions'

export function useAuthState() {
    return useSelector( (state: any) => state.auth )
}

export function useIsLoggedIn() {
    const authState = useAuthState()
    // console.log("AuthState: ", authState)
    const isLoggedIn = !!authState.user
    return isLoggedIn
}

export function useAuthItem() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const isLoggedIn = useIsLoggedIn()


    function handleLogin() {
        navigation.navigate("Login")
    }
    function handleLogout() {
        dispatch(logout())
    }

    // console.log("IsLoggedIn: ", isLoggedIn)
    if (isLoggedIn) {
        return <Item key="logout" title="Logout" iconName="log_out" onPress={handleLogout} />
    } else {
        return <Item key="login" title="Login" iconName="log_in" onPress={handleLogin} />
    }
}


// export default AuthItem