import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.textContent =
            "Welcome back, " +
            (userCredential.user.displayName || "User") +
            "! Login successful.";

        loginMessage.style.color = "#20A464";
        loginMessage.style.display = "block";
        
        setTimeout(() => {
    window.location.href = "index.html";
}, 1500);

    } catch (error) {
        loginMessage.textContent =
            "Invalid email or password. Please try again.";

        loginMessage.style.color = "red";
        loginMessage.style.display = "block";
    }
});