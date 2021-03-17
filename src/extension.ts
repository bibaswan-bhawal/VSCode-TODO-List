import * as vscode from 'vscode';
import { scanDocument } from './scanner';
import { SidebarProvider } from './sidebarProvider';
// TODO
export function activate(context: vscode.ExtensionContext) {

    const sidebarProvider = new  SidebarProvider (context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("todo-list-sidebar", sidebarProvider)
    );

    vscode.window.onDidChangeActiveTextEditor(async changeEvent => {
        if(changeEvent !== undefined){
            let returnVal = scanDocument();
        
            let todoList = returnVal.list;
            let todoLines = returnVal.lines;

            if(sidebarProvider._view) {
                sidebarProvider._view.webview.postMessage({ list: todoList,  lines: todoLines });
            }
        } else {
            if(sidebarProvider._view) {
                sidebarProvider._view.webview.postMessage({ list: [],  lines: [] });
            } 
        }
    });

    vscode.workspace.onDidChangeTextDocument(async changeEvent => {
        let returnVal = scanDocument();

        let todoList = returnVal.list;
        let todoLines = returnVal.lines;

        if(sidebarProvider._view) {
            sidebarProvider._view.webview.postMessage({ list: todoList,  lines: todoLines });
        }    
    });
      
}

export function deactivate() {}

