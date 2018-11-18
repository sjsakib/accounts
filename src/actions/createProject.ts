import { Dispatch, Action } from 'redux';
import slugify from 'slugify';
import firebase from '../lib/firebase';
import history from '../lib/history';
import { update } from './index';
import { State } from '../types';

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
                update({ modalMessage: '', showModal: false, modalLoading: false })
              );
              history.push('/project/'+ id);
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
