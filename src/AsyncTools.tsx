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

// type AsyncActionState<ResType> =
//   | {hasRun: false, isWorking: boolean, result: undefined}
//   | {hasRun: true, isWorking: boolean, result: ResType}
//   | {hasRun: true, isWorking: boolean, error: boolean | string}

type AsyncAction<ResType> = 
  | {type: "INIT"}
  | {type: "SUCCESS", result: ResType}
  | {type: "FAIL", error: boolean | string}


function asyncActionReducer<ResType>(state: AsyncActionState<ResType>, action: AsyncAction<ResType>)
: AsyncActionState<ResType>
{
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
interface ActionReducerType<ResType> {
  (state: AsyncActionState<ResType>, action: AsyncAction<ResType>): AsyncActionState<ResType>  
}

export function useAsyncAction<ResType>(func: () => Promise<ResType>) 
: AsyncActionState<ResType>
{
  const initialState = { hasRun: false, isWorking: false, error: undefined, result: undefined } as AsyncActionState<ResType>
  const reducer : ActionReducerType<ResType> = asyncActionReducer
  const [state, dispatch] = useReducer(reducer, initialState)

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
