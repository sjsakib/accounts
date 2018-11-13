import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';

class App extends React.Component {
  render() {
    return (
      <Router>
        <>
          <Route path="/" exact component={Home} />
        </>
      </Router>
    );
  }
}

export default App;
