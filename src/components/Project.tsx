import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { match } from 'react-router';
import Decorator from './Decorator';
import CreateProject from './CreateProject';
import Loading from './Loading';
import { Project, State } from '../types';
import { loadProject, update } from '../actions';
import { Button, Grid, Card } from 'semantic-ui-react';

interface ProjectProps {
  id: string;
  pMessage?: string;
  project?: Project;
  dispatch: (action: any) => void;
}

class ProjectComponent extends React.Component<ProjectProps> {
  componentDidMount() {
    this.load();
  }
  componentDidUpdate({ id }: ProjectProps) {
    if (id !== this.props.id) {
      this.load();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(
      update({
        pMessage: ''
      })
    );
  }

  load() {
    const { id, project, dispatch } = this.props;

    if (!project || !project.sections) {
      dispatch(loadProject(id));
    }
  }

  render() {
    const { project, pMessage, dispatch, id } = this.props;
    const sections = project && project.sections;
    if (!project && pMessage === '') {
      return <Loading />;
    }
    return (
      <Decorator title={project ? project.name : 'Error'}>
        {pMessage ? (
          <div>{pMessage}</div>
        ) : (
          <Grid centered columns={2} stackable>
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Button
                  circular
                  icon="add circle"
                  onClick={() => dispatch(update({ showModal: true }))}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Column>
              {sections &&
                Object.keys(sections).map(k => (
                  <Card
                    key={k}
                    as={Link}
                    to={`/project/${id}/${k}`}
                    header={sections[k].name}
                    fluid
                  />
                ))}
            </Grid.Column>
            <CreateProject parentProject={id} />
          </Grid>
        )}
      </Decorator>
    );
  }
}

const mapStateToProps = (
  { projects, pMessage }: State,
  { match }: { match: match<{ id: string }> }
) => {
  const id = match.params.id;
  return {
    project: projects[id],
    id,
    pMessage
  };
};

export default connect(mapStateToProps)(ProjectComponent);
