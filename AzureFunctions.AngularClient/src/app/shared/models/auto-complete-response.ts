export interface AutoCompleteResponse {
    CompletionText: string;
    Description: string;
    DisplayText: string;
    RequiredNamespaceImport: string;
    MethodHeader: string;
    ReturnType: string;
    Snippet: string;
    Kind: string;
    IsSuggestionMode: boolean;
}