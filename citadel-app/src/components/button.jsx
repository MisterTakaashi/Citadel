import React from 'react';
import PropTypes from 'prop-types';

function ButtonComponent({ color, children, size, className, onClick, disabled }) {
  let padding = 2;
  padding = size === 'sm' ? 1 : padding;

  return (
    <button
      type='button'
      disabled={disabled}
      className={`${className} bg-${color}-500 hover:bg-${color}-600 text-white p-${padding} rounded hover:bg-${color}-600 focus:bg-${color}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${color}-400 disabled:opacity-70`}
      onClick={onClick}
    >
      {children}
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
};

ButtonComponent.defaultProps = {
  color: 'blue',
  size: 'md',
  className: '',
  onClick: () => {},
  disabled: false,
};

export default ButtonComponent;
