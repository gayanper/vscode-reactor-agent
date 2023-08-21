import { existsSync } from 'fs';
import path = require('path');
import * as vscode from 'vscode';

const TEST_ARG = "enableTracebacks";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.debug.registerDebugConfigurationProvider("java", {
		resolveDebugConfiguration(folder, debugConfiguration, token) {
			if (isEnabled(debugConfiguration)) {
				const extensionPath = vscode.extensions.getExtension("org-gap.vscode-reactor-launcher")?.extensionPath;
				if (extensionPath) {
					const agentPath = path.join(extensionPath, "ajars/ragent.jar");
					if (existsSync(agentPath)) {
						const agentParam = `-javaagent:${agentPath}`;
						if (debugConfiguration.vmArgs) {
							updateExistingValue(debugConfiguration, agentParam);
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

function updateExistingValue(debugConfiguration: vscode.DebugConfiguration, agentParam: string) {
	if (Array.isArray(debugConfiguration.vmArgs)) {
		debugConfiguration.vmArgs.unshift([agentParam]);
	} else {
		debugConfiguration.vmArgs = (debugConfiguration.vmArgs as string).concat(' ').concat(agentParam);
	}
}

function isEnabled(debugConfiguration: vscode.DebugConfiguration): boolean {
	if (debugConfiguration.enableTracebacks) {
		return true;
	} else if (debugConfiguration.vmArgs) {
		if (Array.isArray(debugConfiguration.vmArgs)) {
			const result = (debugConfiguration.vmArgs as Array<string>).includes(TEST_ARG);
			if (result) {
				const argArray = debugConfiguration.vmArgs as Array<string>;
				argArray.splice(argArray.indexOf(TEST_ARG), 1);
			}
			return result;
		} else {
			const result = (debugConfiguration.vmArgs as string).includes(TEST_ARG);
			if (result) {
				debugConfiguration.vmArgs = (debugConfiguration.vmArgs as string).replace(" ".concat(TEST_ARG), "");
			}
			return result;
		}
	}
	return false;
}

export function deactivate() { }
