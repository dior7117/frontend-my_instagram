import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";
import Logo from "./users_images/insta_logo.png"
import { db } from "../firebase";

function CreatePost() {
    const { currentUser } = useContext(AuthContext);
    const [imageFile, setImageFile] = useState(null);
    const [comment, setComment] = useState("");
    const storage = getStorage();
    const firestore = getFirestore();
    const [success, setSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
        console.log(modalVisible);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccess(true);

        if (imageFile) {
            try {
                const storageRef = ref(storage, `posts/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {

                    },
                    (error) => {
                        console.error(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        await addDoc(collection(firestore, "Posts"), {
                            imageUrl: downloadURL,
                            comment: comment,
                            userId: currentUser.uid,
                            userName: currentUser.displayName,
                            like: 0,
                            timestamp: serverTimestamp(),
                        });

                        setImageFile(null);
                        setComment("");
                        navigate("/");
                    }
                );
            } catch (error) {
                console.error(error);
            }

        }
    };

    return (
        <>
            <div className="d-flex w-100 h-100">
                <div className="col-md-3">
                    <Menu logo={Logo} />
                </div>
                <div className="col-md-8 d-flex justify-content-center align-items-center h-100">
                    <div className="w-100 d-flex justify-content-center align-items-center">
                        <div className="text-center w-50 p-4">
                            <label htmlFor="file" className="btn btn-outline-danger p-0">
                                <img className="w-100 rounded-3" src="https://cdn.pixabay.com/photo/2018/11/13/22/01/instagram-3814084_1280.png" alt="" />
                            </label>
                            <form onSubmit={handleSubmit} className="mt-3">
                                <div className="form">
                                    <div className="selectFile mb-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            id="file"
                                            value={selectedFile ? selectedFile.name : ""}
                                            hidden
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            value={comment}
                                            onChange={(event) => setComment(event.target.value)}
                                            placeholder="Enter a comment"
                                            className="form-control"
                                        />
                                    </div>
                                    <button type="submit" disabled={success} className="btn btn-outline-success w-100">
                                        {success ? "Uploading..." : "Upload"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreatePost;