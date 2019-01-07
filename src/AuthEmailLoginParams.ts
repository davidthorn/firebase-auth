import { AuthCredentials } from './AuthCredentials';
export interface AuthEmailLoginParams {
    credentials: AuthCredentials;
    returnSecureToken: boolean;
}
