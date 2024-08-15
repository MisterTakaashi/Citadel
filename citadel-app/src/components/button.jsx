import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

function ButtonComponent(
  { color, children, size, className, onClick, disabled, loading } = {
    color: 'blue',
    size: 'md',
    className: '',
    onClick: () => {},
    disabled: false,
    loading: false,
  }
) {
  let padding = 2;
  padding = size === 'sm' ? 1 : padding;

  return (
    <button
      type='button'
      disabled={disabled}
      className={`${className} bg-${color}-500 hover:bg-${color}-600 text-white p-${padding} rounded hover:bg-${color}-600 focus:bg-${color}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${color}-400 disabled:opacity-70`}
      onClick={onClick}
    >
      {!loading && children}
      {loading && (
        <>
          <FontAwesomeIcon className='fa-flip text-xs' icon={faCircle} />
          <FontAwesomeIcon
            className='fa-flip text-xs mx-2'
            style={{ '--fa-flip-x': 1, '--fa-flip-y': 0 }}
            icon={faCircle}
          />
          <FontAwesomeIcon className='fa-flip text-xs' icon={faCircle} />
        </>
      )}
    </button>
  );
}

ButtonComponent.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default ButtonComponent;
