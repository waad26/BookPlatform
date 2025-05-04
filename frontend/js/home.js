document.addEventListener("DOMContentLoaded", async () => {
  let books = [];

  async function fetchBooks() {
    try {
      const response = await fetch("http://localhost:3000/api/books/books");
      books = await response.json();
      displayBooks(books);
    } catch (error) {
      console.error("Error loading books:", error);
    }
  }

  function displayBooks(bookList) {
    const container = document.getElementById("booksContainer");
    container.innerHTML = "";

    if (bookList.length === 0) {
      container.innerHTML = "<p>No books found.</p>";
      return;
    }

    bookList.forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.onclick = () => {
        window.location.href = `bookDetails.html?id=${book.id}`;
      };

      const imageSrc = book.coverImage
      ? `http://localhost:3000/uploads/${encodeURIComponent(book.coverImage)}`
      : 'img/default-book.jpg';
    
      card.innerHTML = `
        <img src="${imageSrc}" class="book-image" alt="${book.title}">
        <div class="book-details">
          <div class="book-title">${book.title}</div>
          <div class="book-author">${book.author}</div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  document.getElementById("searchInput").addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(value) || 
      book.author.toLowerCase().includes(value)
    );
    displayBooks(filtered);
  });

  fetchBooks();
});
