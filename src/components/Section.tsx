import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import Decorator from './Decorator';
import EditEntry from './EditEntry';
import Loading from './Loading';
import { Section, State, EntryTypes, typeOptions } from '../types';
import { loadSection, update, deleteEntry, deleteSection } from '../actions';
import { Button, Message, Grid, Table, Dropdown } from 'semantic-ui-react';

interface Props {
  id: string;
  parentID: string;
  pMessage?: string;
  emptyMessage: string;
  section?: Section;
  dispatch: (action: any) => void;
}

class SectionComponent extends React.Component<
  Props,
  { typeFilter: string; sortField: string; order: number }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      typeFilter: 'ALL',
      sortField: 'created',
      order: -1
    };
  }
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
        pMessage: '',
        emptyMessage: ''
      })
    );
  }

  load() {
    const { id, parentID, section, dispatch } = this.props;
    if (!section || !section.entries) {
      dispatch(loadSection(id, parentID));
    }
  }

  handleSort(field: string) {
    let { sortField, order } = this.state;
    if (sortField === field) {
      order *= -1;
    } else {
      sortField = field;
      order = -1;
    }
    this.setState({ sortField, order });
  }

  render() {
    const {
      section,
      pMessage,
      dispatch,
      id,
      parentID,
      emptyMessage
    } = this.props;
    const entries = section && section.entries;

    if (pMessage === '' && (!section || (!entries && emptyMessage === ''))) {
      return <Loading />;
    }

    const { typeFilter, sortField, order } = this.state;
    const rows =
      entries &&
      Object.keys(entries)
        .filter(k => typeFilter === 'ALL' || entries[k].type === typeFilter)
        .sort(
          (k1, k2) =>
            entries[k1][sortField] < entries[k2][sortField]
              ? -1 * order
              : 1 * order
        )
        .map(k => {
          const e = entries[k];
          const created = e.created.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          const warning = e.type === EntryTypes.DUE;
          const negative = e.type === EntryTypes.DEBT;
          const positive = e.type === EntryTypes.IN;

          return (
            <Table.Row
              key={k}
              warning={warning}
              positive={positive}
              negative={negative}>
              <Table.Cell className="pre-line">
                {e.name} <br /> <small>{created}</small> <br />
                <small>{e.note}</small>
              </Table.Cell>
              <Table.Cell>
                <Dropdown icon="setting">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => dispatch(deleteEntry(parentID, id, k))}>
                      Delete entry
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {e.type}
              </Table.Cell>
              <Table.Cell>{e.amount ? e.amount : '--'}</Table.Cell>
            </Table.Row>
          );
        });

    const total = entries
      ? Object.keys(entries)
          .filter(k => typeFilter === 'ALL' || entries[k].type === typeFilter)
          .reduce((prev, cur) => {
            const entry = entries[cur];
            if (entry.type === EntryTypes.DUE || entry.type === EntryTypes.IN) {
              return prev + entry.amount;
            } else {
              return prev - entry.amount;
            }
          }, 0)
      : 0;

    const filterOptions = [{ text: 'All', value: 'ALL' }, ...typeOptions];

    const emptyRow = emptyMessage ? (
      <Table.Row>
        <Table.Cell textAlign="center" colSpan="3">
          {emptyMessage}
        </Table.Cell>
      </Table.Row>
    ) : (
      ''
    );

    const sortDirection = order === -1 ? 'descending' : 'ascending';

    return (
      <Decorator
        title={section ? section.name : 'Error'}
        menuItems={
          <Dropdown.Item onClick={() => dispatch(deleteSection(parentID, id))}>
            Delete Section
          </Dropdown.Item>
        }>
        {pMessage ? (
          <Message error content={pMessage} />
        ) : (
          <Grid centered>
            <Grid.Row>
              <Grid.Row>
                <Button
                  circular
                  icon="add circle"
                  onClick={() => dispatch(update({ showModal: true }))}
                />
              </Grid.Row>
              <Table unstackable compact sortable celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell
                      sorted={
                        sortField === 'created' ? sortDirection : undefined
                      }
                      onClick={() => this.handleSort('created')}>
                      Info
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      Type:
                      <Dropdown
                        onChange={(e, v) =>
                          this.setState({ typeFilter: v.value as string })
                        }
                        className="filter-dropdown"
                        options={filterOptions}
                        defaultValue={typeFilter}
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={
                        sortField === 'amount' ? sortDirection : undefined
                      }
                      onClick={() => this.handleSort('amount')}>
                      Amount
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {rows}
                  {emptyRow}
                </Table.Body>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="2" textAlign="right">
                      Summary:
                    </Table.HeaderCell>
                    <Table.HeaderCell>{total}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
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
  { projects, pMessage, emptyMessage }: State,
  { match }: { match: match<{ id: string; parentID: string }> }
) => {
  const { id, parentID } = match.params;
  return {
    section: projects[parentID] && projects[parentID].sections[id],
    parentID,
    id,
    pMessage,
    emptyMessage
  };
};

export default connect(mapStateToProps)(SectionComponent);
