import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import Decorator from './Decorator';
import EditEntry from './EditEntry';
import Loading from './Loading';
import { Section, State, EntryTypes } from '../types';
import { loadSection, update } from '../actions';
import { Button, Message, Grid, Table } from 'semantic-ui-react';

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
    if (!section || !section.entries) {
      dispatch(loadSection(id, parentID));
    }
  }

  render() {
    const { section, pMessage, dispatch, id, parentID } = this.props;
    const entries = section && section.entries;

    if (!section && pMessage === '') {
      return <Loading />;
    }

    const rows =
      entries &&
      Object.keys(entries).map(k => {
        const e = entries[k];
        const created = e.created.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        const warning = e.type === EntryTypes.OUT;
        const negative = e.type === EntryTypes.DUE;
        const positive = e.type === EntryTypes.IN;
        const error = e.type === EntryTypes.DEBT;

        return (
          <Table.Row
            key={k}
            warning={warning}
            error={error}
            positive={positive}
            negative={negative}>
            <Table.Cell>
              {e.name} <br /> <small>{created}</small> <br />
              <small>{e.note}</small>
            </Table.Cell>
            <Table.Cell>{e.type}</Table.Cell>
            <Table.Cell>{e.amount ? e.amount : '--'}</Table.Cell>
          </Table.Row>
        );
      });

    return (
      <Decorator title={section ? section.name : 'Error'}>
        {pMessage ? (
          <Message error content={pMessage} />
        ) : (
          <Grid centered>
            <Grid.Row>
              <Grid.Column>
                <Button
                  circular
                  icon="add circle"
                  onClick={() => dispatch(update({ showModal: true }))}
                />
              </Grid.Column>
              <Table unstackable compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{rows}</Table.Body>
              </Table>
            </Grid.Row>
            <EditEntry projectID={parentID} sectionID={id} />
          </Grid>
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
