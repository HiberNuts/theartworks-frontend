// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmXWv_NWe8yE9Rpz1NLdxEeBjAUFpe0wg",
  authDomain: "artworks-df471.firebaseapp.com",
  projectId: "artworks-df471",
  storageBucket: "artworks-df471.appspot.com",
  messagingSenderId: "1052701350931",
  appId: "1:1052701350931:web:38003185741c84598ff3e6",
  measurementId: "G-QZM17932PH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const analytics = getAnalytics(app);
export default storage;
