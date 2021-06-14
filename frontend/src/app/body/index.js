import React, { Fragment } from 'react';
import Aside from './aside';
import Pages from './pages';

const Body = () => {
  return (
    <Fragment>
      <Aside />
      <Pages />
    </Fragment>
  );
};

export default Body;
