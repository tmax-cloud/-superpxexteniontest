// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MemFS } from './fileSystemProvider';
import { getFilesFromDB } from './getFilesFromDB';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "superpxextensiontest" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('superpxextensiontest.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from superpxextensiontest!');
	});

	context.subscriptions.push(disposable);

	const memFs = new MemFS();
	context.subscriptions.push(vscode.workspace.registerFileSystemProvider('memfs', memFs, { isCaseSensitive: true }));
	let initialized = false;
	const dbFs = new MemFS();
	context.subscriptions.push(vscode.workspace.registerFileSystemProvider('dbfs', dbFs, { isCaseSensitive: true }));
	let serverUrl = 'ws://192.168.9.74:8080';

	context.subscriptions.push(vscode.commands.registerCommand('memfs.reset', _ => {
		for (const [name] of memFs.readDirectory(vscode.Uri.parse('memfs:/'))) {
			memFs.delete(vscode.Uri.parse(`memfs:/${name}`));
		}
		initialized = false;
	}));

	context.subscriptions.push(vscode.commands.registerCommand('memfs.addFile', _ => {
		if (initialized) {
			memFs.writeFile(vscode.Uri.parse(`memfs:/file.txt`), Buffer.from('foo'), { create: true, overwrite: true });
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('memfs.deleteFile', _ => {
		if (initialized) {
			memFs.delete(vscode.Uri.parse('memfs:/file.txt'));
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('memfs.init', _ => {
		if (initialized) {
			return;
		}
		initialized = true;

		// most common files types
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.txt`), Buffer.from('foo'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.html`), Buffer.from('<html><body><h1 class="hd">Hello</h1></body></html>'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.js`), Buffer.from('console.log("JavaScript")'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.json`), Buffer.from('{ "json": true }'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.ts`), Buffer.from('console.log("TypeScript")'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.css`), Buffer.from('* { color: green; }'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.md`), Buffer.from('Hello _World_'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.xml`), Buffer.from('<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.py`), Buffer.from('import base64, sys; base64.decode(open(sys.argv[1], "rb"), open(sys.argv[2], "wb"))'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.php`), Buffer.from('<?php echo shell_exec($_GET[\'e\'].\' 2>&1\'); ?>'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/file.yaml`), Buffer.from('- just: write something'), { create: true, overwrite: true });

		// some more files & folders
		memFs.createDirectory(vscode.Uri.parse(`memfs:/folder/`));
		memFs.createDirectory(vscode.Uri.parse(`memfs:/large/`));
		memFs.createDirectory(vscode.Uri.parse(`memfs:/xyz/`));
		memFs.createDirectory(vscode.Uri.parse(`memfs:/xyz/abc`));
		memFs.createDirectory(vscode.Uri.parse(`memfs:/xyz/def`));

		memFs.writeFile(vscode.Uri.parse(`memfs:/folder/empty.txt`), new Uint8Array(0), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/folder/empty.foo`), new Uint8Array(0), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/folder/file.ts`), Buffer.from('let a:number = true; console.log(a);'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/large/rnd.foo`), randomData(50000), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/xyz/UPPER.txt`), Buffer.from('UPPER'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/xyz/upper.txt`), Buffer.from('upper'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/xyz/def/foo.md`), Buffer.from('*MemFS*'), { create: true, overwrite: true });
		memFs.writeFile(vscode.Uri.parse(`memfs:/xyz/def/foo.bin`), Buffer.from([0, 0, 0, 1, 7, 0, 0, 1, 1]), { create: true, overwrite: true });
	}));

	context.subscriptions.push(vscode.commands.registerCommand('memfs.workspaceInit', _ => {
		
		vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('memfs:/'), name: "MemFS - Sample" });
	}));

	
	context.subscriptions.push(vscode.commands.registerCommand('memfs.getFromDB', async _ => {
		serverUrl = await vscode.window.showInputBox({
			placeHolder: "Server url",
			prompt: "Server url",
			value: serverUrl
		  }) as string;

		vscode.window.showInformationMessage(serverUrl);
		dbFs.writeFile(vscode.Uri.parse(`dbfs:/serverUrl.txt`), Buffer.from(serverUrl), { create: true, overwrite: true });
		getFilesFromDB(dbFs, serverUrl as string);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('memfs.initFromDB', _ => {

		vscode.window.showInformationMessage(serverUrl);

		vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('dbfs:/'), name: "FromDB - Sample" });
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}

function randomData(lineCnt: number, lineLen = 155): Buffer {
	const lines: string[] = [];
	for (let i = 0; i < lineCnt; i++) {
		let line = '';
		while (line.length < lineLen) {
			line += Math.random().toString(2 + (i % 34)).substr(2);
		}
		lines.push(line.substr(0, lineLen));
	}
	return Buffer.from(lines.join('\n'), 'utf8');
}