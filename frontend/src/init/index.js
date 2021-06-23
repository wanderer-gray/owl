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
      <Notify>
        <Api>
          <Auth>
            <Provider SearchStore={search}>
              <App />
            </Provider>
          </Auth>
        </Api>
      </Notify>
    </Router>
  );
};

export default Init;
