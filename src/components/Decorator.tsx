import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Container, Button } from 'semantic-ui-react';
import { User, State } from '../types';
import firebase from '../lib/firebase';

const Decorator: React.SFC<{
  user?: User;
  title: string;
}> = function({ children, user, title }) {
  return (
    <Container>
      <Menu>
        <Menu.Item header as={Link} to ="/">Home</Menu.Item>
        <Menu.Item header>{title}</Menu.Item>
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
