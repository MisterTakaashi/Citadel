import React from 'react';
import PropTypes from 'prop-types';

function ButtonComponent({ color, children, size, className }) {
  let padding = 2;
  padding = size === 'sm' ? 1 : padding;

  return (
    <button
      type='button'
      className={`${className} bg-${color}-500 hover:bg-${color}-600 text-white p-${padding} rounded hover:bg-${color}-600 focus:bg-${color}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${color}-400`}
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
};

ButtonComponent.defaultProps = {
  color: 'blue',
  size: 'md',
  className: '',
};

export default ButtonComponent;
