import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Api from './api';
import Notify from './notify';
import Auth from './auth';

import SearchStore from './search';
import App from '../app';

const Init = () => {
  const search = new SearchStore();

  return (
    <Router>
      <Api>
        <Notify>
          <Auth>
            <Provider SearchStore={search}>
              <App />
            </Provider>
          </Auth>
        </Notify>
      </Api>
    </Router>
  );
};

export default Init;
