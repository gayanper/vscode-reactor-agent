import { existsSync } from 'fs';
import path = require('path');
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.debug.registerDebugConfigurationProvider("java", {
		resolveDebugConfiguration(folder, debugConfiguration, token) {
			if (debugConfiguration.enableTracebacks) {
				const extensionPath = vscode.extensions.getExtension("org-gap.vscode-reactor-launcher")?.extensionPath;
				if (extensionPath) {
					const agentPath = path.join(extensionPath, "ajars/ragent.jar");
					if (existsSync(agentPath)) {
						const agentParam = `-javaagent:${agentPath}`;
						if (debugConfiguration.vmArgs) {
							debugConfiguration.vmArgs.unshift([agentParam]);
						} else {
							debugConfiguration.vmArgs = [agentParam];
						}
					} else {
						vscode.window.showErrorMessage(`[Reactor Agent] agent jar not found at path ${agentPath}`);
					}
				}
			}
			return debugConfiguration;
		},
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }
