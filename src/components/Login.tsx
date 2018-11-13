import * as React from 'react';
import { connect } from 'react-redux';
import * as firebaseui from 'firebaseui';
import firebase from '../lib/firebase';
import 'firebaseui/dist/firebaseui.css';

class Login extends React.Component<{}, { loadingUI: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { loadingUI: true };
  }

  componentDidMount() {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: () => false,
        uiShown: () => this.setState({ loadingUI: false })
      },
      signInFlow: 'popup',
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    };

    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  render() {
    return (
      <div>
        Sign in to continue
        <div id="firebaseui-auth-container" />
      </div>
    );
  }
}

export default connect()(Login);
