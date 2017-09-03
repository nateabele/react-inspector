import React from 'react';
import PropTypes from 'prop-types';
import createStyles from '../styles/createStyles';

/**
 * A short description of the object values.
 * Can be used to render tree node in ObjectInspector
 * or render objects in TableInspector.
 */
const ObjectValue = ({ object, styles }, { theme }) => {
  const themeStyles = createStyles('ObjectValue', theme);

  const mkStyle = key => ({ ...themeStyles[key], ...styles });

  switch (typeof object) {
    case 'number':
      return (
        <span className='value-number' style={mkStyle('objectValueNumber')}>
          {object}
        </span>
      );
    case 'string':
      return (
        <span className='value-string' style={mkStyle('objectValueString')}>
          "{object}"
        </span>
      );
    case 'boolean':
      return (
        <span className='value-boolean' style={mkStyle('objectValueBoolean')}>
          {String(object)}
        </span>
      );
    case 'undefined':
      return <span className='value-undefined' style={mkStyle('objectValueUndefined')}>undefined</span>;
    case 'object':
      if (object === null) {
        return <span className='value-null' style={mkStyle('objectValueNull')}>null</span>;
      }
      if (object instanceof Date) {
        return (
          <span className='value-object value-date'>
            {object.toString()}
          </span>
        );
      }
      if (object instanceof RegExp) {
        return (
          <span className='value-object value-regex' style={mkStyle('objectValueRegExp')}>
            {object.toString()}
          </span>
        );
      }
      if (Array.isArray(object)) {
        return <span className='value-object value-array'>{`Array[${object.length}]`}</span>;
      }
      return (
        <span>
          {object.constructor.name}
        </span>
      );
    case 'function':
      return (
        <span>
          <span style={mkStyle('objectValueFunctionKeyword')}>function</span>
          <span style={mkStyle('objectValueFunctionName')}>
            &nbsp;{object.name}()
          </span>
        </span>
      );
    case 'symbol':
      return (
        <span style={mkStyle('objectValueSymbol')}>
          {object.toString()}
        </span>
      );
    default:
      return <span />;
  }
};

ObjectValue.propTypes = {
  /** the object to describe */
  object: PropTypes.any,
};

ObjectValue.contextTypes = {
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default ObjectValue;
