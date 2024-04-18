import React, { useState, useEffect, useContext } from "react";
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    where,
    collection,
    query,
    onSnapshot,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../AuthContext";

const Post = ({ post }) => {
    const { id, imageUrl, comment, userName, likes } = post;
    const [likeCount, setLikeCount] = useState(likes);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const [showEmojis, setShowEmojis] = useState(false);
    const [unlike, setUnlike] = useState(false);
    const [showComment, setshowComment] = useState(false);
    const [user, setUser] = useState({});
    const uid = post.userId;
    const [isFollowing, setIsFollowing] = useState(false);
    const [CommentmodalVisible, setCommentModalVisible] = useState(false);

    useEffect(() => {

        setUnlike(post.likes?.includes(currentUser.uid));
        setLikeCount(likes?.length || "0")
        setshowComment(post.sentCommentUserUid?.includes(currentUser?.uid) || false);

        const userRef = doc(db, "users", uid);

        const unsubscribe = onSnapshot(userRef, (userDoc) => {
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser(userData);
                setIsFollowing(userData.followers?.includes(currentUser?.uid) || false);

                const userPostsRef = collection(db, "Posts");
                const userPostsQuery = query(userPostsRef, where("userId", "==", uid));

            }
        });

        return () => {
            unsubscribe();
        };

    }, [post.likes, currentUser.uid, db, uid, post.sentCommentUserUid]);

    const handleLikeClick = async () => {
        const postRef = doc(db, "Posts", id);

        try {
            if (unlike) {
                await updateDoc(postRef, {
                    likes: post.likes.filter((uid) => uid !== currentUser.uid),
                });
                setUnlike(false);
            } else {
                await updateDoc(postRef, {
                    like: likeCount + 1,
                    likes: arrayUnion(currentUser.uid),
                });
                setUnlike(true);
            }
        } catch (error) {
            console.error("Error updating like count:", error);
        }
    };

    const currentTime = new Date();

    const postTime = post.timestamp ? post.timestamp.toDate() : null;

    let formattedTime = "";
    if (postTime) {
        const timeDifference = currentTime - postTime;

        const seconds = Math.floor(timeDifference / 1000);

        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30;
        const year = day * 365;

        if (seconds < minute) {
            formattedTime = seconds + " second ago";
        } else if (seconds < hour) {
            const minutes = Math.floor(seconds / minute);
            formattedTime = minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
        } else if (seconds < day) {
            const hours = Math.floor(seconds / hour);
            formattedTime = hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        } else if (seconds < month) {
            const days = Math.floor(seconds / day);
            formattedTime = days + " day" + (days > 1 ? "s" : "") + " ago";
        } else if (seconds < year) {
            const months = Math.floor(seconds / month);
            formattedTime = months + " month" + (months > 1 ? "s" : "") + " ago";
        } else {
            const years = Math.floor(seconds / year);
            formattedTime = years + " year" + (years > 1 ? "s" : "") + " ago";
        }
    }

    const handlePostComment = async () => {
        const postRef = doc(db, "Posts", id);
        setShowEmojis(false);

        try {
            const commentData = {
                comment: newComment,
                displayName: currentUser.displayName,
            };

            await updateDoc(postRef, {
                comments: arrayUnion(commentData),
                sentCommentUserUid: currentUser.uid,

            });
            setComments([...comments, commentData]);

            setNewComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const handleDeleteClick = async () => {
        const postRef = doc(db, "Posts", id);

        try {
            await deleteDoc(postRef);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };



    const emoji = "🔥";

    const handleFollowClick = async () => {
        try {
            if (currentUser) {
                const followingUser = doc(db, "users", currentUser.uid);
                const userRef = doc(db, "users", uid);

                await updateDoc(userRef, {
                    followers: arrayUnion(currentUser.uid),
                });

                await updateDoc(followingUser, {
                    following: arrayUnion(uid),
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
                const followingUser = doc(db, "users", currentUser.uid);
                const userRef = doc(db, "users", uid);

                await updateDoc(userRef, {
                    followers: arrayRemove(currentUser.uid),
                });

                await updateDoc(followingUser, {
                    following: arrayRemove(uid),
                });

                setIsFollowing(false);
            } else {
                console.error("User not authenticated");
            }
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };




    return (

        <div class="container card mt-5">
            <div className="post-image" style={{ backgroundImage: `url(${imageUrl})` }}>

            </div>

            <div class="post-details">
                <div class="d-flex justify-content-between">
                    <div>
                        {unlike ?
                            <div type="button" class="text-danger" onClick={handleLikeClick}>
                                <i class="bi bi-hand-thumbs-down-fill fs-4"></i>
                            </div>
                            :
                            <div type="button" class="text-warning" onClick={handleLikeClick}>
                                <i class="bi bi-hand-thumbs-up-fill fs-4"></i>
                            </div>
                        }
                    </div>
                    <div class="text-secondary p-1">{formattedTime}</div>
                </div>

                <div class="like-comment-count">
                    <span>{likeCount} likes</span>
                    <span class="mx-3">{post.comments?.length || "0"} comments</span>
                </div>

                <div class="post-caption">
                    <strong>{userName}:</strong> {comment}
                </div>

                <div className="comment-section p-2 overflow-scroll" style={{ boxShadow: "inset 0 0 10px gray", height: "100px" }}>
                    {post?.comments?.length > 0 ? (
                        post?.comments?.map((comment, index) => (
                            <div key={index} className="mb-2" style={{ zIndex: "-1" }}>
                                <strong>{comment.displayName} :</strong> {comment.comment}
                            </div>
                        ))
                    ) : (
                        <div className="w-100 h-100 d-flex justify-content-center align-items-center text-secondary">
                            <h4>No comments</h4>
                        </div>
                    )}
                </div>

                <div class="comment-input">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Add a comment..." aria-label="Add a comment..." aria-describedby="button-addon2" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                        <button class="btn btn-outline-secondary" type="button" id="button-addon2" style={newComment == "" ? { opacity: "0.6" } : { opacity: "" }} onClick={handlePostComment}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;