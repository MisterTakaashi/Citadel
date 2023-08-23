import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

function ServerStatus({ state, background, className, size, bullet }) {
  const stateColors = Object.freeze({
    created: { background: 'bg-orange-600', bullet: 'text-orange-400', text: 'text-orange-500' },
    running: { background: 'bg-green-600', bullet: 'text-green-400', text: 'text-green-500' },
    exited: { background: 'bg-red-600', bullet: 'text-red-400', text: 'text-red-500' },
  });

  return (
    <p
      className={`text-${size} rounded ${background ? stateColors[state]?.background : ''} ${
        background ? 'p-1' : ''
      } ${className}`}
    >
      {bullet && (
        <>
          <FontAwesomeIcon icon={faCircle} size='xs' className={stateColors[state]?.bullet} />{' '}
        </>
      )}
      <span className={!background ? stateColors[state].text : ''}>{capitalize(state)}</span>
    </p>
  );
}

ServerStatus.propTypes = {
  state: PropTypes.string.isRequired,
  background: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
  bullet: PropTypes.bool,
};

ServerStatus.defaultProps = {
  background: false,
  className: '',
  size: 'md',
  bullet: true,
};

export default ServerStatus;
