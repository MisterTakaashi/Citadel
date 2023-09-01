import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const copyToClipboard = (text) => {
  // eslint-disable-next-line no-undef
  navigator?.clipboard.writeText(text);
};

function CodeSnippetCopyline({ text }) {
  return (
    <div
      onKeyUp={(e) => (e.key === 'Enter' ? copyToClipboard(text) : '')}
      className='text-left hover:bg-black/[.2] flex px-2 py-1 cursor-pointer'
      onClick={() => copyToClipboard(text)}
      role='button'
      tabIndex={0}
    >
      <p className='grow'>{text}</p>
      <FontAwesomeIcon className='text-zinc-400' icon={faCopy} />
    </div>
  );
}

CodeSnippetCopyline.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CodeSnippetCopyline;
