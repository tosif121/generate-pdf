const express = require('express');
const pdf = require('html-pdf');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/generate-pdf', (req, res) => {
  const { htmlContent } = req.body;

  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  const options = {
    format: 'A4',
    border: {
      top: '1cm',
      right: '1cm',
      bottom: '1cm',
      left: '1cm',
    },
  };

  pdf.create(htmlContent, options).toBuffer((err, buffer) => {
    if (err) {
      console.error('Error generating PDF:', err);
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


