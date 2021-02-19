import React from 'react';
import Header from '../Header';
import { useUserContext } from '../../context/user';
import Loader from '../Loader';

interface Props {
  children: React.ReactNode;
}

const Main: React.FC<Props> = ({ children }: Props) => {
  const { loading } = useUserContext();

  return (
    <main className="bg-dark">
      <Header />
      <div className="main-content">
        {loading && <Loader />}
        {children}
      </div>
    </main>
  );
};

export default Main;
