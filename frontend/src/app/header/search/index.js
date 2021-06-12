import React from 'react';
import { inject } from 'mobx-react';
import View from './view';

const Search = ({ SearchStore }) => <View SearchStore={SearchStore} />;

export default inject(({ SearchStore }) => {
  return {
    SearchStore,
  };
})(Search);
