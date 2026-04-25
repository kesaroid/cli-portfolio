// List of commands that do not require API calls

import * as bin from './index';
import config from '../../../config.json';
import React from 'react';
import ResumeGraph from '../../components/ResumeGraph';
import resumeData from '../../../public/assets/resume.json';
import {
  getCommandCategory,
  getCommandDescription,
  getEnabledCommandNamesInOrder,
} from '../commandConfig';

const HELP_FOOTER = `[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.`;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Box-drawing help table: fixed widths so right edges align. */
function formatCommandsHelpTable(): string {
  const keys = getEnabledCommandNamesInOrder().filter(
    (key) => key === 'clear' || Boolean(bin[key]),
  );
  const rows = keys.map((key) => ({
    cmd: key,
    desc: escapeHtml(getCommandDescription(key)).replace(/\|/g, '&#124;'),
    category: getCommandCategory(key),
  }));

  const col1W = Math.max('Command'.length, ...rows.map((r) => r.cmd.length));
  const col2W = Math.max('Description'.length, ...rows.map((r) => r.desc.length));

  const hRule = (w: number) => '─'.repeat(w + 2);
  const top = `┌${hRule(col1W)}┬${hRule(col2W)}┐`;
  const sep = `├${hRule(col1W)}┼${hRule(col2W)}┤`;
  const bot = `└${hRule(col1W)}┴${hRule(col2W)}┘`;

  const row = (left: string, right: string) =>
    `│ ${left.padEnd(col1W)} │ ${right.padEnd(col2W)} │`;

  const categoryGapRow = row('', '');

  const bodyRows: string[] = [];
  let previousCategory: string | null = null;

  rows.forEach((entry, index) => {
    const isNewCategory = entry.category !== previousCategory;

    if (isNewCategory && index > 0) {
      bodyRows.push(categoryGapRow);
      previousCategory = entry.category;
    }

    if (previousCategory === null) {
      previousCategory = entry.category;
    }

    bodyRows.push(row(entry.cmd, entry.desc));
  });

  const body = [
    top,
    row('Command', 'Description'),
    sep,
    ...bodyRows,
    bot,
  ].join('\n');

  const margin = '  ';
  return body
    .split('\n')
    .map((line) => margin + line)
    .join('\n');
}

function formatHelpBody(): string {
  return `${formatCommandsHelpTable()}\n\n${HELP_FOOTER}`;
}

// Help
export const help = async (args: string[]): Promise<string> => {
  return `Welcome! Here are all the available commands:\n\n${formatHelpBody()}`;
};

const RESUME_UNAVAILABLE_MSG = 'Contact the author for the latest resume';

const isResumeUrlAvailable = async (): Promise<boolean> => {
  try {
    const res = await fetch(config.resume_url);
    return res.ok;
  } catch {
    return false;
  }
};

export const resume = async (args: string[]): Promise<any> => {
  const available = await isResumeUrlAvailable();
  if (!available) {
    return RESUME_UNAVAILABLE_MSG;
  }
  return React.createElement(ResumeGraph, { data: (resumeData as any), resumeUrl: config.resume_url });
};

// // Redirection
// export const repo = async (args: string[]): Promise<string> => {
//   window.open(`${config.repo}`);
//   return 'Opening Github repository...';
// };

// Donate
export const donate = async (args: string[]): Promise<string> => {
  return `thank you for your interest. 
here are the ways you can support my work:
- <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.donate_urls.paypal}" target="_blank">paypal</a></u>
- <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.donate_urls.cashapp}" target="_blank">cashapp</a></u>
`;
};

// Contact
export const email = async (args: string[]): Promise<string> => {
  window.open(`mailto:${config.email}`);
  return `Opening mailto:${config.email}...`;
};

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://github.com/${config.social.github}/`);

  return 'Opening github...';
};

export const linkedin = async (args: string[]): Promise<string> => {
  window.open(`https://www.linkedin.com/in/${config.social.linkedin}/`);

  return 'Opening linkedin...';
};

// 

// 

export const whoami = async (args: string[]): Promise<string> => {
  return `
  I am ${config.name.split(' ')[0]}.
  My name means 'saffron' in Sanskrit. 
  It's a spice derived from the flower of Crocus sativus i.e the most expensive spice in the world.
  It also means a lion, but who is counting? 🦁
  
  Type 'readme' to learn more about me.`;
};

export const ls = async (args: string[]): Promise<string> => {
  return `everything you need is right here. no need to list.`;
};

export const cd = async (args: string[]): Promise<string> => {
  return `unfortunately, i cannot afford more directories.
if you want to help, you can type 'donate'.`;
};

export const date = async (args: string[]): Promise<string> => {
  return new Date().toString();
};

export const sudo = async (args?: string[]): Promise<string> => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // ...I'm sorry
  return `Permission denied: with little power comes... no responsibility? `;
};

const BANNER_ART = `
  █████   ████                                                ███      █████
  ░░███   ███░                                                ░░░      ░░███ 
   ░███  ███     ██████   █████   ██████   ████████   ██████  ████   ███████ 
   ░███████     ███░░███ ███░░   ░░░░░███ ░░███░░███ ███░░███░░███  ███░░███ 
   ░███░░███   ░███████ ░░█████   ███████  ░███ ░░░ ░███ ░███ ░███ ░███ ░███ 
   ░███ ░░███  ░███░░░   ░░░░███ ███░░███  ░███     ░███ ░███ ░███ ░███ ░███ 
   █████ ░░████░░██████  ██████ ░░████████ █████    ░░██████  █████░░████████
  ░░░░░   ░░░░  ░░░░░░  ░░░░░░   ░░░░░░░░ ░░░░░      ░░░░░░  ░░░░░  ░░░░░░░░ 
                                                                          
`;

// Banner
export const banner = (args?: string[]): string => {
  return `${BANNER_ART.trimEnd()}\n\n${formatHelpBody()}`;
};
