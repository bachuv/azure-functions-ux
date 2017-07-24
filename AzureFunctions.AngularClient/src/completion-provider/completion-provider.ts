import { MonacoEditorDirective } from '../app/shared/directives/monaco-editor.directive';
import { AutoCompleteRequest } from '../app/shared/models/auto-complete-request';
import { AutoCompleteResponse } from '../app/shared/models/auto-complete-response';
import { getSummaryText } from './documentation';

type CompletionItem = monaco.languages.CompletionItem;
var CompletionItemKind = monaco.languages.CompletionItemKind;
type CompletionItemKind = monaco.languages.CompletionItemKind;
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

                completion.documentation = getSummaryText(response.Description);
                completion.kind = _kinds[response.Kind]|| CompletionItemKind.Property;
                completion.insertText = response.CompletionText.replace(/<>/g, '');

                //TODO: commit characters

                let completionArray = completions[completion.label];
                if (!completionArray) {
                    completion[completion.label] = [completion];
                }else {
                    completionArray.push(completion);
                }
            }

            for(let key in completions) {
                let suggestion = completions[key][0], overloadCount = completions[key].length - 1;

                if(overloadCount === 0) {
                    delete completions[key];
                }else {
                    suggestion.detail = `${suggestion.detail} (+ ${overloadCount} overload(s))`;
                }

                result.push(suggestion);
            }
            return result;
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

const _kinds: { [kind: string]: CompletionItemKind; } = Object.create(null);

_kinds['Class'] = CompletionItemKind.Class;
_kinds['Color'] = CompletionItemKind.Color;
_kinds['Constructor'] = CompletionItemKind.Constructor;
_kinds['Enum'] = CompletionItemKind.Enum;
_kinds['Field'] = CompletionItemKind.Field;
_kinds['File'] = CompletionItemKind.File;
_kinds['Folder'] = CompletionItemKind.Folder;
_kinds['Function'] = CompletionItemKind.Function;
_kinds['Interface'] = CompletionItemKind.Interface;
_kinds['Keyword'] = CompletionItemKind.Keyword;
_kinds['Method'] = CompletionItemKind.Method;
_kinds['Module'] = CompletionItemKind.Module;
_kinds['Property'] = CompletionItemKind.Property;
_kinds['Reference'] = CompletionItemKind.Reference;
_kinds['Snippet'] = CompletionItemKind.Snippet;
_kinds['Text'] = CompletionItemKind.Text;
_kinds['Unit'] = CompletionItemKind.Unit;
_kinds['Value'] = CompletionItemKind.Value;
_kinds['Variable'] = CompletionItemKind.Variable;