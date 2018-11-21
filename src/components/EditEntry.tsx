import * as React from 'react';
import { connect } from 'react-redux';
import { updateEntry, update } from '../actions';
import { State, EntryTypes } from '../types';
import { Modal, Form, Button, Message } from 'semantic-ui-react';

interface Props {
  showModal: boolean;
  modalLoading: boolean;
  modalMessage: string;
  sectionID: string;
  projectID: string;
  dispatch: (action: any) => void;
}

interface FormState {
  name: string;
  nameError: string;
  type: string;
  amount?: number;
  amountError: string;
  note: string;
}

class EditEntry extends React.Component<Props, FormState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      nameError: '',
      type: EntryTypes.OUT,
      amount: 0,
      amountError: '',
      note: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  clearError() {
    this.props.dispatch(update({ modalMessage: '' }));
  }

  handleSubmit() {
    const { name, type, amount, note } = this.state;
    const { dispatch, projectID, sectionID } = this.props;
    let error = false;
    if (!name) {
      this.setState({ nameError: "Name can't be empty" });
      error = true;
    }
    if (type !== EntryTypes.NOTE && !amount) {
      this.setState({ amountError: "Amount can't be zero" });
      error = true;
    }
    if (!error) {
      dispatch(
        updateEntry(projectID, sectionID, {
          name,
          type,
          amount,
          note,
          created: new Date()
        })
      );
    }
  }

  render() {
    const { showModal, dispatch, modalLoading, modalMessage } = this.props;
    const { type, nameError, amountError } = this.state;
    const typeOptions = [
      { text: 'Note', value: EntryTypes.NOTE },
      { text: 'Income', value: EntryTypes.IN },
      { text: 'Expense', value: EntryTypes.OUT },
      { text: 'Due', value: EntryTypes.DUE },
      { text: 'Debt', value: EntryTypes.DEBT }
    ];
    return (
      <Modal size="tiny" open={showModal}>
        <Modal.Header>New Entry</Modal.Header>
        <Modal.Content>
          <Form
            error={(modalMessage || amountError || nameError) !== ''}
            onSubmit={e => {
              e.preventDefault();
              this.handleSubmit();
            }}>
            <Form.Input
              error={nameError !== ''}
              focus
              label="Name"
              type="text"
              onChange={e => {
                this.setState({ name: e.target.value, nameError: '' });
                this.clearError();
              }}
            />
            {nameError !== '' && <Message error content={nameError} />}
            <Form.Group className="evenly-spaced">
              <Form.Select
                label="Type"
                value={type}
                options={typeOptions}
                onChange={(e, d) =>
                  this.setState({ type: (d.value as string).trim() })
                }
              />
              {type !== EntryTypes.NOTE && (
                <>
                  <Form.Input
                    error={amountError !== ''}
                    label="Amount"
                    type="number"
                    onChange={e => {
                      this.setState({
                        amount: Number(e.target.value),
                        amountError: ''
                      });
                      this.clearError();
                    }}
                  />
                  {amountError !== '' && (
                    <Message error content={amountError} />
                  )}
                </>
              )}
            </Form.Group>
            <Form.TextArea
              label="Note"
              onChange={(e, d) => this.setState({ note: d.value as string })}
            />

            {modalMessage !== '' && <Message error content={modalMessage} />}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {!modalLoading && (
            <Button
              onClick={() =>
                dispatch(
                  update({
                    showModal: false,
                    modalMessage: '',
                    modalLoading: false
                  })
                )
              }>
              Cancel
            </Button>
          )}
          <Button loading={modalLoading} positive onClick={this.handleSubmit}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (
  { showModal, modalLoading, modalMessage }: State,
  { projectID, sectionID }: { projectID?: string; sectionID: string }
) => ({
  showModal,
  modalLoading,
  modalMessage,
  projectID,
  sectionID
});

export default connect(mapStateToProps)(EditEntry);
