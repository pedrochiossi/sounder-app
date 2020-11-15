import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from '../components/Loader';
import Home from '../pages/Home';

const Discovery = lazy(() => import('../pages/Discovery'));

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route exact path="/" render={() => <Home />} />
        <Route path="/discovery" render={() => <Discovery />} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
