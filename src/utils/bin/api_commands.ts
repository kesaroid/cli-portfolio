// // List of commands that require API calls

import { getProjects } from '../api';
import { getReadme } from '../api';
import { getWeather } from '../api';
import { EMBED_WEBSITE_IMAGE_CLASSES } from '../constants';

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();
  const sorted = [...projects].sort((a: any, b: any) => {
    const starsA = Number(a?.stargazers_count) || 0;
    const starsB = Number(b?.stargazers_count) || 0;
    if (starsA !== starsB) return starsB - starsA; // more stars first

    const forksA = Number(a?.forks_count) || 0;
    const forksB = Number(b?.forks_count) || 0;
    if (forksA !== forksB) return forksB - forksA; // more forks first

    const createdA = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const createdB = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return createdB - createdA; // newer first
  });
  const escapeHtml = (value: any): string =>
    (value ?? '')
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const cards = sorted
    .map((repo: any) => {
      const name = escapeHtml(repo.name);
      const desc = escapeHtml(repo.description) || 'No description provided';
      const lang = escapeHtml(repo.language) || '';
      const stars = Number(repo.stargazers_count) || 0;
      const forks = Number(repo.forks_count) || 0;
      const href = escapeHtml(repo.html_url);

      return (
        `<a
            href="${href}"
            target="_blank"
            rel="noopener noreferrer"
            class="block h-full w-full min-w-0 border border-light-gray dark:border-dark-gray rounded-md p-4 shadow-sm transition-colors duration-150 hover:bg-light-foreground/10 dark:hover:bg-dark-foreground/10"
          >
            <span class="flex items-center justify-between gap-2">
              <span class="truncate font-semibold text-light-foreground dark:text-dark-foreground">${name}</span>
              <span class="flex-shrink-0 text-xs text-light-gray dark:text-dark-gray">★ ${stars} · ⑂ ${forks}</span>
            </span>
            <span class="block mt-2 text-sm text-light-foreground dark:text-dark-foreground opacity-80">${desc}</span>
            ${lang ? `<span class="inline-block mt-3 text-xs px-2 py-0.5 rounded-full border border-light-gray dark:border-dark-gray text-light-yellow dark:text-dark-yellow">${lang}</span>` : ''}
          </a>`
      );
    })
    .join('');

  // Embedded image link for 'wang' before the projects grid
  // Ensure the image exists at public/assets/wang.png
  const wangLink = `<div class="mb-3 sm:mb-4">
    <a href="https://www.thats-my-quant.com/" target="_blank" rel="noopener noreferrer" class="inline-block">
      <img src="/assets/wang.png" alt="wang" class="${EMBED_WEBSITE_IMAGE_CLASSES}" />
    </a>
  </div>`;

  // Responsive grid: 2 columns on mobile, 5 columns on desktop
  const grid = `<span class="grid grid-cols-2 md:grid-cols-5 auto-rows-fr gap-3 sm:gap-4 w-full whitespace-normal">${cards}</span>`;

  return `${wangLink}${grid}`;
};

// quote command removed

export const readme = async (args: string[]): Promise<string> => {
  const readme = await getReadme();
  return `Opening GitHub README...\n
  ${readme}`;
};

export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  return weather;
};
