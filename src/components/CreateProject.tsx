import * as React from 'react';
import { connect } from 'react-redux';
import { createProject, update } from '../actions';
import { State } from '../types';
import { Modal, Form, Button, Message } from 'semantic-ui-react';

interface Props {
  showModal: boolean;
  modalLoading: boolean;
  modalMessage: string;
  dispatch: (action: any) => void;
}

class CreateProject extends React.Component<Props, { name: string }> {

  createProject() {
    const val = this.state.name;
    if (!val) {
      this.props.dispatch(update({ modalMessage: "Project name can't be empty" }));
    } else if (!this.props.modalLoading) {
      this.props.dispatch(createProject(this.state.name));
    }
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.trim();
    this.setState({ name: val });
    this.props.dispatch(update({ modalMessage: '' }));
  }

  render() {
    const { showModal, dispatch, modalLoading, modalMessage } = this.props;
    return (
      <Modal size="tiny" open={showModal}>
        <Modal.Header>Add a new project</Modal.Header>
        <Modal.Content>
          <Form
            error={modalMessage !== ''}
            onSubmit={e => {
              e.preventDefault();
              this.createProject();
            }}>
            <Form.Input
              error={modalMessage !== ''}
              focus
              label="Project name"
              type="text"
              onChange={e => this.handleChange(e)}
            />
            {modalMessage !== '' && <Message error content={modalMessage} />}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {!modalLoading && (
            <Button
              onClick={() =>
                dispatch(
                  update({ showModal: false, modalMessage: '', modalLoading: false })
                )
              }>
              Cancel
            </Button>
          )}
          <Button
            loading={modalLoading}
            positive
            onClick={() => this.createProject()}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = ({ showModal, modalLoading, modalMessage }: State) => ({
  showModal,
  modalLoading,
  modalMessage
});

export default connect(mapStateToProps)(CreateProject);
