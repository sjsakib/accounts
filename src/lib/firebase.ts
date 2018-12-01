import * as firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDMrvGxyJOi0bT2CAlFh9AScDlNhjgCql4',
  authDomain: 'prodhan-accounts.firebaseapp.com',
  databaseURL: 'https://prodhan-accounts.firebaseio.com',
  projectId: 'prodhan-accounts',
  storageBucket: 'prodhan-accounts.appspot.com',
  messagingSenderId: '870475139301'
};

firebase.initializeApp(config);

const settings = { timestampsInSnapshots: true };
firebase.firestore().settings(settings);

firebase.firestore().enablePersistence().catch(reason => {
  console.log(reason);
  window.alert('Failed to enable offline persistence');
});

export default firebase;
