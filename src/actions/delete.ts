import { Dispatch, Action } from 'redux';
import firebase from '../lib/firebase';
import history from '../lib/history';
import { update } from './index';
import { State, EntryTypes } from '../types';

export function deleteProject(projectID: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    const sections = getState().projects[projectID].sections;
    if (sections && Object.keys(sections).length !== 0) {
      window.alert("Project is not empty. Can't delete.");
      return;
    }
    firebase
      .firestore()
      .collection('projects')
      .doc(projectID)
      .delete()
      .then(() => {
        history.push('/');
        const projects = { ...getState().projects };
        delete projects[projectID];
        dispatch(update({ projects }));
      });
  };
}

export function deleteSection(projectID: string, sectionID: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    const entries = getState().projects[projectID].sections[sectionID].entries;
    if (entries && Object.keys(entries).length !== 0) {
      window.alert("Section is not empty. Can't delete.");
      return;
    }
    firebase
      .firestore()
      .collection('projects')
      .doc(projectID)
      .collection('sections')
      .doc(sectionID)
      .delete()
      .then(() => {
        history.push('/project/' + projectID);
        const projects = getState().projects;
        const project = projects[projectID];
        const sections = { ...project.sections };
        delete sections[sectionID];
        dispatch(
          update({
            projects: {
              ...projects,
              ...{ [projectID]: { ...project, ...{ sections } } }
            }
          })
        );
      });
  };
}

export function deleteEntry(
  projectID: string,
  sectionID: string,
  entryID: string
) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    const ans = window.confirm('Sure to delete entry?');
    if (!ans) return;
    const projectRef = firebase
      .firestore()
      .collection('projects')
      .doc(projectID);
    const sectionRef = projectRef.collection('sections').doc(sectionID);

    sectionRef
      .collection('entries')
      .doc(entryID)
      .delete();

    try {
      const projects = getState().projects;
      const project = projects[projectID];
      const sections = project.sections;
      const section = sections[sectionID];
      const entries = {
        ...section.entries
      };
      const entry = entries[entryID];
      delete entries[entryID];
      dispatch(
        update({
          projects: {
            ...projects,
            ...{
              [projectID]: {
                ...project,
                ...{
                  sections: {
                    ...sections,
                    ...{ [sectionID]: { ...section, ...{ entries } } }
                  }
                }
              }
            }
          }
        })
      );

      projectRef.get().then(res => {
        const data = res.data();
        if (!data) return;
        data.edited = new Date();
        switch (entry.type) {
          case EntryTypes.DUE:
            data.due -= entry.amount;
            break;
          case EntryTypes.DEBT:
            data.debt -= entry.amount;
            break;
          case EntryTypes.IN:
            data.in -= entry.amount;
            break;
          case EntryTypes.OUT:
            data.out -= entry.amount;
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
            data.due -= entry.amount;
            break;
          case EntryTypes.DEBT:
            data.debt -= entry.amount;
            break;
          case EntryTypes.IN:
            data.in -= entry.amount;
            break;
          case EntryTypes.OUT:
            data.out -= entry.amount;
            break;
        }
        sectionRef.update(data);
      });
    } catch (e) {
      console.log(e);
    }
  };
}
