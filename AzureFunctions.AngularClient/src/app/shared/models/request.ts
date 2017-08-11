export interface Request {
    command: string;
    data?: any;
    onSuccess(value: any): void;
    onError(err: any): void;
}