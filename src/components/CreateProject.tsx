import * as React from 'react';
import { connect } from 'react-redux';
import { createProject, update } from '../actions';
import { State } from '../types';
import { Modal, Form, Button, Message } from 'semantic-ui-react';

interface Props {
  showModal: boolean;
  modalLoading: boolean;
  modalMessage: string;
  parentProject?: string;
  dispatch: (action: any) => void;
}

class CreateProject extends React.Component<Props, { name: string }> {
  state = {
    name: ''
  }
  
  createProject() {
    const val = this.state.name;
    const { dispatch, parentProject } = this.props;
    if (!val) {
      dispatch(update({ modalMessage: "Project name can't be empty" }));
    } else if (!this.props.modalLoading) {
      dispatch(createProject(this.state.name, parentProject));
    }
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.trim();
    this.setState({ name: val });
    this.props.dispatch(update({ modalMessage: '' }));
  }

  render() {
    const {
      showModal,
      dispatch,
      modalLoading,
      modalMessage,
      parentProject
    } = this.props;
    return (
      <Modal size="tiny" open={showModal}>
        <Modal.Header>Add a new {!parentProject ? 'project' : 'section'}</Modal.Header>
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
              label={`${!parentProject ? 'Project' : 'Section'} name`}
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

const mapStateToProps = (
  { showModal, modalLoading, modalMessage }: State,
  { parentProject }: { parentProject?: string }
) => ({
  showModal,
  modalLoading,
  modalMessage,
  parentProject
});

export default connect(mapStateToProps)(CreateProject);
