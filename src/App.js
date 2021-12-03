import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import "./App.css";
import initializeAuthentication from "./Firebase/firebase.initialize";

initializeAuthentication();
// const googleProvider = new GoogleAuthProvider();

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const auth = getAuth();
  // const [user, setUser] = useState({});

  /* const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const profile = {
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(profile);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }; */

  /* const handleGoogleSignOut = () => {
    signOut(auth).then(() => {
      setUser({});
    });
  }; */

  const toggleLogin = (e) => {
    setIsLogin(e.target.checked);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be contain at least 6 characters.");
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Password must be contain two Uppercase letters");
      return;
    }
    isLogin ? loginUser(email, password) : registerNewUser(email, password);
  };

  const loginUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError("");
        verifyEmail();
        updateName();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const updateName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(() => {})
      .catch((error) => {
        setError(error.message);
      });
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then((result) => {
      console.log(result);
    });
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email).then(() => {});
  };

  return (
    <div className="">
      <form onSubmit={handleRegistration} className="mx-auto my-5 w-50">
        <h2 className="text-primary my-5 text-center">
          Please {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <div className="row mb-3">
            <label htmlFor="inputName" className="col-sm-2 col-form-label">
              Name
            </label>
            <div className="col-sm-10">
              <input
                onBlur={handleNameChange}
                type="name"
                className="form-control"
                id="inputName"
                required
              />
            </div>
          </div>
        )}

        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              onBlur={handleEmailChange}
              type="email"
              className="form-control"
              id="inputEmail3"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              onBlur={handlePasswordChange}
              type="password"
              className="form-control"
              id="inputPassword3"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input
                onChange={toggleLogin}
                className="form-check-input"
                type="checkbox"
                id="gridCheck1"
              />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registerd ?
              </label>
            </div>
          </div>
        </div>

        <div className="row mb-3 text-danger">{error}</div>

        <button type="submit" className="btn btn-primary">
          {isLogin ? "Login" : "Register"}
        </button>
        <br />
        <button
          onClick={handlePasswordReset}
          type="button"
          className="btn btn-link my-2"
        >
          Forgot Password ?
        </button>
      </form>
    </div>
  );
}

export default App;
