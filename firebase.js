import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBmFJ17IcQcYPFQqzmmnHqK3OSod1DB27Q",
    authDomain: "ecosort-ai-ed0e4.firebaseapp.com",
    projectId: "ecosort-ai-ed0e4",
    storageBucket: "ecosort-ai-ed0e4.firebasestorage.app",
    messagingSenderId: "1017807643250",
    appId: "1:1017807643250:web:d01435482fcb2ac4c758eb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);