import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
  collection,
  query,
  onSnapshot,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { AuthContext } from "../AuthContext";
import Menu from "./Menu";
import { auth } from "../firebase";
import Logo from "./users_images/insta_logo.png";
import Male from "./users_images/view-3d-businessman_23-2150709814.jpg";
import Female from "./users_images/view-3d-woman_23-2150709984.jpg";

const UserProfile = () => {
  const { displayName } = useParams();
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const db = getFirestore();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const userRef = doc(db, "users", displayName.toLowerCase());

    const unsubscribe = onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        setFollowersCount(userData.followers ? userData.followers.length : 0);
        setIsFollowing(
          userData.followers?.includes(currentUser?.displayName.toLowerCase()) ||
          false
        );
        setFollowingCount(userData.following ? userData.following.length : 0);

        const userPostsRef = collection(db, "Posts");
        const userPostsQuery = query(
          userPostsRef,
          where("userName", "==", displayName.toLowerCase())
        );

        const postsUnsubscribe = onSnapshot(
          userPostsQuery,
          (userPostsSnapshot) => {
            const postsData = userPostsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserPosts(postsData);
            setPostsCount(postsData.length);
          }
        );

        return () => {
          postsUnsubscribe();
        };
      }
    });

    return () => {
      unsubscribe();
    };
  }, [displayName, currentUser?.displayName, db]);

  const handleFollowClick = async () => {
    try {
      if (currentUser) {
        const followingUser = doc(db, "users", currentUser.displayName.toLowerCase());
        const userRef = doc(db, "users", displayName.toLowerCase());

        await updateDoc(userRef, {
          followers: arrayUnion(currentUser.displayName.toLowerCase()),
        });

        await updateDoc(followingUser, {
          following: arrayUnion(displayName.toLowerCase()),
        });

        setIsFollowing(true);
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollowClick = async () => {
    try {
      if (currentUser) {
        const followingUser = doc(db, "users", currentUser.displayName.toLowerCase());
        const userRef = doc(db, "users", displayName.toLowerCase());

        await updateDoc(userRef, {
          followers: arrayRemove(currentUser.displayName.toLowerCase()),
        });

        await updateDoc(followingUser, {
          following: arrayRemove(displayName.toLowerCase()),
        });

        setIsFollowing(false);
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleDeleteClick = async (postId) => {
    try {
      const postDocRef = doc(db, "Posts", postId);
      await deleteDoc(postDocRef);

      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };



  return (
    <>
      <div className="d-flex w-100 h-100">
        <div className="col-md-3">
          <Menu logo={Logo} />
        </div>
        <div className="">
          <div className="container m-5">
            <div className="row">
              <div className="col-md-3">
                <img
                  src={user.gender === "male" ? Male : Female}
                  alt="Profile Picture"
                  className="profile-picture"
                />
              </div>
              <div className="col-md-8 px-4">
                <h2 className="mb-3">{user?.name || "Username"}</h2>
                <p className="mb-4">Mail: {user.email}</p>

                <div className="mb-4">
                  <strong className="mx-3">{postsCount}</strong> posts
                  <strong className="mx-3">{followersCount}</strong> followers
                  <strong className="mx-3">{followingCount}</strong> following
                </div>

                {currentUser.displayName === user.name ? (
                  <>
                    <Link className="btn btn-primary mb-3" to={"/profile/edit"}>
                      Edit Profile
                    </Link>
                  </>
                ) : isFollowing ? (
                  <button className="btn btn-danger" onClick={handleUnfollowClick}>
                    Unfollow
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleFollowClick}>
                    Follow
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-scroll">
              <div className="row p-2 col-md-11">
                {userPosts.map((post) => (
                  <div className="col" key={post.id}>
                    <div className="post-container">
                      <img src={post.imageUrl} alt="Post" className="profile-posts" />
                      {currentUser.displayName === user.name && (
                        <span
                          className="btn btn-danger w-100"
                          onClick={() => handleDeleteClick(post.id)}
                        >
                          Delete
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;