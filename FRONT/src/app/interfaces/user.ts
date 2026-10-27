export interface User {
    _id? : string;
    name: string;
    email:string;
    password?:string;
    imagen:string;
    rol: 'user' | 'admin';
}

export interface ServerResponse{
    result: string;
    message: string;
    data: User | any;
}
