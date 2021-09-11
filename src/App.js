import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './FirebaseConfig';
import { getAuth, FacebookAuthProvider, signOut, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {

  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    isLoggedIn: false,
    password: '',
    success: '',
    error: '',
  })

  const provider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

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

  const handleFbSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        const user = result.user;

        // const credential = FacebookAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        console.log("Fb user : ", user);

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log("Error fb sign in : ", errorCode, errorMessage, email, credential);
      });
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

  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          const newUser = { ...user };
          newUser.success = 'user created successfully';
          setUser(newUser);
          upateUserName(user.displayName);
        })
        .catch((error) => {
          const newUser = { ...user };
          newUser.error = error.message;
          setUser(newUser);
        });
    }

    if (!newUser && user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {

          const user = userCredential.user;
          const newUser = { ...user };
          newUser.success = 'user logged in successfully';
          setUser(newUser);
          // upateUserName(user.displayName);
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
    e.preventDefault(); //for prevent reload page.......
  }

  const handleChange = (e) => {
    let isFieldValid;

    if (e.target.name === 'name') {
      isFieldValid = e.target.value.length ? true : false;
      console.log(isFieldValid);
    }

    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
      console.log(isFieldValid);
    }

    if (e.target.name === 'password') {
      isFieldValid = e.target.value.length > 6 && /\d{1}/.test(e.target.value);
      console.log(isFieldValid);
    }

    if (isFieldValid) {
      const newUser = { ...user };
      newUser[e.target.name] = e.target.value;
      setUser(newUser);
    }

  }

  const upateUserName = (name) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: { name }, photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(() => {
      console.log("Profile Updated Successfully");
    }).catch((error) => {
      console.log(error);
    });
  }


  return (
    <div className="text-center">
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
          user.isLoggedIn ? <button onClick={handleSignOut} className="btn mt-5 mb-5 btn-primary">Google sign out</button> :
            <button onClick={handleSignIn} className="btn mt-5 mb-1 btn-primary">Google sign In</button>
        }
        <br />
        {
          <button onClick={handleFbSignIn} className="btn mt-1 mb-5 btn-primary">FaceBook sign In</button>
        }
      </div>

      <h2>Our own Authentication</h2>
      <input style={{ fontSize: '2rem' }} onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" />
      <label style={{ fontSize: '1.2rem', marginLeft: '20px', marginBottom: '30px' }} htmlFor="newUser">I am new user </label>
      <div className="col-lg-6 col-12 ps-5 pe-5 m-auto">
        <form onSubmit={handleSubmit} style={{ boxShadow: '0px 5px 7px 7px gray' }} className="border border-secondary p-3 bg-warning rounded">
          {newUser &&
            <input
              className="mt-1 text-center form-control ps-2"
              name="displayName" id="nameId"
              type="text" required
              onBlur={handleChange}
              placeholder="Your Name"
            />
          }
          <br />
          <input
            className=" text-center form-control ps-2"
            name="email" id="emailId"
            type="email" required
            onBlur={handleChange}
            placeholder="Email Address"
          /><br />
          <input
            className="text-center form-control ps-2"
            name="password" id="passwordId"
            type="password" required
            onBlur={handleChange}
            placeholder="Password"
          /><br />
          <input className="mt-1 text-center form-control w-50 m-auto btn-success" type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
        </form>

        <div className="mt-3">
          {
            user.success && <h3>{user.success}</h3>
          }
          {
            user.error && <h3>{user.error}</h3>
          }
        </div>
      </div>

    </div>
  );
}

export default App;
