const path = require('path')
const slash = require('slash')
const concat = ([a1,a2]) => a1.concat(a2)

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // var findFiles = require("./findFiles")


    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "quick-require" is now active!');
    const startOfFile = new vscode.Position(0,0)

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerTextEditorCommand('extension.quickRequire', function (editor) {
        // The code you place here will be executed every time your command is executed

        const filePath = editor.document.fileName
        const fileDir = slash(path.dirname(filePath))


        var selection = editor.selection;
        const cursorPosition = selection.active
        var range = editor.document.getWordRangeAtPosition(cursorPosition)
        if (range.isEmpty) return vscode.window.showInformationMessage("Aucun nom de variable détecté")
        var variableName = editor.document.getText(range)
        const localModules = vscode.workspace.findFiles(`**/${variableName}.js`,`**/node_modules/`,5).then(results => {
            console.log('local modules found', results)
            return results.map(item=>{
                const relativePath = item.path.split(fileDir)[1]
                return relativePath
            })
        })
        const externalModules = vscode.workspace.findFiles(`**/node_modules/**/${variableName}.js`,null,5).then(results => {
            console.log('external modules found', results)
            return results.map(file=>{
                const modulePath = file.path.split('node_modules')[1]
                return modulePath.slice(1,-3)
            })
        })
        vscode.window.showQuickPick(Promise.all([localModules, externalModules]).then(concat)).then(itemSelected => {
            editor.edit(edit => edit.insert(startOfFile, `const ${variableName} = require("${itemSelected}")\n`))
        })

    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;