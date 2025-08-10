import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsyD_cVcBnnin4DWc9XPb6iQ6xZtX6jk4",
  authDomain: "link-ddaac.firebaseapp.com",
  projectId: "link-ddaac",
  storageBucket: "link-ddaac.appspot.com",
  messagingSenderId: "285266088509",
  appId: "1:285266088509:web:ef32b9628fea44646c1054",
  measurementId: "G-NHH8EKFPXC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
