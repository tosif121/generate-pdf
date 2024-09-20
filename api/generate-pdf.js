const pdf = require('html-pdf');

export default function handler(req, res) {
  if (req.method === 'POST') {
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

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
