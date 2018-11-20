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

export * from './project';
export * from './entry';