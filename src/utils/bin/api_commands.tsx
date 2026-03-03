// // List of commands that require API calls

import { getProjects } from '../api';
import { getReadme } from '../api';
import React from 'react';
import Readme from '../../components/Readme';
import { renderMarkdown } from '../markdown';
import { getWeather } from '../api';

const VIP_REPO = 'wang'; // Highlights this project with a star in the top row

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();
  const sorted = [...projects].sort((a: any, b: any) => {
    // VIP repo always first
    if (a?.name === VIP_REPO) return -1;
    if (b?.name === VIP_REPO) return 1;

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
      const isVip = repo.name === VIP_REPO;
      const vipStar = isVip
        ? '<span class="absolute bottom-2 right-2 text-light-yellow dark:text-dark-yellow text-lg" aria-hidden="true">★</span>'
        : '';

      return (
        `<a
            href="${href}"
            target="_blank"
            rel="noopener noreferrer"
            class="block relative h-full w-full min-w-0 border border-light-gray dark:border-dark-gray rounded-md p-4 shadow-sm transition-colors duration-150 hover:bg-light-foreground/10 dark:hover:bg-dark-foreground/10"
          >
            <span class="flex items-center justify-between gap-2">
              <span class="truncate font-semibold text-light-foreground dark:text-dark-foreground">${name}</span>
              <span class="flex-shrink-0 text-xs text-light-gray dark:text-dark-gray">★ ${stars} · ⑂ ${forks}</span>
            </span>
            <span class="block mt-2 text-sm text-light-foreground dark:text-dark-foreground opacity-80">${desc}</span>
            ${lang ? `<span class="inline-block mt-3 text-xs px-2 py-0.5 rounded-full border border-light-gray dark:border-dark-gray text-light-yellow dark:text-dark-yellow">${lang}</span>` : ''}
            ${vipStar}
          </a>`
      );
    })
    .join('');

  // Responsive grid: 2 columns on mobile, 5 columns on desktop
  const grid = `<span class="grid grid-cols-2 md:grid-cols-5 auto-rows-fr gap-3 sm:gap-4 w-full whitespace-normal">${cards}</span>`;

  return grid;
};

// quote command removed

export const readme = async (args: string[]): Promise<React.ReactNode> => {
  const md = await getReadme();
  const html = renderMarkdown(md);
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-light-gray dark:text-dark-gray">Opening GitHub README...</div>
      <Readme html={html} />
    </div>
  );
};

export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  return weather;
};
