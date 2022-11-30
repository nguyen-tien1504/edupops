import React, { useState } from "react";
import Logo from "../../img/Logo.png";
import Group from "../../img/Group 1.png";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../Firebase";
import { provider } from "./../../Firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
const SignUp = () => {
  const [message, setMessage] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    const emailRegex =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailRegex.test(data.email)) {
      setMessage("Invalid email");
    }
    if (data.password.length < 6) {
      setMessage("Password must be at least 6");
    }
    if (emailRegex.test(data.email) && data.password.length >= 6) {
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((res) => {
          setDoc(doc(db, "users", res.user.uid), {
            ...data,
            password: null,
            timeStamp: serverTimestamp(),
          });
          localStorage.setItem("id", res.user.uid);
          navigate("/home");
        })
        .catch((err) => {
          const errCode = err.code;
          if (errCode == "auth/email-already-in-use") {
            setMessage("Email already in use");
          }
        });
    }
  };
  const signUpWithGoogle = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider).then((res) => {
      localStorage.setItem("id", res.user.uid);
      navigate("/home");
    });
  };
  return (
    <div className="signUpContainer">
      <div className="signUpContainerMargin">
        <div className="signUpNavbarContainer">
          <div className="signUpnavbarLeftSide">
            <img src={Logo} alt="Logo" />
            <Link to={""}>Features</Link>
            <Link to={""}>Pricing</Link>
          </div>
          <div className="signUpnavbarRightSide">
            <Link to={"/"} className="signUpNavbarActive">
              Login
            </Link>
          </div>
        </div>
        <div className="mainLoginContainer">
          <div className="mainLoginLeftSide">
            <h1>
              Students, Interns <span>&</span> Experienced Professionals
            </h1>
            <img src={Group} alt="" />
          </div>
          <div className="mainSignUpRightSide">
            <form>
              <div className="loginFormHeading">
                <h2>Join Us!</h2>
                <p>
                  We're looking for amazing engineers just like you! Become a
                  part of our rockstar community and skyrocket your career!
                </p>
              </div>
              <div className="loginFormMain">
                <label>
                  Email address{" "}
                  <input
                    type="text"
                    placeholder="Your Email"
                    id="email"
                    onChange={handleInput}
                  />
                </label>
                <label>
                  Password{" "}
                  <input
                    type="password"
                    placeholder="Your Password"
                    id="password"
                    onChange={handleInput}
                  />
                  <a href="">Forgot password?</a>
                </label>
                {message && <span>{message}</span>}
                <button onClick={handleSignUp} className="loginSubmitForm">
                  Sign Up
                </button>
                <div className="loginFormSignUp">
                  <p>All ready a user? </p>
                  <Link to={"/"}>Login</Link>
                </div>
                <div className="signUpWithGoogle">
                  <button onClick={signUpWithGoogle}>
                    <img
                      src="https://img.icons8.com/color/512/google-logo.png"
                      alt=""
                    />
                    <p>Sign up with Google</p>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="loginFooterContainer">
          <div className="loginFooterLeftside">
            <img src={Logo} alt="Logo" />
            <p>
              Rapid Resume is a web appliction that accelarates the process of
              creating, designing and sharing resumes. This website is suitable
              for candidate and students who want to create an impact in their
              professional careers.
            </p>
            <p>© 2022 RapidResume. All rights reserved</p>
            <div className="loginFooterLefsideFollowUs">
              <p>Follow Us</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-twitter"
                viewBox="0 0 16 16"
              >
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-youtube"
                viewBox="0 0 16 16"
              >
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
              </svg>
            </div>
          </div>
          <div className="loginFooterCenter">
            <h4>Features</h4>
            <p>Limitless Themes</p>
            <p>Add your Video</p>
            <p>Resizable Fonts</p>
            <p>Re-order Sections</p>
            <p>Generate Sharable Links</p>
          </div>
          <div className="loginFooterRightside">
            <h4>Features</h4>
            <p>About</p>
            <p>FAQ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
