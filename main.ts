import { firebaseAuthLoginEmailPassword, firebaseVerifyAuthToken } from './src'
import credentials from './credentials.json'
import { AuthEmailLoginResponse } from './src/AuthEmailLoginResponse';

const email = process.env.EMAIL || credentials.email
const pass = process.env.PASSWORD ||  credentials.password
 
if(email === undefined || pass === undefined) {
    throw new Error('Email and password must be set in the environment variables so as to use this')
} else {
    firebaseAuthLoginEmailPassword({
        credentials: {
            email: email,
            password: pass
        },  
        returnSecureToken: true
    })
    .then((result: AuthEmailLoginResponse) => { return result.idToken })
    .then(firebaseVerifyAuthToken)
    .then((result) => { return result.expired })
    .then((result: boolean) => {
        console.log(`JWT is still active: ${!result}`)
    })
    .catch(error => console.log(error))
}

