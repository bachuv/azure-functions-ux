/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import {Disposable} from 'vscode';

export default class AbstractProvider {

    protected _disposables: Disposable[];

    constructor() {
        this._server = ;
        this._disposables = [];
    }

    dispose() {
        while (this._disposables.length) {
            this._disposables.pop().dispose();
        }
    }
}