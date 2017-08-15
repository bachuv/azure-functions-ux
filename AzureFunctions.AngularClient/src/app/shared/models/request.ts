export interface Request {
    command: string;
    data?: any;
    clientId: number;
    
    onSuccess(value: any): void;
    onError(err: any): void;
}