document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  const bookInfo = document.getElementById("bookInfo");
  const reviewsList = document.getElementById("reviewsList");
  const submitBtn = document.getElementById("submitReview");

  async function fetchBookDetails() {
    try {
      const response = await fetch(`http://localhost:3000/api/books/${bookId}`);
      const book = await response.json();

      const imageSrc = book.coverImage
      ? `http://localhost:3000/uploads/${encodeURIComponent(book.coverImage)}`
      : 'img/default-book.jpg';

      bookInfo.innerHTML = `
        <img src="${imageSrc}" alt="${book.title}">
        <div class="book-details-text">
          <h2>${book.title}</h2>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>ISBN:</strong> ${book.isbn}</p>
          <p><strong>Description:</strong><br>${book.description}</p>
        </div>
      `;
    } catch (error) {
      console.error("Error loading book details:", error);
    }
  }

  async function fetchReviews() {
    try {
      const res = await fetch(`http://localhost:3000/api/review/book/${bookId}`);
      const reviews = await res.json();

      reviewsList.innerHTML = reviews.map(r => `<p>⭐ ${r.content}</p>`).join("");
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  }

  submitBtn.addEventListener("click", async () => {
    const reviewText = document.getElementById("reviewInput").value.trim();
    if (!reviewText) return alert("Please write a review.");

    try {
      await fetch(`http://localhost:3000/api/review/book/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reviewText })
      });

      document.getElementById("reviewInput").value = "";
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  });

  fetchBookDetails();
  fetchReviews();
});
