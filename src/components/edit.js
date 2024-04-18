import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  reauthenticateWithCredential,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import Logo from "./users_images/insta_logo.png";
import { getAuth, EmailAuthProvider } from "firebase/auth";

const EditProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState(currentUser.email || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [gender, setGender] = useState(currentUser.gender);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      
      if (email !== currentUser.email) {
        await updateEmail(auth.currentUser, email);
        await sendEmailVerification(auth.currentUser);
        console.log("Email verification sent.");
      }

      if (password !== "") {
        try {
        
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
          );
          await reauthenticateWithCredential(auth.currentUser, credential);
          await updatePassword(auth.currentUser, password);
          console.log("Password updated successfully.");
        } catch (reauthError) {
          setError("Error during reauthentication. Please check your current password.");
          return; 
        }
      }

      const userDocRef = doc(db, "users", currentUser.displayName);
      await updateDoc(userDocRef, { gender: gender || "" });

      navigate(`/profile/${currentUser.displayName}`);
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setError("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="d-flex w-100 h-100">
      <div className="col-md-3">
        <Menu logo={Logo} />
      </div>
      <div className="col-md-10 d-flex justify-content-center h-100 py-5">
        <div className="row col-md-6 card p-5 mt-5">
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                disabled
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Old Password
              </label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter new password"
                disabled={currentPassword == ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                className="form-select"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success float-end">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
