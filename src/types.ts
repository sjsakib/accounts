export interface User {
  name: string;
  uid: string;
  photoURL: string;
}

export interface Project {
  name: string;
  sections: Section[]
}

export interface Section {
  name: string;
  entries: {
    [key: string]: Entry;
  };
}

export interface Entry {
  name: string;
  type: string;
  amount?: number;
  note?: string;
  created: Date;
}

export const EntryTypes = {
  IN: 'IN',
  OUT: 'OUT',
  DUE: 'DUE',
  DEBT: 'DEBT',
  NOTE: 'NOTE',
};

export interface State {
  showModal: boolean;
  modalLoading: boolean;
  modalMessage: string;
  authenticating: boolean;
  pMessage?: string;
  user?: User;
  projects: {
    [key: string]: Project;
  };
}
