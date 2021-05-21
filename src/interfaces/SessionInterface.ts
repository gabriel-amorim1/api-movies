export interface SessionResponseInterface {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}
