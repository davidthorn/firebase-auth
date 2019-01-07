import { firebaseAuthLoginEmailPassword } from './src'

const email = process.env.EMAIL
const pass = process.env.PASSWORD

if(email === undefined || pass === undefined) {
    throw new Error('Email and password must be set in the environment variables so as to use this')
} else {
    firebaseAuthLoginEmailPassword({
        credentials: {
            email: email,
            password: pass
        },  
        returnSecureToken: true
    }).then(result => {
        console.log(result)
    }).catch(error => console.log(error))
}

