
const express = require('express');
const app = express();
const port = 3000;

const authenticate = require('./middleware/auth');

app.use(express.json());

app.get('/protected', authenticate, (req, res) => {
    res.send('This is a protected route!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});