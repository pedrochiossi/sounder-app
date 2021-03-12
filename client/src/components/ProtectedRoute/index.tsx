import React from 'react';

import { Redirect, RouteProps, Route } from 'react-router-dom';
import { useUserContext } from '../../context/user';

interface Props extends RouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
}

const ProtectedRoute: React.FC<Props> = ({
  component: Component,
  ...rest
}: Props) => {
  const { isSignedIn } = useUserContext();
  return (
    <Route
      {...rest}
      render={props =>
        isSignedIn ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;
