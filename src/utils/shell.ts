import React from 'react';
import type { ReactNode } from 'react';
import * as bin from './bin';
import { isCommandEnabled, resolveCommandName } from './commandConfig';

export const shell = async (
  command: string,
  setHistory: (value: string | ReactNode) => void,
  clearHistory: () => void,
  setCommand: React.Dispatch<React.SetStateAction<string>>,
) => {
  const args = command.split(' ');
  args[0] = args[0].toLowerCase();

  if (args[0] === 'clear') {
    if (isCommandEnabled('clear')) {
      clearHistory();
    } else {
      setHistory(
        `shell: command not found: ${args[0]}. Try 'help' to get started.`,
      );
    }
  } else if (command === '') {
    setHistory('');
  } else {
    const binKey = resolveCommandName(args[0]) as keyof typeof bin;
    if (!isCommandEnabled(args[0]) || typeof bin[binKey] !== 'function') {
      setHistory(
        `shell: command not found: ${args[0]}. Try 'help' to get started.`,
      );
    } else {
      const output = await bin[binKey](args.slice(1));
      setHistory(output);
    }
  }

  setCommand('');
};
