import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Decorator from './Decorator';
import { State, Project } from '../types';
import { update, loadProjects } from '../actions';
import { Button, Grid, Card } from 'semantic-ui-react';
import CreateProject from './CreateProject';

class Home extends React.Component<HomeProps> {
  componentDidMount() {
    this.props.dispatch(loadProjects);
  }
  render() {
    const { dispatch, projects } = this.props;
    return (
      <Decorator title="Prodhan's Accounts">
        <Grid centered columns={2}>
          <Grid.Column>
            {Object.keys(projects).map(k => (
              <Card
                key={k}
                as={Link}
                to={`project/${k}`}
                header={projects[k].name}
                fluid
              />
            ))}
          </Grid.Column>
          <Grid.Row>
            <Button
              circular
              icon="add circle"
              onClick={() => dispatch(update({ showModal: true }))}
            />
           </Grid.Row>
        </Grid>
        <CreateProject />
      </Decorator>
    );
  }
}

interface HomeProps {
  showModal: boolean;
  projects: { [key: string]: Project };
  dispatch: (action: any) => void;
}

const mapStateToProps = ({ showModal, projects }: State) => ({
  showModal,
  projects
});

export default connect(mapStateToProps)(Home);
