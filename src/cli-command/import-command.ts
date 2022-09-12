import { CliCommandInterface } from './cli-command.interface.js';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import chalk from 'chalk';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  public readonly help = {
    description: 'импортирует данные из TSV',
    params: ['<path>']
  };

  public execute(filename: string) {
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(chalk.red(`Не удалось импортировать данные из файла по причине: «${err.message}»`));
    }
  }
}
