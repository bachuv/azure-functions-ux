import { RequestQueueCollection } from './request-queue';
import { Request } from '../app/shared/models/request';

enum ServerState {
    Starting,
    Started,
    Stopped
}

export class Server {
    private _requestQueue: RequestQueueCollection;

    public constructor(){
        this._requestQueue = new RequestQueueCollection();
    }
    
    public makeRequest<TResponse>(command: string, data?: any, token?: monaco.CancellationToken): Promise<TResponse> {

        if (this._getState() !== ServerState.Started) {
            return Promise.reject<TResponse>('server has been stopped or not started');
        }

        let startTime: number;
        let request: Request;

        let promise = new Promise<TResponse>((resolve, reject) => {
            startTime = Date.now();

            request = {
                command,
                data,
                onSuccess: value => resolve(value),
                onError: err => reject(err)
            };

            this._requestQueue.enqueue(request);
        });

        if (token) {
            token.onCancellationRequested(() => {
                this._requestQueue.cancelRequest(request);
            });
        }

        return promise.then(response => {
            let endTime = Date.now();
            let elapsedTime = endTime - startTime;
            this._recordRequestDelay(command, elapsedTime);

            return response;
        });
    }
}