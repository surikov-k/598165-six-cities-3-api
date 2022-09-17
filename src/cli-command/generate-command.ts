import got from 'got';

import { CliCommandInterface } from './cli-command.interface.js';
import { MockData } from '../types/mock-data.type.js';
import OfferGenerator from '../common/offer-generator/offer-generator.js';
import TsvFileWriter from '../common/file-writer/tsv-file-writer.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  public readonly help = {
    description: 'генерирует произвольное количество тестовых данных',
    params: ['<count>', '<path>', '<url>']
  };

  private initialData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    console.log(count, filepath, url);
    const offerCount = parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Can't fetch data from ${url}`);
    }

    const offerGeneratedString = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TsvFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratedString.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
