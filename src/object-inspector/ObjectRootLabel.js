import React from 'react';
import ObjectName from '../object/ObjectName';
import ObjectPreview from './ObjectPreview';

const ObjectRootLabel = ({ name, data, showPreview }) => {
  if (typeof name === 'string') {
    return (
      <span>
        <ObjectName name={name} />
        <span>: </span>
        {showPreview === false && undefined || <ObjectPreview data={data} />}
      </span>
    );
  } else {
    return <ObjectPreview data={data} />;
  }
};

export default ObjectRootLabel;
