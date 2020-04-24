import { useEffect, useReducer } from 'react';

export function delay(delay: Number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

interface AsyncActionState<ResType> {
  hasRun: boolean,
  isWorking: boolean,
  result?: ResType,
  error?: boolean | string
}

interface AsyncAction<ResType> {
  type: string,
  result?: ResType,
  error?: boolean | string
}


function asyncActionReducer<ResType>(state: AsyncActionState<ResType>, action: AsyncAction<ResType>) {
  switch (action.type) {
    case 'INIT':
      return { ...state, isWorking: true, error: false, result: undefined };
    case 'SUCCESS':
      return { ...state, hasRun: true, isWorking: false, result: action.result };
    case 'FAIL':
      return { ...state, hasRun: true, isWorking: false, error: action.error };
    default:
      return state;
  }
}
export function useAsyncAction<ResType>(func: () => Promise<ResType>) {
  const [state, dispatch] = useReducer(asyncActionReducer,
    { hasRun: false, isWorking: false, error: undefined, result: undefined });

  useEffect(() => {
    let componentIsMounted = true;
    async function doAsyncCall() {
      dispatch({ type: 'INIT' });
      try {
        const result: ResType = await func();
        if (componentIsMounted)
          dispatch({ type: 'SUCCESS', result });
      }
      catch (error) {
        if (componentIsMounted)
          dispatch({ type: 'FAIL', error });
      }
    }
    doAsyncCall();
    return () => { componentIsMounted = false; };
  }, [func, dispatch]);
  return state;
}
