import 'dotenv/config';
import axios from 'axios';
(async () => {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello, test.' }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('status', response.status);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('error.status', error.response?.status);
    console.error('error.data', JSON.stringify(error.response?.data, null, 2));
    console.error('error.message', error.message);
  }
})();
