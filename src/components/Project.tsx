import * as React from 'react';
import { match } from 'react-router';
import Decorator from './Decorator';

interface ProjectProps {
  match: match<{ id: string }>;
}

class Project extends React.Component<ProjectProps> {
  render() {
    const id = this.props.match.params.id;
    return (
      <Decorator title="id">
        <div>This is project {id}</div>
      </Decorator>
    );
  }
}

export default Project;
