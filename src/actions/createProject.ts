import { Dispatch, Action } from 'redux';
import slugify from 'slugify';
import firebase from '../lib/firebase';
import history from '../lib/history';
import { update } from './index';
import { State, Project } from '../types';

export function createProject(projectName: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    dispatch(update({ modalLoading: true }));
    const id = slugify(projectName.toLowerCase());

    const ref = firebase
      .firestore()
      .collection('projects')
      .doc(id);

    ref
      .get()
      .then(res => {
        if (res.exists) {
          dispatch(
            update({
              modalMessage: 'Project with same name already exists',
              modalLoading: false
            })
          );
        } else {
          ref
            .set({
              name: projectName
            })
            .then(() => {
              dispatch(
                update({
                  modalMessage: '',
                  showModal: false,
                  modalLoading: false
                })
              );
              history.push('/project/' + id);
            })
            .catch(error => {
              dispatch(
                update({
                  modalMessage: "Couldn't save project. " + error.message,
                  modalLoading: false
                })
              );
            });
        }
      })
      .catch(error => {
        dispatch(
          update({
            modalMessage: "Couldn't save project. " + error.message,
            modalLoading: false
          })
        );
      });
  };
}

export function loadProject(projectID: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    const { projects } = getState();
    firebase
      .firestore()
      .collection('projects')
      .doc(projectID)
      .get()
      .then(res => {
        if (res.exists) {
          dispatch(
            update({
              projects: {
                ...projects,
                ...{ [projectID]: res.data() as Project }
              }
            })
          );
        } else {
          dispatch(
            update({
              pMessage: "Project doesn't exits"
            })
          );
        }
      })
      .catch(error => {
        dispatch(
          update({
            pMessage: "Couldn't load project" + error.message
          })
        );
      });
  };
}
