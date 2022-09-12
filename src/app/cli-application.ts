import { CliCommandHelp, CliCommandInterface } from '../cli-command/cli-command.interface.js';

type ParsedCommand = {
  [key: string]: string[]
}

export default class CLIApplication {
  private commands: { [propertyName: string]: CliCommandInterface } = {};
  private help: { [propertyName: string]: CliCommandHelp } = {};
  private defaultCommand = '--help';

  private parseCommand(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';

    return cliArguments.reduce((acc, item) => {
      if (item.startsWith('--')) {
        acc[item] = [];
        command = item;
      } else if (command && item) {
        acc[command].push(item);
      }
      return acc;

    }, parsedCommand);
  }

  public registerCommands(commandList: CliCommandInterface[]): void {
    this.commands = commandList.reduce((acc, Command) => {
      const cliCommand = Command;
      acc[cliCommand.name] = cliCommand;
      return acc;
    }, this.commands);
    this.compileHelp(commandList);
  }

  private compileHelp(commandList: CliCommandInterface[]): void {
    this.help = commandList.reduce((acc, Command) => {
      acc[Command.name] = {
        description: Command.help.description,
        params: Command.help.params
      };
      return acc;
    }, this.help);
  }

  public getCommand(commandName: string): CliCommandInterface {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public getHelp() {
    return this.help;
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];

    command.execute(...commandArguments);
  }
}
