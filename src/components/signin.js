import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, increment } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!gender) {
        setError("Please select your gender");
        setLoading(false);
        return;
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName: name,
      });

      const userCountDocRef = doc(db, "UserID", "count");
      const countSnap = await getDoc(userCountDocRef);
      const currentCount = countSnap.exists() ? countSnap.data().count : 0;

      await setDoc(doc(db, "users", res.user.displayName), {
        id: currentCount,
        uid: res.user.uid,
        name,
        email,
        password,
        gender,
      });

      await setDoc(userCountDocRef, { count: currentCount + 1 });
      await setDoc(doc(db, "UserName", res.user.displayName), {});
      navigate("/");
    } catch (err) {
      if (err.code === "auth/cancelled-popup-request") {
        setError("Registration cancelled. Please try again.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use. Please use a different email or log in.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <section className="background-radial-gradient overflow-hidden" style={{ width: "100%", height: "100vh" }}>
      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center mb-4">
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 95%)' }}>
              Join us and <br />
              <span className="fs-4" style={{ color: 'hsl(218, 81%, 75%)' }}>Capture, Create & Share What You Love</span>
            </h1>
            <p className="mb-4 opacity-70" style={{ color: 'hsl(218, 81%, 85%)' }}>
              Instagram is a photo and video sharing social network created by Kevin Systrom and Mike Krieger.
              It also allows you to upload them through other social networking platforms.
              In addition, users can apply digital filters to photos and videos.
              The maximum duration for videos on Instagram is 60 seconds.
              Instagram is distributed for free through the App Store and Play Market.
            </p>
          </div>

          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

            <div className="card bg-glass">
              <div className="card-body px-4 py-4 px-md-5">
                <div className="text-center fs-4 mb-2 fw-bold">
                  <i>
                  Instagram - Register
                  </i>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example1">First name</label>
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example3">Email address</label>
                    <input
                      type="email"
                      id="form3Example3"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example4">Password</label>
                    <input
                      type="password"
                      id="form3Example4"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="genderSelect">Gender</label>
                    <select
                      id="genderSelect"
                      className="form-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block mb-4 w-100" style={loading ? { opacity: "0.6", cursor: "not-allowed" } : {}}>
                    {loading ? "Loading..." : "Register"}
                  </button>

                  <div className="text-center">
                    <label className="form-label">Have you logged in before? <Link to={'/login'}>Enter again</Link></label>
                  </div>

                  {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;