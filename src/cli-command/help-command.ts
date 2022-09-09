import {CliCommandInterface} from './cli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public execute(): void {
    console.log(chalk.grey(`
     Программа для подготовки данных для REST API сервера.

        Пример:
            main.js --<command> [--arguments]

        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <path>:             # импортирует данные из TSV
    `));
  }
}
