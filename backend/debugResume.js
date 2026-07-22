import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

const pdfPath = path.resolve('temp_resume.pdf');
const pdfContent = `%PDF-1.1\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 72 700 Td (Hello Resume PDF) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000067 00000 n \n0000000122 00000 n \n0000000244 00000 n \n0000000332 00000 n \ntrailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n394\n%%EOF\n`;
fs.writeFileSync(pdfPath, pdfContent, 'binary');

const form = new FormData();
form.append('resume', fs.createReadStream(pdfPath));

try {
  const result = await axios.post('http://localhost:8000/api/interview/resume', form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity
  });
  console.log('status', result.status);
  console.log('body', JSON.stringify(result.data, null, 2));
} catch (error) {
  console.error('request error', error.message);
  if (error.response) {
    console.error('response status', error.response.status);
    console.error('response data', JSON.stringify(error.response.data, null, 2));
  }
}
