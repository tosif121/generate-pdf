const pdf = require('html-pdf');
const fs = require('fs').promises;
const path = require('path');

async function generatePDF(html, options, outputPath) {
  return new Promise((resolve, reject) => {
    pdf.create(html, options).toFile(outputPath, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

async function cleanupOldFiles(directory, maxAgeHours = 24) {
  try {
    const files = await fs.readdir(directory);
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);
      const ageHours = (now - stats.mtime.getTime()) / (1000 * 60 * 60);
      if (ageHours > maxAgeHours) {
        await fs.unlink(filePath);
        console.log(`Deleted old file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
}

async function main() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Server Generated PDF</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #0066cc; }
        </style>
      </head>
      <body>
        <h1>Hello from the server!</h1>
        <p>This PDF was generated on the server using html-pdf (PhantomJS).</p>
        <p>Generation time: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `;

  const options = {
    format: 'A4',
    timeout: 30000  // 30 seconds timeout
  };

  const outputDir = path.join(__dirname, 'pdfs');
  const outputFile = path.join(outputDir, `output-${Date.now()}.pdf`);

  try {
    await fs.mkdir(outputDir, { recursive: true });
    const result = await generatePDF(html, options, outputFile);
    console.log(`PDF generated successfully: ${result.filename}`);
    await cleanupOldFiles(outputDir);
  } catch (error) {
    console.error('An error occurred during PDF generation or cleanup:', error);
  }
}

main();