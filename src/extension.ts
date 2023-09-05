import { existsSync } from 'fs';
import path = require('path');
import * as vscode from 'vscode';
import { getLocation } from 'jsonc-parser';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(registerTracebackCommand());
	context.subscriptions.push(registerOptionCompletionProvider());
}

function registerOptionCompletionProvider() {
	return vscode.languages.registerCompletionItemProvider({ language: 'jsonc' }, {
		provideCompletionItems(document, position, token, context) {
			if (document.fileName.endsWith('.code-workspace') || document.fileName.match('settings.json')
				|| document.fileName.match('launch.json')) {

				const jsonLocation = getLocation(document.getText(), document.offsetAt(position));
				if (jsonLocation.isAtPropertyKey) {
					return [];
				}
				// show completions only if there is not token present
				if (document.getWordRangeAtPosition(position)) {
					return [];
				}

				const path = jsonLocation.path;
				// support both java and unit test configs
				if (path && (path.at(-1) === 'vmArgs' || path.at(-2) === 'vmArgs') || path.at(-2) === 'vmargs') {
					let range = document.getWordRangeAtPosition(position, /".*"/);
					if (range) {
						range = new vscode.Range(position, position);
						return [{
							label: 'EnableTracebacks',
							detail: 'Enable reactor tracebacks',
							command: 'command:reactorLauncher.tracebacks'
						}].map(i => ({
							label: i.label,
							detail: i.detail,
							range: range,
							insertText: (`\${${i.command}}`)
						}));
					}
				}
			}
			return [];
		}
	});
}

function registerTracebackCommand() {
	return vscode.commands.registerCommand('reactorLauncher.tracebacks', () => {
		const extensionPath = vscode.extensions.getExtension("org-gap.vscode-reactor-launcher")?.extensionPath;
		if (extensionPath) {
			const agentPath = path.join(extensionPath, "ajars/ragent.jar");
			if (existsSync(agentPath)) {
				return `-javaagent:${agentPath}`;
			} else {
				vscode.window.showErrorMessage(`[Reactor Launcher] agent jar not found at path ${agentPath}`);
			}
		}
		return '';
	});
}

export function deactivate() { }
