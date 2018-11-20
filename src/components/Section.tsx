import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import Decorator from './Decorator';
import EditEntry from './EditEntry';
import Loading from './Loading';
import { Section, State } from '../types';
import { loadSection, update } from '../actions';
import { Button, Message } from 'semantic-ui-react';

interface Props {
  id: string;
  parentID: string;
  pMessage?: string;
  section?: Section;
  dispatch: (action: any) => void;
}

class SectionComponent extends React.Component<Props> {
  componentDidMount() {
    this.load();
  }
  componentDidUpdate({ id, parentID }: Props) {
    if (id !== this.props.id || parentID !== this.props.parentID) {
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
    const { id, parentID, section, dispatch } = this.props;
    if (!section) {
      dispatch(loadSection(id, parentID));
    }
  }

  render() {
    const { section, pMessage, dispatch, id, parentID } = this.props;

    if (!section) {
      return <Loading />;
    }

    return (
      <Decorator title={section.name}>
        {pMessage ? (
          <Message error content={pMessage} />
        ) : (
          <>
            <Button
              circular
              icon="add circle"
              onClick={() => dispatch(update({ showModal: true }))}
            />
            <EditEntry projectID={parentID} sectionID={id} />
          </>
        )}
      </Decorator>
    );
  }
}

const mapStateToProps = (
  { projects, pMessage }: State,
  { match }: { match: match<{ id: string; parentID: string }> }
) => {
  const { id, parentID } = match.params;
  return {
    section: projects[parentID] && projects[parentID].sections[id],
    parentID,
    id,
    pMessage
  };
};

export default connect(mapStateToProps)(SectionComponent);
