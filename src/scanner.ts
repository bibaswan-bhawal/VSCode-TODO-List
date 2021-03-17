import * as vscode from 'vscode';

export function scanDocument() {
    const editor = vscode.window.activeTextEditor;
    
    let todoList: string[] = [];
    let todoListLine: string[] = [];

        if(editor){
            let document = editor.document;

            const documentText = document.getText();

            let lineCounter = 1;

            for (var i = 0; i < documentText.length; i++){

                if(documentText[i] === '\n'){
                    lineCounter++;
                }

                if(documentText.substr(i, 8) === "//TODO: "){

                    var eol = documentText.substr(i).indexOf('\n') + i;
                    var comment = documentText.substring(i + 8, eol);

                    if (eol !== -1 && eol > i){
                        todoList.push(`${comment} Line: ${lineCounter}`);
                        todoListLine.push(lineCounter.toString());
                    }
                }
            }
        }
    
    return {list: todoList, lines: todoListLine};
}