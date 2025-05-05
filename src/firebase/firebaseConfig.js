// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDtKkNmAWZjlX4Ofj6WmMrTesGof0DOMT4",
    authDomain: "resumeforge-96273.firebaseapp.com",
    projectId: "resumeforge-96273",
    storageBucket: "resumeforge-96273.firebasestorage.app",
    messagingSenderId: "660184332561",
    appId: "1:660184332561:web:9ee791e38c88948a2534b0",
    measurementId: "G-XSFL57ZWPC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
export default app; 

