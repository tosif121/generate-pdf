const express = require('express');
const pdf = require('html-pdf');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/generate-pdf', (req, res) => {
    const { htmlContent } = req.body;

    const options = { format: 'A4' };

    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
        if (err) {
            console.error(err); // Log the error
            return res.status(500).send('Error generating PDF');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.send(buffer);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
