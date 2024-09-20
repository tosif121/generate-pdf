const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
  const { htmlContent } = req.body;

  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm',
      },
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
