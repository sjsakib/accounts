export interface User {
  name: string;
  uid: string;
  photoURL: string;
}

export interface Project {
  name: string;
  owner: string;
  in: number,
  out: number,
  debt: number,
  due: number,
  edited: Date,
  sections: {
    [key: string]: Section;
  };
}

export interface Section {
  name: string;
  in: number,
  out: number,
  debt: number,
  due: number,
  edited: Date,
  entries: {
    [key: string]: Entry;
  };
}

export interface Entry {
  name: string;
  type: string;
  amount: number;
  note?: string;
  created: Date;
}

export const EntryTypes = {
  IN: 'IN',
  OUT: 'OUT',
  DUE: 'DUE',
  DEBT: 'DEBT',
  NOTE: 'NOTE'
};

export const typeOptions = [
  { text: 'Note', value: EntryTypes.NOTE },
  { text: 'In', value: EntryTypes.IN },
  { text: 'Out', value: EntryTypes.OUT },
  { text: 'Due', value: EntryTypes.DUE },
  { text: 'Debt', value: EntryTypes.DEBT }
];

export interface State {
  showModal: boolean;
  modalLoading: boolean;
  modalMessage: string;
  authenticating: boolean;
  pMessage?: string;
  emptyMessage: string;
  user?: User;
  projects: {
    [key: string]: Project;
  };
}
