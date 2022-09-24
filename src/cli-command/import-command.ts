import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { createOffer, getErrorMessage } from '../utils/common.js';
import { ExitCode } from '../constants.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  public readonly help = {
    description: 'импортирует данные из TSV',
    params: ['<path>']
  };

  private onLine(line: string) {
    const offer = createOffer(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported`);
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      process.exitCode = ExitCode.error;
      console.log(chalk.red(`Can't read the file: ${getErrorMessage(err)}`));
    }
  }
}
