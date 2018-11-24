import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { match } from 'react-router';
import Decorator from './Decorator';
import CreateProject from './CreateProject';
import Loading from './Loading';
import { Project, State } from '../types';
import { loadProject, update, deleteProject } from '../actions';
import { Button, Grid, Card, Dropdown, Confirm, Message } from 'semantic-ui-react';

interface ProjectProps {
  id: string;
  pMessage?: string;
  emptyMessage: string;
  project?: Project;
  dispatch: (action: any) => void;
}

class ProjectComponent extends React.Component<
  ProjectProps,
  { delete?: boolean }
> {
  state = { delete: false}
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
        pMessage: '',
        emptyMessage: ''
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
    const { project, pMessage, dispatch, id, emptyMessage } = this.props;
    const sections = project && project.sections;
    if (pMessage === '' && (!project || (!sections && emptyMessage === ''))) {
      return <Loading />;
    }
    return (
      <Decorator
        title={project ? project.name : 'Error'}
        menuItems={
          <Dropdown.Item onClick={() => this.setState({ delete: true })}>
            Delete Project
          </Dropdown.Item>
        }>
        {pMessage ? (
          <Message content={pMessage} error />
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
            <Grid.Column textAlign="center">
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
              {emptyMessage}
            </Grid.Column>
            <CreateProject parentProject={id} />
            <Confirm
              open={this.state.delete}
              onConfirm={() => dispatch(deleteProject(id))}
              onCancel={() => this.setState({ delete: false })}
            />
          </Grid>
        )}
      </Decorator>
    );
  }
}

const mapStateToProps = (
  { projects, pMessage, emptyMessage }: State,
  { match }: { match: match<{ id: string }> }
) => {
  const id = match.params.id;
  return {
    project: projects[id],
    id,
    pMessage,
    emptyMessage
  };
};

export default connect(mapStateToProps)(ProjectComponent);
