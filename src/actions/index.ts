import { Dispatch, Action } from 'redux';
import firebase from '../lib/firebase';
import { State } from '../types';

export const actionTypes = {
  UPDATE: 'UPDATE'
};

export const update = (updates: Partial<State>) => ({
  type: actionTypes.UPDATE,
  updates
});

export function addAuthListener(
  dispatch: Dispatch<Action>,
  getState: () => State
) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const data = {
        name: user.displayName || 'No Name',
        uid: user.uid,
        photoURL: user.photoURL || ''
      };
      dispatch(update({ user: data }));
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set(data, { merge: true });
    } else {
      dispatch(update({ user: undefined }));
    }
    dispatch(update({ authenticating: false }));
  });
}

export function createProject(projectName: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    dispatch(update({ modalLoading: true }));
    const id = projectName
      .toLowerCase()
      .split(' ')
      .join('-');

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
