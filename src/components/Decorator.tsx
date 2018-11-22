import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Container, Icon, Image, Dropdown } from 'semantic-ui-react';
import { User, State } from '../types';
import firebase from '../lib/firebase';

const Decorator: React.SFC<{
  user?: User;
  title: string;
  menuItems?: React.ReactNode;
}> = function({ children, user, title, menuItems }) {
  return (
    <Container>
      <Menu borderless fluid>
        <Menu.Item header as={Link} to="/">
          <Icon name="home" />
        </Menu.Item>
        <Menu.Item header>{title}</Menu.Item>
        <Menu.Menu position="right">
          {user && (
            <Menu.Item>
              <Dropdown
                pointing="top right"
                icon={null}
                trigger={<Image src={user.photoURL} avatar />}>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => firebase.auth().signOut()}>
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {menuItems && (
                <Menu.Item>
                  <Dropdown
                    pointing="top right"
                    icon="ellipsis vertical"
                    >
                    <Dropdown.Menu>
                      {menuItems}
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
              )}
            </Menu.Item>
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
