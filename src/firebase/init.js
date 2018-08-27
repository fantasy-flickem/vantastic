import firebase from 'firebase/app'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBE64uWWfeVI2NGszAv9h6_wIeErZQ0YkI',
  authDomain: 'flickem-vantastic.firebaseapp.com',
  databaseURL: 'https://flickem-vantastic.firebaseio.com',
  projectId: 'flickem-vantastic',
  storageBucket: 'flickem-vantastic.appspot.com',
  messagingSenderId: '165044628118'
}
const firebaseApp = firebase.initializeApp(config)
firebaseApp.firestore().settings({timestampsInSnapshots: true})

export default firebaseApp.firestore()
