import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Decorator from './Decorator';
import { State, Project } from '../types';
import { update, loadProjects } from '../actions';
import { Button, Grid, Card, Label } from 'semantic-ui-react';
import CreateProject from './CreateProject';
import formatNumber from '../lib/formatNumber';

class Home extends React.Component<HomeProps> {
  componentDidMount() {
    this.props.dispatch(loadProjects);
    document.title = "Prodhan's Trading Accounts";
  }
  render() {
    const { dispatch, projects } = this.props;
    return (
      <Decorator title="Prodhan's Accounts">
        <Grid centered stackable columns={2}>
          <Grid.Row centered>
            <Grid.Column textAlign="center">
              <Button
                circular
                icon="add circle"
                onClick={() => dispatch(update({ showModal: true }))}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Column>
            {Object.keys(projects)
              .sort(
                (k1, k2) => (projects[k1].edited < projects[k2].edited ? 1 : -1)
              )
              .map(k => (
                <Card key={k} as={Link} to={`project/${k}`} fluid>
                  <Card.Content textAlign="center" header={projects[k].name} />
                  <Card.Content textAlign="center" extra>
                    <Label>
                      In <Label.Detail>{formatNumber(projects[k].in)}</Label.Detail>
                    </Label>
                    <Label>
                      Out <Label.Detail>{formatNumber(projects[k].out)}</Label.Detail>
                    </Label>
                    <Label>
                      Debt <Label.Detail>{formatNumber(projects[k].debt)}</Label.Detail>
                    </Label>
                    <Label>
                      Due <Label.Detail>{formatNumber(projects[k].due)}</Label.Detail>
                    </Label>
                  </Card.Content>
                </Card>
              ))}
          </Grid.Column>
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
