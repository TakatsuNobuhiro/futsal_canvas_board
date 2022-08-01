import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOkWhTW6pB_9ax_1vde0SFHGOCcqJVsP4",
  authDomain: "futsal-board-375be.firebaseapp.com",
  databaseURL: "https://futsal-board-375be-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "futsal-board-375be",
  storageBucket: "futsal-board-375be.appspot.com",
  messagingSenderId: "203705832898",
  appId: "1:203705832898:web:dfd19c1c84c04cfcc5f25b",
  measurementId: "G-W9ZX7PMMZN"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

