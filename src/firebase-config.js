const config = {
  apiKey: "AIzaSyDczK1fCD_GKItCULc_QqR_11d748irwaE",
  authDomain: "whereswaldomraffia.firebaseapp.com",
  projectId: "whereswaldomraffia",
  storageBucket: "whereswaldomraffia.appspot.com",
  messagingSenderId: "489609000513",
  appId: "1:489609000513:web:891dbd46cf49ca3bd838c0"
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}