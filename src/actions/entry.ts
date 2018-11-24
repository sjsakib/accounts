import { Dispatch, Action } from 'redux';
import firebase from '../lib/firebase';
import { update } from './index';
import { State, Entry, EntryTypes } from '../types';

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

export function clearEntry(
  projectID: string,
  sectionID: string,
  entryID: string
) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    if (!window.confirm('Sure to clear entry?')) return;

    try {
      const projects = getState().projects;
      const project = projects[projectID];
      const sections = project.sections;
      const section = sections[sectionID];
      const entries = section.entries;
      const entry = { ...entries[entryID] };

      let type = entry.type;
      if (entry.type === EntryTypes.DUE) {
        type = EntryTypes.IN;
      } else if (entry.type === EntryTypes.DEBT) {
        type = EntryTypes.OUT;
      }
      firebase
        .firestore()
        .collection('projects')
        .doc(projectID)
        .collection('sections')
        .doc(sectionID)
        .collection('entries')
        .doc(entryID)
        .set({ type }, { merge: true });
    } catch (e) {
      console.log(e);
      return;
    }
  };
}
