import path = require("path");
import { workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // const serverCommand = context.asAbsolutePath("server");

  const tempoPath = path.join(context.extensionUri.path, "..", "tempo");

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: {
      command: "tempo",
      args: ["lsp"],
    },
    debug: {
      command: "go",
      args: ["run", "main.go", "lsp"],
      options: { cwd: tempoPath },
    },
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [{ scheme: "file", language: "tempo" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.tempo"),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "tempoLS",
    "Tempo Language Server",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
