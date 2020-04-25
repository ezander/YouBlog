import firebaseConfig from '../firebaseConfig.json'
import {authUrl, signUpUser } from './FirebaseAuthTools'
import {FirebaseError} from './FirebaseTools'


test('authUrl', () => {
    expect(
        authUrl('/foobar', firebaseConfig)
    ).toBe("https://identitytoolkit.googleapis.com/v1/foobar?key=AIzaSyAQTVQFCvpyWy9KDXTz2NZcHllUsaNWdvY")

    expect(
        authUrl('/foobar', firebaseConfig, "a=3&b=4")
    ).toBe("https://identitytoolkit.googleapis.com/v1/foobar?key=AIzaSyAQTVQFCvpyWy9KDXTz2NZcHllUsaNWdvY&a=3&b=4")
});



describe('signUpUser', () => {

    test('invalid email', () => {
        expect.assertions(2)
        return signUpUser({ email: "foo", password: "xxx123" }, firebaseConfig).catch(reason => {
            Promise.all([
                expect(reason).toBeInstanceOf(FirebaseError),
                expect(reason.message).toMatch("INVALID_EMAIL")
            ])
        })
    })

    test('missing password', () => {
        expect.assertions(2)
        return signUpUser({ email: "foo@bar.com", password: "" }, firebaseConfig).catch(reason => {
            Promise.all([
                expect(reason).toBeInstanceOf(FirebaseError),
                expect(reason.message).toMatch("MISSING_PASSWORD")
            ])
        })
    })

    test('weak password', () => {
        expect.assertions(2)
        return signUpUser({ email: "foo@bar.com", password: "xxx" }, firebaseConfig).catch(reason => {
            Promise.all([
                expect(reason).toBeInstanceOf(FirebaseError),
                expect(reason.message).toMatch("WEAK_PASSWORD")
            ])
        })
    })


    test('email exists', async () => {
        // with test we more or less also now that signing up works...
        expect.assertions(2)
        try {
            await signUpUser({ email: "foo2@bar.com", password: "xxx123" }, firebaseConfig)
            await signUpUser({ email: "foo2@bar.com", password: "xxx123" }, firebaseConfig)
        }
        catch (error) {
            expect(error).toBeInstanceOf(FirebaseError)
            expect(error.message).toMatch(/^EMAIL_EXISTS/)
        }
    })

})
