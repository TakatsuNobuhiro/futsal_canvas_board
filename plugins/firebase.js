import { initializeApp } from "firebase/app"

const firebaseConfig = {
};

const firebaseApp = initializeApp(firebaseConfig);
export default (context, inject) => {
  inject('firebase', firebaseApp)
}
