import React from 'react';

export const Readme: React.FC<{ html: string }> = ({ html }) => {
  return (
    <div
      className="mb-2 min-w-0 max-w-full whitespace-pre-wrap break-words text-light-foreground dark:text-dark-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Readme;


