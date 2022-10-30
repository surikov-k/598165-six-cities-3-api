#!/usr/bin/env node

import 'reflect-metadata';

import CLIApplication from './app/cli-application.js';
import GenerateCommand from './cli-command/generate-command.js';
import HelpCommand from './cli-command/help-command.js';
import ImportCommand from './cli-command/import-command.js';
import VersionCommand from './cli-command/version-command.js';

const myManager = new CLIApplication();
myManager.registerCommands([
  new HelpCommand(myManager),
  new VersionCommand,
  new ImportCommand,
  new GenerateCommand
]);

myManager.processCommand(process.argv);
