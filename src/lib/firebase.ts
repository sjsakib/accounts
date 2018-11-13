import * as firebase from 'firebase/app';

const config = {
  apiKey: 'AIzaSyDMrvGxyJOi0bT2CAlFh9AScDlNhjgCql4',
  authDomain: 'prodhan-accounts.firebaseapp.com',
  databaseURL: 'https://prodhan-accounts.firebaseio.com',
  projectId: 'prodhan-accounts',
  storageBucket: 'prodhan-accounts.appspot.com',
  messagingSenderId: '870475139301'
};

firebase.initializeApp(config);

export default firebase;
