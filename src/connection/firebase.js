import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_KKwWRKWpBkSgw05_VvwGhB3IX2L65NQ",
  authDomain: "insta-6a9ee.firebaseapp.com",
  projectId: "insta-6a9ee",
  storageBucket: "insta-6a9ee.appspot.com",
  messagingSenderId: "296914379570",
  appId: "1:296914379570:web:849d5bf632d88f20abed2b",
  measurementId: "G-4BMJYNDEWJ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };