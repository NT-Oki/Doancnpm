export interface UserRegisterRequest {
    email: string,
    password: string,
    name: string,
    gender: boolean,
    phoneNumber: string,
}

export interface UserLoginRequest {
    email: string,
    password: string,
    rememberMe: boolean
}