import React from 'react';

import Api from './api';
import Notify from './notify';
import Auth from './auth';
import App from '../app';

const Init = () => (
  <Api>
    <Notify>
      <Auth>
        <App />
      </Auth>
    </Notify>
  </Api>
);

export default Init;
