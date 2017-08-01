import { RequestQueueCollection } from './request-queue';
import { Request } from '../shared/models/request';
import { WireProtocol } from '../shared/models/wire-protocol';
import { AutoCompleteResponse } from '../shared/models/auto-complete-response';

enum ServerState {
    Starting,
    Started,
    Stopped
}

export interface IServer {
    makeRequest<TResponse>(command: string, data?: any, token?: monaco.CancellationToken): Promise<TResponse>;
}

export class DummyServer implements IServer {
    private _requestQueue: RequestQueueCollection;
    private _state: ServerState = ServerState.Stopped;
    private static _nextId = 1;

    public makeRequest<TResponse>(command: string, data?: any, token?: monaco.CancellationToken): Promise<TResponse> {

        let promise = new Promise<TResponse>((resolve, reject) => {
            if(command === "/autocomplete"){
                resolve(this.getDummyData()); 
            }else if(command === "/updatebuffer"){
                resolve(null);
            }
        });

       return promise;      
    }

    private _makeRequest(request: Request) {
        return DummyServer._nextId++;
    }

    private getDummyData() : any {
        let dummyData  =  new AutoCompleteResponse();
        dummyData.CompletionText = "Length";
        dummyData.Description = "length of the array";  
        dummyData.DisplayText = "Length";
        dummyData.ReturnType = "int";
        dummyData.Kind = "Property";

        let dummyData2  =  new AutoCompleteResponse();
        dummyData2.CompletionText = "LastIndexOf";
        dummyData2.Description = "Reports the zero-based index position of the last occurrence of a specified Unicode character within this instance.";  
        dummyData2.DisplayText = "LastIndexOf(String)";
        dummyData2.ReturnType = "int";
        dummyData2.Kind = "Method";

        let dummyData3  =  new AutoCompleteResponse();
        dummyData3.CompletionText = "last";
        dummyData3.Description = "asdfasdf";  
        dummyData3.DisplayText = "asdfasdfasdf";
        dummyData3.ReturnType = "sdf";
        dummyData3.Kind = "Variable";
    
        return [dummyData, dummyData2, dummyData3]; 
    }
}