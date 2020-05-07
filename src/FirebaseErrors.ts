import { AxiosResponse } from "axios"
import { FirebaseError, ErrorType, HTTPError } from "./FirebaseTools"

export function createError(response: AxiosResponse) {
    const { status, statusText, data, config } = response
    const { url, method, params } = config

    const { code, message, status: fb_status } = data.error || {}

    switch (status) {
        case 400:
            return new FirebaseError(
                "Bad request to Firestore database: " + message,
                ErrorType.INTERNAL_PROBLEM,
                {
                    cause: "Wrong usage of the API",
                    details: "The API call was incorrectly formatted" +
                        `${message} (${code} - ${fb_status})`,
                    data: { config, data },
                    resolutions: ["Call the programmer"],
                    title: "Internal error"
                })
        case 401:
            return new FirebaseError(
                "Authorisation problem: " + message,
                ErrorType.INVALID_DATA, // make this a subtype
                {
                    cause: "Authorisation needed for this request",
                    details: "The API call needs authorisation and you didn't login or are not allowed to perform this request." +
                        `${message} (${code} - ${fb_status})`,
                    data: { config, data },
                    resolutions: ["Try to login"],
                    title: "Authorization error"
                })
        case 403:
            // console.log("Axios Error 403", response)
            return new FirebaseError(
                "Authorisation problem: " + message,
                ErrorType.INVALID_DATA, // make this a subtype
                {
                    cause: "Insufficient Authorisation for this request",
                    details: "The API call needs authorisation and you didn't login or are not allowed to perform this request." +
                        `${message} (${code} - ${fb_status})`,
                    data: { config, data },
                    resolutions: ["Try to login"],
                    title: "Authorization error"
                })
        case 404:
            return new FirebaseError(
                "Resource not found: " + message,
                ErrorType.INVALID_DATA, // make this a subtype
                {
                    cause: "The resource was not found",
                    details: `${message} (${code} - ${fb_status})`,
                    data: { config, data },
                    resolutions: [],
                    title: "Resource not found"
                })
        default:
            return new HTTPError(
                "Unknown problem: " + message,
                ErrorType.INTERNAL_PROBLEM, // it defintely is, even if it isn't, since we're not correctly treating it
                {
                    cause: "Unknown cause",
                    details: `${message} (${code} - ${fb_status})`,
                    data: { config, data },
                    resolutions: ["Try to login"],
                    title: "Authorization error"
                })
    }
}

