export interface Request {
    command: string;
    arguments?: any;
    clientId: number;

    onSuccess(value: any): void;
    onError(err: any): void;
}