import { MonacoEditorDirective } from '../app/shared/directives/monaco-editor.directive';
import { AutoCompleteRequest } from '../app/shared/models/auto-complete-request'
export class CompletionProvider{
    constructor(){}

    provideCompletionItems(model: any, position: any){
        let wordToComplete = '';
        var textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
        if(textUntilPosition){
            wordToComplete = model.getWordUntilPosition(position);
        }

        let req: AutoCompleteRequest;
        req.wordToComplete = wordToComplete;
        req.wantDocumentationForEveryCompletionResult = true;
        req.wantKind = true;
        req.wantReturnType = true;

        return this.autoComplete<AutoCompleteRequest[]>(this._server, req).then(responses => {

        })
    }

    private autoComplete<TResponse>(server: any, req: AutoCompleteRequest, token ?: monaco.CancellationToken): Promise<TResponse> {
        //TODO: make request to server
        
        let promise = new Promise<TResponse>((resolve, reject) => {
            
        })

        return promise.then(response => {
            return response;
        })
    }
}