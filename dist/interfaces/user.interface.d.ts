export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare enum AuthProvider {
    GOOGLE = "google",
    TWITTER = "twitter"
}
export interface IUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    auth_provider: AuthProvider;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    birth: string;
    job: string;
}
export interface IAuthResponse {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    accessToken: string;
}
