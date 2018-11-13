import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import { addAuthListener } from './actions';
import { State } from './types';

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
            <div>Loading</div>
          ) : (
            <Login />
          )
        ) : (
          <Router>
            <>
              <Route path="/" exact component={Home} />
            </>
          </Router>
        )}
      </>
    );
  }
}

interface AppProps {
  authenticating: boolean;
  user?: { name: string; uid: string };
  dispatch: (action: any) => void
}

const mapStateToProps = ({ authenticating, user }: State) => {
  return { authenticating, user };
};

export default connect(mapStateToProps)(App);
