import * as React from 'react';
import { connect } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Project from './components/Project';
import Loading from './components/Loading';
import { addAuthListener } from './actions';
import { State, User } from './types';
import history from './lib/history';

class App extends React.Component<AppProps> {
  componentDidMount() {
    this.props.dispatch(addAuthListener);
  }

  render() {
    const { authenticating, user } = this.props;
    return (
      <>
        {user === undefined ? (
          authenticating ? (
            <Loading />
          ) : (
            <Login />
          )
        ) : (
          <Router history={history}>
            <>
              <Route path="/" exact component={Home} />
              <Route path="/project/:id" exact component={Project} />
            </>
          </Router>
        )}
      </>
    );
  }
}

interface AppProps {
  authenticating: boolean;
  user?: User;
  dispatch: (action: any) => void;
}

const mapStateToProps = ({ authenticating, user }: State) => {
  return { authenticating, user };
};

export default connect(mapStateToProps)(App);
