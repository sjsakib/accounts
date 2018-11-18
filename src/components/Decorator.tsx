import * as React from 'react';
import { connect } from 'react-redux';
import { Menu, Container, Button } from 'semantic-ui-react';
import { User, State } from '../types';
import firebase from '../lib/firebase';

const Decorator: React.SFC<{
  user?: User;
  title: string;
}> = function({ children, user }) {
  return (
    <Container>
      <Menu>
        <Menu.Item header>Prodhan's Trading Accounts</Menu.Item>
        <Menu.Menu position="right">
          {user && (
            <>
              <Menu.Item header>{user.name}</Menu.Item>
              <Menu.Item>
                <Button onClick={() => firebase.auth().signOut()}>
                  Log out
                </Button>
              </Menu.Item>
            </>
          )} 
        </Menu.Menu>
      </Menu>
      {children}
    </Container>
  );
};

const mapStateToProps = ({ user }: State) => ({
  user
});

export default connect(mapStateToProps)(Decorator);