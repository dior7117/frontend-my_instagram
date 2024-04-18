import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const email = e.target[0].value;
      const password = e.target[1].value;
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="background-radial-gradient overflow-hidden" style={{ width: "100%", height: "100vh" }}>
        <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
          <div className="row gx-lg-5 align-items-center mb-4">
            <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
              <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
              <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

              <div className="card bg-glass">
                <div className="card-body px-4 py-5 px-md-5">
                  <div className="text-center fs-4 mb-2 fw-bold">
                    <i>
                      Instagram - Login
                    </i>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example3">Email address</label>
                      <input type="email" id="form3Example3" className="form-control" />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example4">Password</label>
                      <input type="password" id="form3Example4" className="form-control" />
                    </div>

                    <div className="form-check d-flex justify-content-start mb-4">
                      <input className="form-check-input me-2" type="checkbox" value="" id="form2Example33" checked />
                      <label className="form-check-label" htmlFor="form2Example33">
                        Remember me
                      </label>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block mb-4 w-100" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="form-outline text-center">
                      <label className="form-label">
                        Haven't registered yet? <Link to={'/register'}>Register here</Link>
                      </label>
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

            <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
              <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 95%)' }}>
                Join us and <br />
                <span className="fs-4" style={{ color: 'hsl(218, 81%, 75%)' }}>Capture, Create & Share What You Love</span>
              </h1>
              <p className="mb-4 opacity-70" style={{ color: 'hsl(218, 81%, 85%)' }}>
                Instagram makes it easy to capture, create and share what you love.
                Discover more about Instagram's features and commitment to community,
                safety and well-being.

              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;