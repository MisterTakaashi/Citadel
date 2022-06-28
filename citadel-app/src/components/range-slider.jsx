import React from 'react';
import PropTypes from 'prop-types';

function RangeSlider({ prefix, value, min, max, onChange }) {
  return (
    <>
      <input
        id='steps-range'
        type='range'
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        step='1'
        className='w-full h-2 bg-gray-200 rounded-lg accent-blue-500'
      />
      <div className='flex justify-between mx-1 text-gray-400 text-sm'>
        {Array(max)
          .fill(0)
          .reduce((acc, _, index) => {
            return [...acc, index + 1];
          }, [])
          .map((val) => (
            <p
              key={`${prefix}-${val}`}
              className={`transition-all ${+value === val ? 'text-blue-500' : ''}`}
            >
              {val}
            </p>
          ))}
      </div>
    </>
  );
}

RangeSlider.propTypes = {
  prefix: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

RangeSlider.defaultProps = {
  onChange: () => {},
};

export default RangeSlider;
