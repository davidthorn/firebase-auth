export interface AuthEmailLoginError {
    error: {
        code: number;
        message: string;
        errors: {
            message: string;
            domain: string;
            reason: string;
        }[];
        status: string;
    };
}
