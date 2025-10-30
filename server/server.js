const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3005;

app.use(cors());

app.get('/api/quotes', async (req, res) => {
    try {
        const response = await fetch('https://zenquotes.io/api/quotes/');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});