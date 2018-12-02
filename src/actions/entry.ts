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
    const projectRef = db.collection('projects').doc(projectID);
    const sectionRef = projectRef.collection('sections').doc(sectionID);

    sectionRef
      .get()
      .then(res => {
        if (res.exists) {
          const entryRef = entryID
            ? sectionRef.collection('entries').doc(entryID)
            : sectionRef.collection('entries').doc();

          entryRef.set(entry, { merge: true }).catch(error => {
            dispatch(
              update({
                modalMessage: "Couldn't save entry. " + error.message,
                modalLoading: false
              })
            );
          });

          dispatch(
            update({
              modalMessage: '',
              showModal: false,
              modalLoading: false
            })
          );

          if (entry.type === EntryTypes.NOTE) return;

          projectRef.get().then(res => {
            const data = res.data();
            if (!data) return;
            data.edited = new Date();
            switch (entry.type) {
              case EntryTypes.DUE:
                data.due = data.due + entry.amount;
                break;
              case EntryTypes.DEBT:
                data.debt = data.debt + entry.amount;
                break;
              case EntryTypes.IN:
                data.in = data.in + entry.amount;
                break;
              case EntryTypes.OUT:
                data.out = data.out + entry.amount;
                break;
            }
            projectRef.update(data);
          });

          sectionRef.get().then(res => {
            const data = res.data();
            if (!data) return;
            data.edited = new Date();
            switch (entry.type) {
              case EntryTypes.DUE:
                data.due = data.due + entry.amount;
                break;
              case EntryTypes.DEBT:
                data.debt = data.debt + entry.amount;
                break;
              case EntryTypes.IN:
                data.in = data.in + entry.amount;
                break;
              case EntryTypes.OUT:
                data.out = data.out + entry.amount;
                break;
            }
            sectionRef.update(data);
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

      const projectRef = firebase
        .firestore()
        .collection('projects')
        .doc(projectID);

      const sectionRef = projectRef.collection('sections').doc(sectionID);

      sectionRef
        .collection('entries')
        .doc(entryID)
        .set({ type }, { merge: true });
      
      projectRef.get().then(res => {
        const data = res.data();
        if (!data) return;
        data.edited = new Date();
        if (entry.type === EntryTypes.DUE) {
          data.due -= entry.amount;
          data.in += entry.amount;
        } else if (entry.type === EntryTypes.DEBT) {
          data.debt -= entry.amount;
          data.out += entry.amount;
        }
        projectRef.update(data);
      });

      sectionRef.get().then(res => {
        const data = res.data();
        if (!data) return;
        data.edited = new Date();
        if (entry.type === EntryTypes.DUE) {
          data.due -= entry.amount;
          data.in += entry.amount;
        } else if (entry.type === EntryTypes.DEBT) {
          data.debt -= entry.amount;
          data.out += entry.amount;
        }
        sectionRef.update(data);
      });
    } catch (e) {
      console.log(e);
      return;
    }
  };
}
