export class AutoCompleteRequest {
    fileName: string;
    line: number;
    Column: number;
    wordToComplete: string;
    wantDocumentationForEveryCompletionResult: boolean;
    wantKind: boolean;
    wantReturnType: boolean;
}