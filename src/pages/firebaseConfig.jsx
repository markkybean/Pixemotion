// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2_jhfBEiiRwNyVg7LVBgPZzeDLhVYul8",
  authDomain: "pixemotion-1604f.firebaseapp.com",
  projectId: "pixemotion-1604f",
  storageBucket: "pixemotion-1604f.appspot.com",
  messagingSenderId: "1037846805924",
  appId: "1:1037846805924:web:1f7de97aadb2e119c59531"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// export { storage };

export default app;