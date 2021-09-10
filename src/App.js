import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './FirebaseConfig';
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    isLoggedIn: false,
  })
  const provider = new GoogleAuthProvider();

  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user;
        const signInUser = {
          displayName: user.displayName,
          isLoggedIn: true,
          email: user.email,
          photoURL: user.photoURL
        }
        setUser(signInUser);
      }).catch(error => {
      })
  }

  const handleSignOut = (signInUser) => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        const signOutUser = {
          displayName: '',
          email: '',
          photoURL: '',
          isLoggedIn: false,
        }
        setUser(signOutUser);
      }).catch((error) => {

      })
  }

  return (
    <div className="App">
      <div>
        {
          user.isLoggedIn &&
          <div className="mt-3">
            <img style={{ width: '100px', borderRadius: '50%' }} src={user.photoURL} alt="" />
            <h3 className="mb-1 mt-1" style={{ fontStyle: 'italic' }} >Welcome, Mr. {user.displayName}</h3>
            <h4>Email : {user.email}</h4>
          </div>
        }
      </div>
      <div>
        {
          user.isLoggedIn ? <button onClick={handleSignOut} className="btn mt-5 mb-5 btn-primary">Sign out</button> :
            <button onClick={handleSignIn} className="btn mt-5 mb-5 btn-primary">Sign In</button>
        }
      </div>

    </div>
  );
}

export default App;
