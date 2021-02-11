import React, { useEffect, useContext } from 'react';
import Header from '../Header';
import { UserContext } from '../../context/user';

interface Props {
  children: React.ReactNode;
}

const Main: React.FC<Props> = ({ children }: Props) => {
  const { user, fetchData, isSignedIn } = useContext(UserContext);

  const { name, imageURL } = user;

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      fetchData();
    }
  }, [user, fetchData]);

  return (
    <main className="bg-dark">
      {isSignedIn && <Header name={name} imageURL={imageURL} />}
      <div className="main-content">{children}</div>
    </main>
  );
};

export default Main;
