import { MonacoEditorDirective } from '../app/shared/directives/monaco-editor.directive';
import { AutoCompleteRequest } from '../app/shared/models/auto-complete-request'
import { AutoCompleteResponse } from '../app/shared/models/auto-complete-response'

type CompletionItem = monaco.languages.CompletionItem;

export class CompletionProvider{
    
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

        return this.autoComplete<AutoCompleteResponse[]>(this._server, req).then(responses => {
            if(!responses){
                return;
            }

            let result : CompletionItem[] = [];
            let completions : { [c: string]: CompletionItem[] } = Object.create(null);
            
            for (let response of responses) {
                let completion : CompletionItem;
                completion.label = response.CompletionText;

                completion.detail = response.ReturnType
                    ? `${response.ReturnType} ${response.DisplayText}`
                    : response.DisplayText;

                //TODO: set rest of CompletionItem attributes
            }
        })
    }

    private autoComplete<TResponse>(server: any, req: AutoCompleteRequest, token ?: monaco.CancellationToken): Promise<TResponse> {        
        let promise = new Promise<TResponse>((resolve, reject) => {
            
        })

        return promise.then(response => {
            return response;
        })
    }
}