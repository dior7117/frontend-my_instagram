import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const Menu = (props) => {
    const { currentUser } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Error logging out:", error);

        }
    };

    return (
        <>
            <nav id="sidebar" className="w-100 col-lg-3 d-md-block sidebar shadow">
                <div className="sidebar-header">
                    <img src={props.logo} alt="Logo" />
                    <h5 className="mt-2 fw-bold">Instagram</h5>
                </div>
                <ul className="sidebar-nav fw-bold h-100">
                    <li><Link to={"/"}>Home</Link></li>
                    <li><Link to={"/search"}>Search</Link></li>
                    <li><Link to={"/create"}>Create</Link></li>
                    <li><Link to={`/profile/${currentUser.displayName}`}>Profile</Link></li>
                    <li><Link onClick={handleLogout} className="text-danger">Logout</Link></li>
                </ul>
            </nav>
        </>
    )
}

export default Menu;
