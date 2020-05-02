// type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
// type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

export function sequence<T extends (...args: any) => any>(func1:T, func2:T) : T {
    function sequenced(...args : Parameters<T>) : ReturnType<T> {
        func1(...args); return func2(...args);
    }

    return sequenced as T;
}

