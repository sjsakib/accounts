import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import Decorator from './Decorator';
import { Project, State } from '../types';
import { loadProject, update } from '../actions';

interface ProjectProps {
  id: string;
  pMessage?: string;
  project?: Project;
  dispatch: (action: any) => void;
}

class ProjectComponent extends React.Component<ProjectProps> {
  componentDidMount() {
    const { id, project, dispatch } = this.props;
    if (!project) {
      dispatch(loadProject(id));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(
      update({
        pMessage: ''
      })
    );
  }

  render() {
    const { project, pMessage } = this.props;
    return (
      <Decorator title={project ? project.name : '....'}>
        {pMessage ? <div>{pMessage}</div> : <div>This is project</div>}
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
