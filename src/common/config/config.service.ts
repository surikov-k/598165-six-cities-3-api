import {ConfigInterface} from './config.interface.js';
import { config } from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface.js';
import { configSchema, ConfigSchema } from './config.schema.js';

export default class ConfigService implements ConfigInterface {
  private config: ConfigSchema;
  private logger: LoggerInterface;

  constructor(logger: LoggerInterface) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});
    this.logger.info('.env file found and successfully parsed!');
    this.config = configSchema.getProperties();
  }

  public get<T extends keyof ConfigSchema> (key: T){
    return this.config[key];
  }
}
