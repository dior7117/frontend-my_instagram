import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./AuthContext";
import { PostContextProvider } from "./PostContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Home from "./components/home";
import SignUp from "./components/signin";
import Login from "./components/login";
import EditProfile from "./components/edit";
import Profile from "./components/profile";
import Create from "./components/create";
import Search from "./components/search";

const App = () => {
  return (
    <AuthContextProvider>
      <PostContextProvider>
        <React.StrictMode>
          <Router>
            <Routes>
              <Route path="/">
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/profile/:displayName" element={<CurrentUserWrapper><Profile /></CurrentUserWrapper>} />
                <Route path="/search" element={<CurrentUserWrapper><Search /></CurrentUserWrapper>} />
                <Route index element={<CurrentUserWrapper><Home /></CurrentUserWrapper>} />
                <Route path="/profile/edit" element={<CurrentUserWrapper><EditProfile /></CurrentUserWrapper>} />
                <Route path="/create" element={<CurrentUserWrapper><Create /></CurrentUserWrapper>} />
              </Route>
            </Routes>
          </Router>
        </React.StrictMode>
      </PostContextProvider>
    </AuthContextProvider>
  );
};

const CurrentUserWrapper = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? children : <Navigate to="/login" />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);