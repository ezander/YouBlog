import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import ErrorBoundary, { ErrorBoundaryProps } from 'react-native-error-boundary';
import { sequence } from '../src/Util';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ErrorHandlerArgs {
    error: Error,
    stackTrace: string
}

function defaultErrorHandler(error: Error, stackTrace: string) {
    /* TODO: Log the error to an error reporting service */
}
const CustomFallback = (props: { error: Error, resetError: Function }) => (
    <View>
        <Text>Something happened!</Text>
        <Text>{props.error.toString()}</Text>
        <Button onPress={props.resetError} title={'Try again'} />
    </View>
)


type Props = { error: Error, resetError: Function }

const CustomFallbackComponent = (props: Props & {goBack: any}) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.title}>{'Oops!'}</Text>
            <Text style={styles.subtitle}>{'There\'s an error'}</Text>
            <Text style={styles.error}>{props.error.toString()}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Go back"
                    icon={<Icon name="arrow-back" size={20} color="white" />}
                    buttonStyle={{ borderRadius: 20}}
                    containerStyle={{flex: 1, marginHorizontal: 10}}
                    onPress={props.goBack}
                />
                <Button
                    title="Try again"
                    icon={<Icon name="refresh" size={20} color="white" />}
                    buttonStyle={{ borderRadius: 20 }}
                    containerStyle={{flex: 1, marginHorizontal: 10}}
                    onPress={props.resetError}
                />
            </View>
        </View>
    </SafeAreaView>
)

type AppErrorBoundaryProps = ErrorBoundaryProps & {goBack?: any}

export function AppErrorBoundary({ onError, FallbackComponent, goBack, ...props }: AppErrorBoundaryProps) {

    const errorHandler = !onError ? defaultErrorHandler : sequence(defaultErrorHandler, onError)

    function ModifieldFallbackComponent(props: Props){
        return <CustomFallbackComponent goBack={goBack} {...props}/>
    }
    FallbackComponent = ModifieldFallbackComponent

    return <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent} {...props} />
}

export function withErrorBoundary(WrappedComponent) {
    return function (props) {
        const goBack = props.navigation ? props.navigation.goBack : undefined
        return <AppErrorBoundary goBack={goBack}><WrappedComponent {...props} /></AppErrorBoundary>
    }
}

export default AppErrorBoundary






const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex: 1,
        justifyContent: 'center'
    },
    content: {
        marginHorizontal: 16
    },
    title: {
        fontSize: 48,
        fontWeight: '300',
        paddingBottom: 16
    },
    subtitle: {
        fontSize: 32,
        fontWeight: '800'
    },
    error: {
        paddingVertical: 16
    },
    button: {
        backgroundColor: '#2196f3',
        borderRadius: 50,
        padding: 16,
        marginHorizontal: 16,
        flex: 1
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "stretch",
        justifyContent: "space-between"
    }
})
