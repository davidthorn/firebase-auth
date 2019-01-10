import fetch , { Response }  from 'node-fetch'
import { AuthEmailLoginParams } from './AuthEmailLoginParams';
import { AuthEmailLoginResponse } from './AuthEmailLoginResponse';
import { AuthEmailLoginError } from './AuthEmailLoginError';
import { firebase } from '../package.json'

const path = '/identitytoolkit/v3/relyingparty/'

const firebaseSignupEmailPassword = async (params: AuthEmailLoginParams) => {

    let host: string = ''
    let port: string = ''

    switch(firebase.mode) {
        case 'dev': 
        port = `:${firebase.dev.port}`
        host = `http://${firebase.dev.url}${port}`
        break;
        default:
        host = firebase.prod.url
        break;
    }

    const { email , password } = params.credentials

    return await fetch(`${host}${path}signupNewUser?key=${params.API_KEY}` , {
        method: 'POST',
        body: JSON.stringify({ 
            email: email ,  
            password, 
            returnSecureToken: params.returnSecureToken  
        }),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then(async (value: Response) => { 
        switch(value.status) {
            case 200:
            const info: AuthEmailLoginResponse = await value.json()
            return Promise.resolve(info)
            default:
            const error: AuthEmailLoginError = await value.json()
            return Promise.reject(error) 
        }
    })
}

export default firebaseSignupEmailPassword

