// List of commands that do not require API calls

import * as bin from './index';
import config from '../../../config.json';

// Help
export const help = async (args: string[]): Promise<string> => {
  // const commands = Object.keys(bin).join(', ');
  const commands = {
    help: 'Display this help message.',
    resume: 'Open my resume.',
    // repo: 'Open my Github repository.',
    donate: 'Support my work.',
    email: 'Send me an email.',
    github: 'Open my Github profile.',
    linkedin: 'Open my LinkedIn profile.',
    whoami: 'Reveals the meaning of my name.',
    ls: 'List directory contents.',
    cd: 'Change the shell working directory.',
    date: 'Display the current date and time.',
    sudo: 'Execute a command as the superuser.',
    banner: 'Display the banner.',
    sumfetch: 'Display summary.',
    projects: 'Display my Github projects.',
    readme: 'Display my Github README.',
    weather: 'Display the weather for a city. Usage: weather [city].',
  };

  var c = '';
  for (let i = 1; i <= Object.keys(bin).length; i++) {
      let spaces = 16 - Object.keys(bin)[i - 1].length;
      c += Object.keys(bin)[i - 1] + ' '.repeat(spaces) + '-\t' + commands[Object.keys(bin)[i - 1]] + '\n';
  }
  return `Welcome! Here are all the available commands:
\n${c}\n
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.\n
Type 'sumfetch' to display summary.
`;
};

// 

export const resume = async (args: string[]): Promise<string> => {
  window.open(`${config.resume_url}`);
  return 'Opening resume...';
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

// Banner
export const banner = (args?: string[]): string => {
  return `
  █████   ████                                                ███      █████
  ░░███   ███░                                                ░░░      ░░███ 
   ░███  ███     ██████   █████   ██████   ████████   ██████  ████   ███████ 
   ░███████     ███░░███ ███░░   ░░░░░███ ░░███░░███ ███░░███░░███  ███░░███ 
   ░███░░███   ░███████ ░░█████   ███████  ░███ ░░░ ░███ ░███ ░███ ░███ ░███ 
   ░███ ░░███  ░███░░░   ░░░░███ ███░░███  ░███     ░███ ░███ ░███ ░███ ░███ 
   █████ ░░████░░██████  ██████ ░░████████ █████    ░░██████  █████░░████████
  ░░░░░   ░░░░  ░░░░░░  ░░░░░░   ░░░░░░░░ ░░░░░      ░░░░░░  ░░░░░  ░░░░░░░░ 
                                                                          
Type 'help' to see the list of available commands.
Type 'sumfetch' to display summary.
`;
};
