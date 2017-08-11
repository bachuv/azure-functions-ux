import { Commands } from "./commands";
import { Request } from '../shared/models/request';

class RequestQueue {
    private _pending: Request[] = [];
    private _waiting: Map<number, Request> = new Map<number, Request>();

    public constructor(
        private _name: string, 
        private _maxSize: number,
        private _makeRequest: (request: Request) => number){
    }

    public enqueue(request: Request) {
        this._pending.push(request);
    }

    public dequeue(id: number) {
        const request = this._waiting.get(id);
        if (request) {
            this._waiting.delete(id);
        }

        return request;
    }

    public hasPending() {
        return this._pending.length > 0
    }

    public isFull() {
        return this._waiting.size >= this._maxSize;
    }

    public processPending() {
        if(this._pending.length === 0) {
            return;
        }

        const slots = this._maxSize - this._waiting.size;

        for (let i = 0; i < slots && this._pending.length > 0; i++) {
            this._makeRequest(this._pending.shift());
        }
    }

    public cancelRequest(request: Request) {
        let index = this._pending.indexOf(request);
            if (index !== -1) {
                this._pending.splice(index, 1);
                request.onError(new Error(`Pending request cancelled: ${request.command}`));
            }
    }
}

const priorityCommands = ["/updateBuffer"];
const normalCommands = ["/autocomplete"];

export class RequestQueueCollection {
    private _isProcessing: boolean;
    private _normalQueue: RequestQueue;

    public constructor(
        makeRequest: (request: Request) => number
    ){
        this._normalQueue = new RequestQueue('Normal', 5, makeRequest);
    }

    private getQueue() {
        return this._normalQueue;
    }

    public enqueue(request: Request) {
        const queue = this.getQueue();
        queue.enqueue(request);
    }

    public dequeue(command: string, seq: number) {
        const queue = this.getQueue();
        return queue.dequeue(seq);
    }

    public cancelRequest(request: Request) {
        const queue = this.getQueue();
        queue.cancelRequest(request);
    }

    public drain() {
        if(this._isProcessing) {
            return;
        }

        this._isProcessing = true;
    }
}

