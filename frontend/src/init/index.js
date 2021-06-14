import React from 'react';
import { Provider } from 'mobx-react';

import Api from './api';
import Notify from './notify';
import Auth from './auth';

import SearchStore from './search';
import App from '../app';

const Init = () => {
  const search = new SearchStore();

  return (
    <Api>
      <Notify>
        <Auth>
          <Provider SearchStore={search}>
            <App />
          </Provider>
        </Auth>
      </Notify>
    </Api>
  );
};

export default Init;
