document.getElementById('addBookForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = document.getElementById('addBookForm');
  const formData = new FormData(form);
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:3000/api/books/add', {
      method: 'POST',
      headers: {
        'Authorization':`Bearer ${token}` 
        // لا تضيف Content-Type، المتصفح يضبطه تلقائيًا مع FormData
      },
      body: formData
    });

    const result = await response.json();
    const message = document.getElementById('message');

    if (response.ok) {
      message.textContent = result.message;
      message.style.color = 'green';
      form.reset();
    } else {
      message.textContent = result.message || 'Failed to add book.';
      message.style.color = 'red';
    }

  } catch (error) {
    console.error('Error adding book:', error);
    document.getElementById('message').textContent = 'An error occurred.';
    document.getElementById('message').style.color = 'red';
  }
});