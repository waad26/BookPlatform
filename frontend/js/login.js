// login
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "home.html";
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav-buttons");
  const token = localStorage.getItem("token");
  const currentPage = window.location.pathname;

  const isLoginPage = currentPage.includes("login.html");
  const isSignupPage = currentPage.includes("signup.html");

  if (token && !isLoginPage && !isSignupPage) {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.classList.add("nav-btn");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      alert("Logged out successfully!");
      window.location.href = "login.html";
    });
    nav.appendChild(logoutBtn);
  } else if (!token) {
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Login";
    loginBtn.classList.add("nav-btn");
    loginBtn.onclick = () => window.location.href = "login.html";

    const signupBtn = document.createElement("button");
    signupBtn.textContent = "Sign Up";
    signupBtn.classList.add("nav-btn");
    signupBtn.onclick = () => window.location.href = "signup.html";

    nav.appendChild(loginBtn);
    nav.appendChild(signupBtn);
  }
});

