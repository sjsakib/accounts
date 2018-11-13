import { Dispatch, Action } from 'redux';
import firebase from '../lib/firebase';
import { State } from '../types';

export const actionTypes = {
  UPDATE: 'UPDATE'
};

export function addAuthListener(
  dispatch: Dispatch<Action>,
  getState: () => State
) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      dispatch({
        type: actionTypes.UPDATE,
        updates: { user: { name: user.displayName, uid: user.uid } }
      });
    }
    dispatch({ type: actionTypes.UPDATE, updates: { authenticating: false } });
  });
}
