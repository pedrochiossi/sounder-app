import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from '../components/Loader';
import Home from '../pages/Home';
import ProtectedRoute from '../components/ProtectedRoute';

const Discovery = lazy(() => import('../pages/Discovery'));
const Tracks = lazy(() => import('../pages/Tracks'));

const Routes: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route exact path="/" render={() => <Home />} />
      <ProtectedRoute path="/discovery" component={Discovery} />
      <ProtectedRoute path="/tracks" component={Tracks} />
    </Switch>
  </Suspense>
);

export default Routes;
