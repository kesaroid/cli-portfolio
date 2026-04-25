import * as bin from './bin';
import { isCommandEnabled } from './commandConfig';

export const commandExists = (command: string) => {
  const commands = [
    ...(isCommandEnabled('clear') ? ['clear'] : []),
    ...Object.keys(bin).filter((entry) => isCommandEnabled(entry)),
  ];
  return commands.indexOf(command.split(' ')[0].toLowerCase()) !== -1;
};
