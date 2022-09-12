export type CliCommandHelp = {
  description: string,
  params?: string[]
}
export interface CliCommandInterface {
  readonly name: string;
  readonly help: CliCommandHelp;

  execute(...parameters: string[]): void;
}
