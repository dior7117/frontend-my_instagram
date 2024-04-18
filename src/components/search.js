import React, { useState, useContext, useEffect } from "react";
import { db } from "../firebase";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    getDocs
} from "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import Logo from "./users_images/insta_logo.png"
import Menu from "./Menu";
import Male from "./users_images/view-3d-businessman_23-2150709814.jpg"
import Female from "./users_images/view-3d-woman_23-2150709984.jpg"

function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const { currentUser } = useContext(AuthContext);


    const performSearch = async () => {
        if (!currentUser || !searchQuery) {
            setSearchResults([]);
            setShowSearchModal(false);
            return;
        }

        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const results = [];
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            console.log(user.uid);
            if (user.id !== currentUser.id) {
                const displayNameLower = user.name.toLowerCase();
                const searchQueryLower = searchQuery.toLowerCase();

                if (displayNameLower.includes(searchQueryLower)) {
                    results.push(user);
                }
            }
        });

        setSearchResults(results);
        setShowSearchModal(true);

    };

    useEffect(() => {
        const firestore = getFirestore();

        const usersQuery = query(
            collection(firestore, "users"),
            orderBy("createdAt"),
            limit(10)
        );
        performSearch();
    }, [searchQuery, currentUser]);

    return (
        <>
            <div className="d-flex w-100 h-100">
                <div className='col-md-3'>
                    <Menu logo={Logo} />
                </div>
                <div className="container mt-5 col-md-9">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-md-6">
                            <div className="d-flex">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    id="searchInput"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={performSearch}
                                >
                                    Search
                                </button>
                            </div>

                            <div className="search-results bg-white mt-3">
                                <div className="card shadow p-3">
                                    {showSearchModal ? (
                                        <div className="search-results">
                                            <ul className="list-group">
                                                {searchResults.length > 0 ? (
                                                    searchResults.map((result) => (
                                                        <li
                                                            key={result.uid}
                                                            className="list-group-item d-flex align-items-center"
                                                        >
                                                            <Link to={`/profile/${result.name}`} className="text-dark">
                                                                <img
                                                                    src={result.gender === "male" ? Male : Female}
                                                                    alt={result.gender}
                                                                    className="rounded-circle me-3"
                                                                    style={{ width: "50px", height: "50px" }}
                                                                />

                                                                {result.name}
                                                            </Link>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <div className="w-100 p-5 text-center">
                                                        <div className="fs-4 text-secondary fw-bold">
                                                            No users found!
                                                        </div>
                                                    </div>
                                                )}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="w-100 p-5 text-center">
                                            <div className="fs-4 text-secondary fw-bold">
                                                No users found!
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Search;