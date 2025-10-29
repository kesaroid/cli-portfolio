import Head from 'next/head';
import React from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { banner } from '../utils/bin';
import { CommandTiles } from '../components/CommandTiles';
import * as bin from '../utils/bin';

interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
}

const IndexPage: React.FC<IndexPageProps> = ({ inputRef }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const {
    history,
    command,
    lastCommandIndex,
    setCommand,
    setHistory,
    clearHistory,
    setLastCommandIndex,
  } = useHistory([]);

  const init = React.useCallback(() => setHistory(banner()), []);

  React.useEffect(() => {
    init();
  }, [init]);

  const handleCommandClick = React.useCallback(async (cmd: string) => {
    // Set command first so it appears in history correctly
    setCommand(cmd);
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Execute the command
    const args = cmd.split(' ');
    const commandName = args[0].toLowerCase();
    
    if (commandName === 'clear') {
      clearHistory();
    } else if (bin[commandName]) {
      try {
        const output = await bin[commandName](args.slice(1));
        setHistory(output);
      } catch (error) {
        setHistory(`Error executing command: ${cmd}`);
      }
    } else {
      setHistory(`shell: command not found: ${commandName}`);
    }
    
    setCommand('');
    
    // Scroll to bottom
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
      }
    }, 100);
  }, [setCommand, setHistory, clearHistory]);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [history]);

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>
      <div className="fixed inset-0 bg-light-background dark:bg-dark-background">
        <div className="h-full border-2 rounded border-light-yellow dark:border-dark-yellow">
          <div ref={containerRef} className="h-full overflow-y-auto overflow-x-auto bg-light-background dark:bg-dark-background p-4 sm:p-8 whitespace-pre max-w-full">
            <History history={history} />
            {history.length === 1 && <CommandTiles onCommandClick={handleCommandClick} />}
            <Input
              inputRef={inputRef}
              containerRef={containerRef}
              command={command}
              history={history}
              lastCommandIndex={lastCommandIndex}
              setCommand={setCommand}
              setHistory={setHistory}
              setLastCommandIndex={setLastCommandIndex}
              clearHistory={clearHistory}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
