const form = document.getElementById('add-book-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await fetch('/api/books/add', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token') 
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert('Book added successfully!');
      form.reset();
    } else {
      alert(data.message || 'Failed to add book.');
    }
  } catch (error) {
    console.error(error);
    alert('Something went wrong.');
  }
});
