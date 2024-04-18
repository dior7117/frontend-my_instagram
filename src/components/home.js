import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import Post from "./Post";
import Menu from "./Menu"
import Logo from "./users_images/insta_logo.png"

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribePosts = onSnapshot(
      collection(firestore, "Posts"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
      }
    );

    const usersQuery = query(
      collection(firestore, "users"),
      orderBy("createdAt"),
      limit(10)
    );

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });

    return () => {
      unsubscribePosts();
      unsubscribeUsers();
    };
  }, []);

  return (
    <>
      <div className="d-flex w-100 h-100">
        <div className='col-md-3'>
          <Menu logo={Logo} />
        </div>
        <div className="col-md-8 d-flex justify-content-center h-100">
          <div className="col-md-6 scroll">
            {posts.map((post) => (
              <Post key={post.id} post={post} currentUserID={currentUser.uid} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;