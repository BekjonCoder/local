// src/firebase.ts

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsyD_cVcBnnin4DWc9XPb6iQ6xZtX6jk4",
  authDomain: "link-ddaac.firebaseapp.com",
  projectId: "link-ddaac",
  storageBucket: "link-ddaac.appspot.com",
  messagingSenderId: "285266088509",
  appId: "1:285266088509:web:ef32b9628fea44646c1054",
  measurementId: "G-NHH8EKFPXC",
};

// App faqat bir marta initialize qilinadi
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);

export { db };
