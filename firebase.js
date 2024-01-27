// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6MlrUP73NAmQObGfJuvvBC6NpFNHwyOs",
  authDomain: "soliloquy-ef.firebaseapp.com",
  projectId: "soliloquy-ef",
  storageBucket: "soliloquy-ef.appspot.com",
  messagingSenderId: "665440839754",
  appId: "1:665440839754:web:1705bfb89d6195db1d9eb3",
  databaseURL: "https://soliloquy-ef-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export default { app, db };