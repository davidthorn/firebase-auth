import express, { Request, Response } from 'express'

import { firebase } from '../package.json'
import bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json({}))
app.post('/identitytoolkit/v3/relyingparty/verifyPassword', (request: Request, response: Response) => {

    if(request.headers['mode'] === 'fail') {
        response.status(200).send({
            "error": {
                "errors": [
                  {
                    "domain": "global",
                    "reason": "invalid",
                    "message": "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
                  }
                ],
                "code": 400,
                "message": "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
              }
    
        })
    } else {
        response.status(200).send({
            kind: "identitytoolkit#VerifyPasswordResponse",
            localId: "localId",
            email: request.body.email,
            displayName: "",
            idToken: "idToken",
            registered: true,
            refreshToken: "refresh_token",
            expiresIn: 3600
    
        })
    }
})

app.listen(firebase.dev.port, firebase.dev.url, () => {
    console.dir('listening', { colors: true })
})