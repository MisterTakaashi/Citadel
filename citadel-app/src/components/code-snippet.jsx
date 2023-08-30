import React from 'react';
import PropTypes from 'prop-types';

function CodeSnippet({ children }) {
  return (
    <div className='font-mono tracking-tight leading-5 bg-slate-700 rounded px-5 py-3 max-h-[32rem] overflow-y-auto dark:text-white flex flex-col gap-1'>
      {children}
    </div>
  );
}

CodeSnippet.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CodeSnippet;
