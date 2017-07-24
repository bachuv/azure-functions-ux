export module Commands {
    export const autoComplete = "/autocomplete";
    export const updateBuffer = "/updatebuffer";

    export const priorityCommands = [updateBuffer];
    export const normalCommands = [autoComplete];
}