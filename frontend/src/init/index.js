import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import Api from './api';
import Notify from './notify';
import Auth from './auth';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import DateFnsLocale from "date-fns/locale/ru";

import SearchStore from './search';
import App from '../app';

const Init = () => {
  const search = new SearchStore();

  return (
    <Router>
      <Notify>
        <Api>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={DateFnsLocale}
          >
            <Auth>
              <Provider SearchStore={search}>
                <App />
              </Provider>
            </Auth>
          </MuiPickersUtilsProvider>
        </Api>
      </Notify>
    </Router>
  );
};

export default Init;
