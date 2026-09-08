import React from 'react';
import { History as HistoryInterface } from './interface';
import { Ps1 } from '../Ps1';

export const History: React.FC<{ history: Array<HistoryInterface> }> = ({
  history,
}) => {
  return (
    <>
      {history.map((entry: HistoryInterface, index: number) => (
        <div key={entry.command + index} className="min-w-0 max-w-full">
          {entry.command !== '' && (
            <div className="flex min-w-0 flex-row space-x-2">
              <div className="shrink-0">
                <Ps1 />
              </div>

              <div className="min-w-0 flex-1 break-words">{entry.command}</div>
            </div>
          )}

          {typeof entry.output === 'string' ? (
            <div
              className="mb-2 min-w-0 max-w-full whitespace-pre-wrap break-words"
              style={{ lineHeight: 'normal' }}
              dangerouslySetInnerHTML={{ __html: entry.output }}
            />
          ) : (
            <div className="mb-2 min-w-0 max-w-full">{entry.output}</div>
          )}
        </div>
      ))}
    </>
  );
};

export default History;
