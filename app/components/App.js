import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, themeObj } from '../context/Context';
import Auth from './Auth';
import Chatroom from './Chatroom';
import DeleteAccount from './DeleteAccount';
import Home from './Home';
import Logout from './Logout';
import Nav from './NavBar';

export default function App() {
  const [currentUserName, setCurrentUserName] = React.useState(
    sessionStorage.getItem('CurrentUser') ?? null
  );

  const [isAuthed, setAuthed] = React.useState({
    activeUserName: currentUserName ?? null,
    isAuthenticated: !!currentUserName,
  });

  return (
    <Router>
      <ThemeProvider theme={themeObj}>
        <AuthProvider value={isAuthed}>
          {!isAuthed.isAuthenticated && <Nav />}

          {!isAuthed.isAuthenticated && <Redirect to='/' />}

          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/chat' component={Chatroom} />
            <Route
              path='/authenticate'
              render={props => <Auth {...props} setAuth={setAuthed} />}
            />
            <Route
              path='/logout'
              render={props => <Logout {...props} setAuth={setAuthed} />}
            />
            <Route
              path='/delete-account'
              render={props => <DeleteAccount {...props} setAuth={setAuthed} />}
            />
          </Switch>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
