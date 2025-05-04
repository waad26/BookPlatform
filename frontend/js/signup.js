document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    const userData = {
      name,
      username,
      email,
      password
    };
  
    try {
      const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Signup successful! Redirecting to homepage...");
        window.location.href = "../frontend/home.html"; 
      } else {
        alert("Error: " + (data.message || "Something went wrong."));
      }
    } catch (error) {
      alert("Request failed: " + error.message);
    }
  });
  