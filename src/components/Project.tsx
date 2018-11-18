import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import Decorator from './Decorator';
import CreateProject from './CreateProject';
import { Project, State } from '../types';
import { loadProject, update } from '../actions';
import { Button } from 'semantic-ui-react';

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
    if (!project) {
      dispatch(loadProject(id));
    }
  }

  render() {
    const { project, pMessage, dispatch, id } = this.props;
    return (
      <Decorator title={project ? project.name : '....'}>
        {pMessage ? (
          <div>{pMessage}</div>
        ) : (
          <>
            <Button
              circular
              icon="add circle"
              onClick={() => dispatch(update({ showModal: true }))}
            />
            <CreateProject parentProject={id} />
          </>
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
