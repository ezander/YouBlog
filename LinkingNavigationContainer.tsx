import { getStateFromPath, NavigationContainer, NavigationContainerProps, NavigationContainerRef, useLinking } from '@react-navigation/native';
import { LinkingOptions } from '@react-navigation/native/lib/typescript/src/types';
import React, { useRef } from 'react';

export type ThenArg<T> = T extends Promise<infer U> ? U : undefined

export type LinkingNavigationContainerProps = NavigationContainerProps & {
    linking: LinkingOptions,
    fallback: JSX.Element
}

export function LinkingNavigationContainer<Props>({ linking, fallback, ...props }: LinkingNavigationContainerProps) {
    linking.getStateFromPath = (path: Parameters<typeof getStateFromPath>[0], options: Parameters<typeof getStateFromPath>[1]): any => {
        // Return a state object here
        // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
        console.log("getStateFromPath: ", path, options)
    
        const state = getStateFromPath(path, options)
        // console.log("State: ", state)
        return state
      }
    

    const ref = useRef<NavigationContainerRef>(null);
    const { getInitialState } = useLinking(ref, linking);
    const [isReady, setIsReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState<ThenArg<ReturnType<typeof getInitialState>>>();
    React.useEffect(() => {
        getInitialState()
            .catch(() => { })
            .then(state => {
                if (state !== undefined) {
                    // @ts -ignore
                    setInitialState(state);
                }
                setIsReady(true);
            });
    }, [getInitialState]);
    if (!isReady) {
        return fallback;
    }
    return <NavigationContainer initialState={initialState} ref={ref} {...props} />;
}
