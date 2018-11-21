import { Dispatch, Action } from 'redux';
import firebase from '../lib/firebase';
import { update } from './index';
import { State, Entry } from '../types';

const db = firebase.firestore();

export function updateEntry(
  projectID: string,
  sectionID: string,
  entry: Entry,
  entryID?: string
) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    dispatch(update({ modalLoading: true }));
    const ref = db
      .collection('projects')
      .doc(projectID)
      .collection('sections')
      .doc(sectionID);

    ref
      .get()
      .then(res => {
        if (res.exists) {
          const entryRef = entryID
            ? ref.collection('entries').doc(entryID)
            : ref.collection('entries').doc();
          entryRef
            .set(entry, { merge: true })
            .then(() => {
              dispatch(
                update({
                  modalMessage: '',
                  showModal: false,
                  modalLoading: false
                })
              );
            })
            .catch(error => {
              dispatch(
                update({
                  modalMessage: "Couldn't save entry. " + error.message,
                  modalLoading: false
                })
              );
            });
        } else {
          dispatch(
            update({
              modalMessage: "Project or section doesn't exists",
              modalLoading: false
            })
          );
        }
      })
      .catch(error => {
        dispatch(
          update({
            modalMessage: "Couldn't save entry. " + error.message,
            modalLoading: false
          })
        );
      });
  };
}
