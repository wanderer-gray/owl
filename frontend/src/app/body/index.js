import React, { Fragment } from 'react';
import AppRouter from '../../routing/AppRouter';
import Aside from './aside';

const Body = () => {
  return (
    <Fragment>
      <Aside />
      <AppRouter />
    </Fragment>
  );
};

export default Body;
