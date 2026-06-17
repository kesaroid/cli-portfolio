// // List of commands that require API calls

import { getProjects } from '../api';
import { getReadme } from '../api';
import React from 'react';
import Readme from '../../components/Readme';
import { renderMarkdown } from '../markdown';
import { getWeather } from '../api';
import config from '../../../config.json';

const VIP_REPO = 'wang'; // Highlights this project with a star in the top row

const CARD_CLASS =
  'block relative h-full w-full min-w-0 border border-light-gray dark:border-dark-gray rounded-md p-4 shadow-sm transition-colors duration-150 hover:bg-light-foreground/10 dark:hover:bg-dark-foreground/10';

const escapeHtml = (value: any): string =>
  (value ?? '')
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildCard = (opts: {
  name: string;
  desc: string;
  langs: string[];
  href: string;
  badge?: string;
}) => {
  const { name, desc, langs, href, badge } = opts;
  const pills = langs
    .map(
      (l) =>
        `<span class="inline-block mt-3 mr-1 text-xs px-2 py-0.5 rounded-full border border-light-gray dark:border-dark-gray text-light-yellow dark:text-dark-yellow">${l}</span>`,
    )
    .join('');
  return `<a
      href="${href}"
      target="_blank"
      rel="noopener noreferrer"
      class="${CARD_CLASS}"
    >
      <span class="flex items-center justify-between gap-2">
        <span class="truncate font-semibold text-light-foreground dark:text-dark-foreground">${name}</span>
        ${badge ? `<span class="flex-shrink-0 text-xs text-light-gray dark:text-dark-gray">${badge}</span>` : ''}
      </span>
      <span class="block mt-2 text-sm text-light-foreground dark:text-dark-foreground opacity-80">${desc}</span>
      ${pills.length ? `<span class="block">${pills}</span>` : ''}
    </a>`;
};

const GRID_CLASS =
  'grid grid-cols-2 md:grid-cols-5 auto-rows-fr gap-3 sm:gap-4 w-full whitespace-normal';

const SECTION_LABEL_CLASS =
  'text-xs uppercase tracking-widest text-light-gray dark:text-dark-gray mb-2 mt-1';

const DIVIDER =
  `<div class="flex items-center gap-3 my-4 whitespace-normal">` +
  `<hr class="flex-1 border-t border-light-gray dark:border-dark-gray opacity-40" />` +
  `<span class="text-xs uppercase tracking-widest text-light-gray dark:text-dark-gray opacity-60">public repos</span>` +
  `<hr class="flex-1 border-t border-light-gray dark:border-dark-gray opacity-40" />` +
  `</div>`;

export const projects = async (args: string[]): Promise<string> => {
  const deployedProjects: Array<{ name: string; description: string; url: string; language?: string | string[] }> =
    (config as any).deployedProjects ?? [];

  const deployedCards = deployedProjects
    .map((p) => {
      const langs = Array.isArray(p.language)
        ? p.language
        : p.language
        ? [p.language]
        : [];
      return buildCard({
        name: escapeHtml(p.name),
        desc: escapeHtml(p.description) || 'No description provided',
        langs: langs.map(escapeHtml),
        href: escapeHtml(p.url),
        badge: '↗ live',
      });
    })
    .join('');

  const deployedSection =
    deployedCards.length > 0
      ? `<p class="${SECTION_LABEL_CLASS}">deployed</p><span class="${GRID_CLASS}">${deployedCards}</span>${DIVIDER}`
      : '';

  const repos = await getProjects();
  const sorted = [...repos].sort((a: any, b: any) => {
    if (a?.name === VIP_REPO) return -1;
    if (b?.name === VIP_REPO) return 1;

    const starsA = Number(a?.stargazers_count) || 0;
    const starsB = Number(b?.stargazers_count) || 0;
    if (starsA !== starsB) return starsB - starsA;

    const forksA = Number(a?.forks_count) || 0;
    const forksB = Number(b?.forks_count) || 0;
    if (forksA !== forksB) return forksB - forksA;

    const createdA = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const createdB = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return createdB - createdA;
  });

  const repoCards = sorted
    .map((repo: any) => {
      const isVip = repo.name === VIP_REPO;
      return buildCard({
        name: escapeHtml(repo.name),
        desc: escapeHtml(repo.description) || 'No description provided',
        langs: repo.language ? [escapeHtml(repo.language)] : [],
        href: escapeHtml(repo.html_url),
        badge: `★ ${Number(repo.stargazers_count) || 0} · ⑂ ${Number(repo.forks_count) || 0}${isVip ? ' ★' : ''}`,
      });
    })
    .join('');

  return `<span class="flex flex-col w-full whitespace-normal">${deployedSection}<span class="${GRID_CLASS}">${repoCards}</span></span>`;
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
