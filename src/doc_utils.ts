// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
// TODO(ry) share this code with deno
import ts from "typescript";
import assert from "assert";
import { Parser, DocEntry } from "./doc_parser";

export function main(rootModule: string, rootSource: string): DocEntry[] {
  const fileNames: string[] = [rootModule];
  const host = new Host(rootModule, rootSource);
  const options = {}; //host.getCompilationSettings();
  const program = ts.createProgram(fileNames, options, host);
  const parser = new Parser(program);
  return parser.gen(rootModule);
}

class Host implements ts.CompilerHost {
  constructor(public rootModule: string, public rootSource: string) {
    console.log("hi");
  }

  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return "";
  }

  getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile | undefined {
    console.log("getSourceFile", fileName);
    return ts.createSourceFile(fileName, this.rootSource, languageVersion);
  }

  writeFile(
    fileName: string,
    data: string,
    writeByteOrderMark: boolean,
    onError?: (message: string) => void,
    sourceFiles?: ReadonlyArray<ts.SourceFile>
  ): void {
    assert(false);
  }

  getCurrentDirectory(): string {
    return this.rootModule;
  }

  getCanonicalFileName(fileName: string): string {
    console.log("getCanonicalFileName", fileName);
    return fileName;
  }

  useCaseSensitiveFileNames(): boolean {
    return true;
  }

  getNewLine(): string {
    return "\n";
  }

  fileExists(path: string): boolean {
    console.log("fileExists", path);
    return true;
  }

  readFile(path: string, encoding?: string): string | undefined {
    assert(false);
    return "x";
  }
}
