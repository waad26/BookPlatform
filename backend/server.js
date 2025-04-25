
const express = require('express');
const app = express();
const port = 3000;

const authenticate = require('./middleware/auth');
const reviewRoutes = require('./features/review/reviewRoutes');

app.use(express.json());
app.use('/api/reviews', reviewRoutes);

app.get('/protected', authenticate, (req, res) => {
    res.send('This is a protected route!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});