import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'

export interface AuthTokenVerificationResponse {
    payload: { [id:string] : any }
    expired: boolean
    expiresIn: number
}

const googlesecuretokenVerificationUrl = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'

/**
 *Parse the data provided into JSON
 *
 * @param {*} data
 * @returns {{ [id:string] : any }}
 */
const parse = (data: any): { [id:string] : any } => {
    try {
        return typeof data === 'object' ? data : JSON.parse(data)
    } catch(error) {
        return {}
    }
}

/**
 *  Decodes the token provided using the jwt.decode function
 *
 * @param {string} token
 * @returns {Promise<{ kid: string, alg: string }>}
 */
const decodedToken = (token: string): Promise<{ kid: string, alg: string }> => {
    
    const data = jwt.decode(token, {
        complete: true
    })

    if(data === null) return Promise.reject('Invalid JWT')

    const json = parse(data)
    
    if(json.header === undefined) return Promise.reject('Could not retrieve header from token')
    if(json.header.kid === undefined) return Promise.reject('Could not retrieve kid from token')
    if(json.header.alg === undefined) return Promise.reject('Could not retrieve algorithm from token')
   
    return Promise.resolve({
        kid: json.header.kid,
        alg: json.header.alg || 'RS256'
    })
}

/**
 * Retrieves the public key from firebase / google to use with the jwt.verify method
 *
 * @returns {Promise<{ [id:string] : string }>}
 */
const retrievePublicKeyData = async (): Promise<{ [id:string] : string }> => {
    return await fetch(googlesecuretokenVerificationUrl, {
        method: 'GET'
    })
    .then((i:any) => { return i.json() })
}

/**
 * Verifys the firebas jwt using jsonwebtoken
 *
 * @param {string} token
 * @returns {Promise<AuthTokenVerificationResponse>}
 */
const firebaseVerifyAuthToken = async (token: string): Promise<AuthTokenVerificationResponse>  => {
    
    const data = await decodedToken(token).catch(error => {
        throw error
    })

    const { kid , alg } = data

    const publicKeyData = await retrievePublicKeyData().catch(error => {
        throw error
    })

    if(publicKeyData[data.kid] === undefined) return Promise.reject('Could not retrieve signing key')
    
    const publicKey =  publicKeyData[kid]

    const decodedData = new Promise<AuthTokenVerificationResponse>((resolve, reject) => {
        jwt.verify(token , publicKey , {
            algorithms: [alg]
        }, (error, decoded) => {
            if(error) {
                reject(error)
            } else {
                const currentTime = Math.ceil(Date.now() / 1000)
                const obj = parse(decoded)
                resolve({
                    payload: obj,
                    expired: obj.exp <= currentTime , 
                    expiresIn: obj.exp - currentTime 
                })
            }
        })
    })
    .catch(error => {
        
        const errorData = typeof error === 'object' ? error : {}

        return Promise.reject({
            expired: true,
            expiredAt: errorData.expiredAt || undefined,
            name: errorData.name || 'TokenExpiredError',
            message: 'jwt expired'
        })
    })
    
    return Promise.resolve(decodedData)

}

export default firebaseVerifyAuthToken