const express = require('express');
   const pdf = require('html-pdf');
   const cors = require('cors');
   const path = require('path');
   const app = express();
   const PORT = 5000;

   app.use(cors());
   app.use(express.json({ limit: '10mb' }));

   // Set PhantomJS path explicitly
   const phantomJsPath = path.join(__dirname, 'node_modules', 'phantomjs-prebuilt', 'lib', 'phantom', 'bin', 'phantomjs.exe');

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
       phantomPath: phantomJsPath
     };

     pdf.create(htmlContent, options).toBuffer((err, buffer) => {
       if (err) {
         console.error('Error generating PDF:', err);
         return res.status(500).json({ error: 'Failed to generate PDF', details: err.message, stack: err.stack });
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
     console.log('PhantomJS path:', phantomJsPath);
   });