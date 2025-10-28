import React from 'react';

export const Readme: React.FC<{ html: string }> = ({ html }) => {
  return (
    <div
      className="mb-2 whitespace-pre-wrap text-light-foreground dark:text-dark-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Readme;


