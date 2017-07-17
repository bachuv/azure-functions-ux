/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as protocol from './protocol';
import * as vscode from 'vscode';

export function toLocation(location: protocol.ResourceLocation | protocol.QuickFix): vscode.Location {
    const fileName = vscode.Uri.file(location.FileName);
    const position = new vscode.Position(location.Line - 1, location.Column - 1);

    const endLine = (<protocol.QuickFix>location).EndLine;
    const endColumn = (<protocol.QuickFix>location).EndColumn;

    if (endLine !== undefined && endColumn !== undefined) {
        const endPosition = new vscode.Position(endLine - 1, endColumn - 1);
        return new vscode.Location(fileName, new vscode.Range(position, endPosition));
    }

    return new vscode.Location(fileName, position);
}

export function toRange(rangeLike: { Line: number; Column: number; EndLine: number; EndColumn: number; }): vscode.Range {
    let {Line, Column, EndLine, EndColumn} = rangeLike;
    return new vscode.Range(Line - 1, Column - 1, EndLine - 1, EndColumn - 1);
}

export function toRange2(rangeLike: { StartLine: number; StartColumn: number; EndLine: number; EndColumn: number; }): vscode.Range {
    let {StartLine, StartColumn, EndLine, EndColumn} = rangeLike;
    return new vscode.Range(StartLine - 1, StartColumn - 1, EndLine - 1, EndColumn - 1);
}

export function createRequest<T extends protocol.Request>(document: vscode.TextDocument, where: vscode.Position | vscode.Range, includeBuffer: boolean = false): T {

    let Line: number, Column: number;

    if (where instanceof vscode.Position) {
        Line = where.line + 1;
        Column = where.character + 1;
    } else if (where instanceof vscode.Range) {
        Line = where.start.line + 1;
        Column = where.start.character + 1;
    }

    // for metadata sources, we need to remove the [metadata] from the filename, and prepend the $metadata$ authority
    // this is expected by the Omnisharp server to support metadata-to-metadata navigation
    let fileName = document.uri.scheme === "omnisharp-metadata" ? 
        `${document.uri.authority}${document.fileName.replace("[metadata] ", "")}` : 
        document.fileName;

    let request: protocol.Request = {
        FileName: fileName,
        Buffer: includeBuffer ? document.getText() : undefined,
        Line,
        Column
    };

    return <T>request;
}

export function toDocumentSymbol(bucket: vscode.SymbolInformation[], node: protocol.Node, containerLabel?: string): void {

    let ret = new vscode.SymbolInformation(node.Location.Text, kinds[node.Kind],
        toRange(node.Location),
        undefined, containerLabel);

    if (node.ChildNodes) {
        for (let child of node.ChildNodes) {
            toDocumentSymbol(bucket, child, ret.name);
        }
    }
    bucket.push(ret);
}

let kinds: { [kind: string]: vscode.SymbolKind; } = Object.create(null);
kinds['NamespaceDeclaration'] = vscode.SymbolKind.Namespace;
kinds['ClassDeclaration'] = vscode.SymbolKind.Class;
kinds['FieldDeclaration'] = vscode.SymbolKind.Field;
kinds['PropertyDeclaration'] = vscode.SymbolKind.Property;
kinds['EventFieldDeclaration'] = vscode.SymbolKind.Property;
kinds['MethodDeclaration'] = vscode.SymbolKind.Method;
kinds['EnumDeclaration'] = vscode.SymbolKind.Enum;
kinds['StructDeclaration'] = vscode.SymbolKind.Enum;
kinds['EnumMemberDeclaration'] = vscode.SymbolKind.Property;
kinds['InterfaceDeclaration'] = vscode.SymbolKind.Interface;
kinds['VariableDeclaration'] = vscode.SymbolKind.Variable;