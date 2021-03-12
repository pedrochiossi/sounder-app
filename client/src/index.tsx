import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/routes';
import * as serviceWorker from './serviceWorker.js';
import { UserProvider } from './context/user';
import Main from './components/Main';
import { GlobalStyle } from './globalStyle';

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <GlobalStyle />
      <Main>
        <Routes />
      </Main>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
