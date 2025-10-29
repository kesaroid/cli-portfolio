// Minimal markdown-to-HTML converter tailored for README in terminal UI
// Supports: headings, bold, italics, inline code, code blocks, links, lists, blockquotes, hr, paragraphs

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const renderMarkdown = (md: string): string => {
  if (!md) return '';

  // Normalize line endings
  let text = md.replace(/\r\n?/g, '\n');

  // Fenced code blocks ```lang\n...\n```
  const codeBlocks: string[] = [];
  text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    const escaped = escapeHtml(String(code).trimEnd());
    codeBlocks.push(`<pre class="rounded-md border border-light-gray dark:border-dark-gray bg-light-background/40 dark:bg-dark-background/40 p-3 overflow-auto"><code>${escaped}</code></pre>`);
    return `§§CODEBLOCK_${codeBlocks.length - 1}§§`;
  });

  // Inline code `code`
  text = text.replace(/`([^`]+)`/g, (_m, code) => {
    return `<code class="px-1 py-0.5 rounded border border-light-gray dark:border-dark-gray bg-light-foreground/10 dark:bg-dark-foreground/10">${escapeHtml(code)}</code>`;
  });

  // Escapes for HTML in normal content
  text = text
    .split('\n')
    .map((line) => {
      // Skip placeholder lines for code blocks
      if (line.includes('§§CODEBLOCK_')) return line;
      return line
        // headings
        .replace(/^######\s+(.*)$/g, '<h6 class="mt-3 mb-1 font-semibold text-sm">$1</h6>')
        .replace(/^#####\s+(.*)$/g, '<h5 class="mt-3 mb-1 font-semibold text-base">$1</h5>')
        .replace(/^####\s+(.*)$/g, '<h4 class="mt-4 mb-1 font-semibold text-lg">$1</h4>')
        .replace(/^###\s+(.*)$/g, '<h3 class="mt-4 mb-1 font-semibold text-xl">$1</h3>')
        .replace(/^##\s+(.*)$/g, '<h2 class="mt-5 mb-2 font-bold text-2xl">$1</h2>')
        .replace(/^#\s+(.*)$/g, '<h1 class="mt-6 mb-3 font-bold text-3xl">$1</h1>')
        // hr
        .replace(/^---+$/g, '<hr class="my-4 border-light-gray dark:border-dark-gray" />')
        // blockquote
        .replace(/^>\s?(.*)$/g, '<blockquote class="pl-3 border-l-2 border-light-gray dark:border-dark-gray italic opacity-90">$1</blockquote>')
        // unordered list
        .replace(/^\s*[-*]\s+(.*)$/g, '<li class="list-disc ml-5">$1</li>')
        // bold, italics
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // links [text](url)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline decoration-dotted hover:decoration-solid text-light-blue dark:text-dark-blue">$1<\/a>')
        // finally escape remaining raw angle brackets except allowed tags
        .replace(/<(?!\/?(h[1-6]|hr|blockquote|li|strong|em|a|code|pre|span|div|p|details|summary|br)\b)[^>]*>/g, (m) => escapeHtml(m));
    })
    .join('\n');

  // Group consecutive <li> into <ul>
  text = text.replace(/(?:\n)?(<li[\s\S]*?<\/li>)(?:\n(?=<li)|$)/g, (match) => match);
  text = text.replace(/(?:^|\n)(<li[\s\S]*?<\/li>(?:\n<li[\s\S]*?<\/li>)*)/gm, (_m, list) => {
    return `<ul class="my-2 space-y-1">${list}</ul>`;
  });

  // Paragraphs: wrap loose lines that are not HTML blocks
  text = text
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^\s*<\/?(h[1-6]|ul|li|pre|blockquote|hr|details|summary)\b/.test(trimmed)) return trimmed;
      if (trimmed.includes('§§CODEBLOCK_')) return trimmed; // codeblocks handled later
      return `<p class="my-2 leading-relaxed">${trimmed}</p>`;
    })
    .join('\n');

  // Style details/summary blocks and content area
  text = text
    // Ensure opening tag has classes
    .replace(/<details(\s[^>]*)?>/g, '<details class="mb-2 border border-light-gray dark:border-dark-gray rounded-md"$1>')
    // Style summary and open a content wrapper after it
    .replace(/<summary(\s[^>]*)?>/g, '<summary class="cursor-pointer select-none px-3 py-2 bg-light-foreground/10 dark:bg-dark-foreground/10 text-light-foreground dark:text-dark-foreground rounded-t-md"$1>')
    .replace(/<\/summary>\n?/g, '</summary><div class="px-3 py-2 space-y-2">')
    // Close content wrapper before closing details
    .replace(/<\/details>/g, '</div></details>');

  // Restore code blocks
  text = text.replace(/§§CODEBLOCK_(\d+)§§/g, (_m, idx) => codeBlocks[Number(idx)] || '');

  return text;
};


