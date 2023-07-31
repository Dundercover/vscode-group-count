// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Extension "group-count" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('group-count', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World from group-count!');

    // vscode.window.showTextDocument(document, {
    // 	viewColumn: vscode.ViewColumn.Beside
    // });

    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    const document = editor.document;
    const selections = editor.selections;

    console.log('selections.length: ' + selections.length);
    console.log('selection[0].isEmpty: ' + selections[0].isEmpty);

    const texts = selections.every((s) => s.isEmpty)
      ? [document.getText()]
      : selections.filter((s) => !s.isEmpty).map(document.getText);

    const words = texts
      .flatMap((text) => text.match(/(\S+)/g))
      .filter((text): text is string => !!text)
      .reduce((result, word) => {
        if (result[word]) {
          result[word] += 1;
        } else {
          result[word] = 1;
        }
        return result;
      }, {} as { [key: string]: number });

    vscode.workspace
      .openTextDocument({
        content: Object.entries(words)
          .sort(([_w1, c1], [_w2, c2]) => c2 - c1)
          .map(([word, count]) => `${word}: ${count}`)
          .join('\n'),
        language: 'text',
      })
      .then((newDocument) => {
        vscode.window.showTextDocument(newDocument, {
          viewColumn: vscode.ViewColumn.Beside,
        });
      });
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
