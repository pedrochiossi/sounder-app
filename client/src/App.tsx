import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/routes';
import { UserProvider } from './context/user';
import Main from './components/Main';
import { GlobalStyle } from './globalStyle';

const App: React.FC = () => (
  <BrowserRouter>
    <UserProvider>
      <GlobalStyle />
      <Main>
        <Routes />
      </Main>
    </UserProvider>
  </BrowserRouter>
);

export default App;
