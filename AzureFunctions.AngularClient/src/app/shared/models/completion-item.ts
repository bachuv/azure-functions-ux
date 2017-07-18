export class CompletionItem implements monaco.languages.CompletionItem{
    label: string;
    kind: monaco.languages.CompletionItemKind;
    detail: string;
    documentation: string;
    filterText: string;
    insertText: string;
    range: monaco.Range;
    sortText: string;
    textEdit: monaco.editor.ISingleEditOperation;

}