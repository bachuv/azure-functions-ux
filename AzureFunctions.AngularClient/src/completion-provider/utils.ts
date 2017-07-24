import { Server } from './server';
import { AutoCompleteRequest } from '../app/shared/models/auto-complete-request';
import { AutoCompleteResponse } from '../app/shared/models/auto-complete-response';
import { UpdateBufferRequest } from '../app/shared/models/update-buffer-request';

const autoCompleteRequest = "/autocomplete";
const updateBufferRequest = "/updateBuffer";

export function autoComplete(server: Server, request: AutoCompleteRequest){
    return server.makeRequest<AutoCompleteResponse[]>(autoCompleteRequest, request);
}

export function updateBuffer(server: Server, request: UpdateBufferRequest) {
    return server.makeRequest<boolean>(updateBufferRequest, request);
}