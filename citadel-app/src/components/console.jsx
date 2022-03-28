import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';

function isConsoleBottom(e) {
  if (e.offsetHeight + e.scrollTop >= e.scrollHeight) {
    return true;
  }

  return false;
}

function scrollToBottom(e) {
  e.scrollIntoView();
}

function Console({ logs }) {
  const consoleEndRef = useRef();

  useEffect(() => {
    scrollToBottom(consoleEndRef.current);
  }, []);

  useEffect(() => {
    if (isConsoleBottom(consoleEndRef.current.parentNode)) {
      scrollToBottom(consoleEndRef.current);
    }
  }, [logs]);

  return (
    <div className='font-mono tracking-tight leading-5 bg-slate-700 rounded px-5 py-3 max-h-[32rem] overflow-y-auto'>
      {logs.map((log) => (
        <p
          className={`mb-2 break-all ${log.charAt(0) === '\u0065' ? 'text-red-500' : ''}`}
          key={uniqueId(log)}
        >
          {log.substring('1')}
        </p>
      ))}
      <div ref={consoleEndRef} />
    </div>
  );
}

Console.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Console;
