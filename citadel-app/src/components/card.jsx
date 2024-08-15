import React from 'react';
import PropTypes from 'prop-types';

function Card(
  { title, children, className } = {
    className: '',
    children: <div />,
  }
) {
  return (
    <div className={`dark:bg-gray-800 dark:text-white p-5 rounded ${className}`}>
      <p className='text-2xl px-3'>{title}</p>
      <div className='h-px bg-gray-600 mt-5 mb-5' />
      <div className='px-3'>{children}</div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Card;
