import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import MainPage  from '../pages/main/Main';
import TestViewPage from '../pages/testView/TestView';
import TestEditPage from '../pages/testEdit/TestEdit';
import UserPage from '../pages/users/Users';
import GroupsPage from '../pages/groups/Groups';
import AdminPage from '../pages/admin/Admin';

const AppRouter = () =>  {

  return (
    <Router>
      <Switch >
        <Route path="/" exact component={MainPage} />
        <Route path="/test/view" exact component={TestViewPage} />
        <Route path="/test/edit" exact component={TestEditPage} />
        <Route path="/users" exact component={UserPage} />
        <Route path="/groups" exact component={GroupsPage} />
        <Route path="/admin" exact component={AdminPage} />

        <Redirect to="/" exact/>
      </Switch>
    </Router>
  );
}

export default AppRouter;
