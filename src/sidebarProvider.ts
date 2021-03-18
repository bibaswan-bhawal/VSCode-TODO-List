import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { scanDocument } from "./scanner";

export class SidebarProvider implements vscode.WebviewViewProvider {
	_view?: vscode.WebviewView;
	_doc?: vscode.TextDocument;

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(webviewView: vscode.WebviewView) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this._extensionUri, "media"),
				vscode.Uri.joinPath(this._extensionUri, "out/compiled"),
			],
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'goto':
					let editor = vscode.window.activeTextEditor;

					if(editor){
						let range = editor.document.lineAt(message.line-1).range;
						editor.selection =  new vscode.Selection(range.start, range.end);
						editor.revealRange(range);
					}

				  return;
			  }
			},
			undefined);
	}

	public revive(panel: vscode.WebviewView) {
		this._view = panel;
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const styleResetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
		);
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
		);
		//const styleMainUri = webview.asWebviewUri(
			//vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
		//);
		const styleVSCodeUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
		);
			
		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		let returnVal = scanDocument();
        
        let todoList = returnVal.list;
        let todoLines = returnVal.lines;
		
		if(this._view) {
            this._view.webview.postMessage({ list: todoList,  lines: todoLines });
        }

		return `<!DOCTYPE html>
			<html lang="en">
					<head>
						<meta charset="UTF-8">
						<!--
							Use a content security policy to only allow loading images from https or from our extension directory,
							and only allow scripts that have a specific nonce.
										-->
								<meta http-equiv="Content-Security-Policy" content=" img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
								<meta name="viewport" content="width=device-width, initial-scale=1.0">
								<link href="${styleResetUri}" rel="stylesheet">
								<link href="${styleVSCodeUri}" rel="stylesheet">
								<script nonce="${nonce}">
								</script>
			</head>
						<body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>`;
	}
}