import { Commands } from "./commands";
import { Request } from '../app/shared/models/request';

class RequestQueue {
    private _pending: Request[] = [];
    private _waiting: Map<number, Request> = new Map<number, Request>();

    public constructor(
        private _name: string ){}

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
    private _priorityQueue: RequestQueue;
    private _normalQueue: RequestQueue;
    private _deferredQueue: RequestQueue;

    public constructor(){
        this._priorityQueue = new RequestQueue('Priority');
        this._normalQueue = new RequestQueue('Normal');
        this._deferredQueue = new RequestQueue('Deferred');
    }

    private getQueue(command: string) {
        if (this.isPriorityCommand(command)) {
            return this._priorityQueue;
        } else if (this.isNormalCommand(command)) {
            return this._normalQueue;
        } else {
            return this._deferredQueue;
        }
    }

    private isPriorityCommand(command: string) {
        return Commands.priorityCommands.includes(command);
    }

    private isNormalCommand(command: string) {
        return Commands.normalCommands.includes(command);
    }

    public enqueue(request: Request) {
        const queue = this.getQueue(request.command);
        queue.enqueue(request);
    }

    public dequeue(command: string, seq: number) {
        const queue = this.getQueue(command);
        queue.dequeue(seq);
    }

    public cancelRequest(request: Request) {
        const queue = this.getQueue(request.command);
        queue.cancelRequest(request);
    }
}

