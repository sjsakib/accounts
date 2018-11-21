import { Dispatch, Action } from 'redux';
import slugify from 'slugify';
import firebase from '../lib/firebase';
import history from '../lib/history';
import { update } from './index';
import { State, Project, Section, Entry } from '../types';

const db = firebase.firestore();

export function createProject(name: string, parentProject?: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    dispatch(update({ modalLoading: true }));
    const id = slugify(name.toLowerCase());

    const ref = parentProject
      ? db
          .collection('projects')
          .doc(parentProject)
          .collection('sections')
          .doc(id)
      : db.collection('projects').doc(id);

    ref
      .get()
      .then(res => {
        if (res.exists) {
          const modalMessage = `${
            !parentProject ? 'Project' : 'Section'
          } with same name already exists${parentProject &&
            ' under this project'}`;
          dispatch(
            update({
              modalMessage,
              modalLoading: false
            })
          );
        } else {
          ref
            .set({
              name
            })
            .then(() => {
              dispatch(
                update({
                  modalMessage: '',
                  showModal: false,
                  modalLoading: false
                })
              );
              if (parentProject) {
                history.push(`/project/${parentProject}/${id}`);
              } else {
                history.push('/project/' + id);
              }
            })
            .catch(error => {
              dispatch(
                update({
                  modalMessage:
                    `Couldn't save ${
                      !parentProject ? 'project' : 'section'
                    }. ` + error.message,
                  modalLoading: false
                })
              );
            });
        }
      })
      .catch(error => {
        dispatch(
          update({
            modalMessage:
              `Couldn't save project. ${
                !parentProject ? 'project' : 'section'
              }.` + error.message,
            modalLoading: false
          })
        );
      });
  };
}

export function loadProjects(
  dispatch: Dispatch<Action>,
  getState: () => State
) {
  db.collection('projects').onSnapshot(query => {
    query.docChanges().forEach(change => {
      const id = change.doc.id;
      const { projects } = getState();
      let project = projects[id];
      const data = change.doc.data();
      if (!project) project = data as Project;

      dispatch(
        update({
          projects: { ...projects, ...{ [id]: { ...project, ...data } } }
        })
      );
    });
  });
}

export function loadProject(projectID: string) {
  return function(dispatch: any, getState: () => State) {
    const { projects } = getState();
    dispatch(update({ pMessage: '' }));
    const projectRef = db.collection('projects').doc(projectID);

    projectRef
      .get()
      .then(res => {
        if (res.exists) {
          let project = getState().projects[projectID];
          if (!project) project = res.data() as Project;
          else project = { ...project, ...res.data() };
          dispatch(
            update({
              projects: {
                ...projects,
                ...{ [projectID]: project }
              }
            })
          );
          dispatch(loadSections(projectID));
        } else {
          dispatch(pMessage("Project doesn't exits"));
        }
      })
      .catch(error => {
        dispatch(pMessage("Couldn't load project. " + error.message));
      });
  };
}

export function loadSection(id: string, parentID: string) {
  return async function(dispatch: any, getState: () => State) {
    dispatch(pMessage(''));

    const { projects } = getState();
    let project = projects[parentID];

    const projectRef = db.collection('projects').doc(parentID);

    if (!project) {
      try {
        const projectData = await projectRef.get();
        if (!projectData.exists) {
          dispatch(pMessage("Project doesn't exits"));
          return;
        } else {
          project = projectData.data() as Project;
        }
      } catch (e) {
        dispatch(pMessage("Couldn't load section"));
        return;
      }
    }

    projectRef
      .collection('sections')
      .doc(id)
      .get()
      .then(res => {
        if (!res.exists) {
          dispatch(pMessage("Project or section doesn't exits"));
          return;
        }
        const data = res.data();
        let section = project.sections && project.sections[id];
        if (!section) section = data as Section;
        else section = { ...section, ...data };
        const updates = {
          projects: {
            ...projects,
            ...{
              [parentID]: {
                ...project,
                ...{
                  sections: {
                    ...project.sections,
                    ...{ [id]: section }
                  }
                }
              }
            }
          }
        };
        dispatch(update(updates));
        dispatch(loadEntries(parentID, id));
      })
      .catch(error => {
        dispatch(pMessage("Couldn't load section. " + error.message));
      });
  };
}

function pMessage(message: string) {
  return update({ pMessage: message });
}

export function loadSections(projectID: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    db
      .collection('projects')
      .doc(projectID)
      .collection('sections')
      .onSnapshot(query => {
        query.docChanges().forEach(change => {
          const { projects } = getState();
          const project = projects[projectID];
          const id = change.doc.id;
          const sections = project && project.sections;
          let section = sections && sections[id];
          const data = change.doc.data();
          if (!section) section = data as Section;
          else section = { ...section, ...data };

          dispatch(
            update({
              projects: {
                ...projects,
                ...{
                  [projectID]: {
                    ...project,
                    ...{ sections: { ...sections, ...{ [id]: section } } }
                  }
                }
              }
            })
          );
        });
      });
  };
}

export function loadEntries(projectID: string, sectionID: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    db
      .collection('projects')
      .doc(projectID)
      .collection('sections')
      .doc(sectionID)
      .collection('entries')
      .onSnapshot(query => {
        query.docChanges().forEach(change => {
          const id = change.doc.id;
          const { projects } = getState();
          const project = projects[projectID];
          const sections = project && project.sections;
          const section = sections && sections[sectionID];
          const entries = section && section.entries;
          let entry = entries && entries[id];
          const data = change.doc.data();
          data.created = data.created.toDate();
          if (!entry) entry = data as Entry;
          else entry = { ...entry, ...data };

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
                        ...{
                          [sectionID]: {
                            ...section,
                            ...{ entries: { ...entries, ...{ [id]: entry } } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            })
          );
        });
      });
  };
}
