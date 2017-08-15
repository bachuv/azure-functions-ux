import { MonacoEditorDirective } from '../shared/directives/monaco-editor.directive';
import { AutoCompleteRequest } from '../shared/models/auto-complete-request';
import { AutoCompleteResponse } from '../shared/models/auto-complete-response';
import { getSummaryText } from './documentation';
import { IServer, LanguageServiceServer } from './server';

type CompletionItem = monaco.languages.CompletionItem;
type CompletionItemKind = monaco.languages.CompletionItemKind;

const autoCompleteRequest = "/autocomplete";

export class CompletionProvider{
    private _server: IServer;
    private _editor: MonacoEditorDirective;

    constructor(private monacoEditor: MonacoEditorDirective) {
        this._server = new LanguageServiceServer();
        this._editor = monacoEditor;
    }

    provideCompletionItems(model: any, position: any){
        let wordToComplete: any;
        var textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
        if(textUntilPosition){
            wordToComplete = model.getWordUntilPosition(position);
        }
        else{
            return;
        }
        
        let req: AutoCompleteRequest = new AutoCompleteRequest();
        req.fileName = this.monacoEditor._functionInfo.name + "\\" + this.monacoEditor._fileName;
        req.line = position.lineNumber;
        req.Column = position.column;
        req.wordToComplete = wordToComplete.word;
        req.wantDocumentationForEveryCompletionResult = true;
        req.wantKind = true;
        req.wantReturnType = true;

        let completionSuggestion : any;

        return this._server.makeRequest<AutoCompleteResponse[]>(autoCompleteRequest, req).then(responses => {
            if(!responses){
                return;
            }
            
            let result : CompletionItem[] = [];
            let completions : { [c: string]: CompletionItem[] } = Object.create(null);
            
            for (let response of responses) {
                let completion : CompletionItem = {
                    label : response.CompletionText,
                    detail : response.ReturnType
                        ? `${response.ReturnType} ${response.DisplayText}`
                        : response.DisplayText,
                    documentation : getSummaryText(response.Description),
                    kind : _kinds[response.Kind]|| monaco.languages.CompletionItemKind.Method,
                    insertText : response.CompletionText.replace(/<>/g, '')
                }
 
                let completionArray = [];
                
                completionArray = completions[completion.label];
                if (!completionArray) {
                    completions[completion.label] = [completion];
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
}

const _kinds: { [kind: string]: CompletionItemKind; } = Object.create(null);

// _kinds['Class'] = CompletionItemKind.Class;
// _kinds['Color'] = CompletionItemKind.Color;
// _kinds['Constructor'] = CompletionItemKind.Constructor;
// _kinds['Enum'] = CompletionItemKind.Enum;
// _kinds['Field'] = CompletionItemKind.Field;
// _kinds['File'] = CompletionItemKind.File;
// _kinds['Function'] = CompletionItemKind.Function;
// _kinds['Interface'] = CompletionItemKind.Interface;
// _kinds['Keyword'] = CompletionItemKind.Keyword;
// _kinds['Method'] = CompletionItemKind.Method;
// _kinds['Module'] = CompletionItemKind.Module;
//_kinds['Property'] = monaco.languages.CompletionItemKind.Property;
// _kinds['Reference'] = CompletionItemKind.Reference;
// _kinds['Snippet'] = CompletionItemKind.Snippet;
// _kinds['Text'] = CompletionItemKind.Text;
// _kinds['Unit'] = CompletionItemKind.Unit;
// _kinds['Value'] = CompletionItemKind.Value;
// _kinds['Variable'] = CompletionItemKind.Variable;