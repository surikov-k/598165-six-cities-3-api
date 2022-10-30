import chalk, { ForegroundColor } from 'chalk';

import { CliCommandInterface } from './cli-command.interface.js';
import CLIApplication from '../app/cli-application.js';

const TABULATION_SIZE = 30;
const HELP_COLOR = 'grey';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';
  public readonly help = {
    description: 'печатает этот текст'
  };

  private readonly appHelp;

  constructor(application: CLIApplication) {
    this.appHelp = application.getHelp();
  }

  private printHelpLines(color: ForegroundColor) {

    const printLine = (commandName: string): void => {
      const help = this.appHelp[commandName];
      const params = help.params ? ` ${help.params.join(' ')}` : '';
      const description = help.description;

      const calculateSpace = () => {
        const n = TABULATION_SIZE - (commandName.length + params.length);
        return ' '.repeat(Math.max(1, n));
      };

      console.log(chalk[color](`${' '.repeat(12)}${commandName}${params}:${calculateSpace()}# ${description}`));
    };

    Object.keys(this.appHelp)
      .forEach((commandName) => {
        printLine(commandName);
      });
  }

  public execute(): void {
    console.log(chalk[HELP_COLOR](`
     Программа для подготовки данных для REST API сервера.

        Пример:
            main.js --<command> [--arguments]

        Команды:
    `));
    this.printHelpLines(HELP_COLOR);
  }
}
