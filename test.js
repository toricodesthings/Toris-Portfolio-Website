// test.js
import handler from './api/shepartiststat.js';

const req = {}; // Dummy request object

const res = {
  status: (code) => ({
    json: (data) => {
      console.log(`Response status: ${code}`);
      console.log('Response data:', data);
    },
  }),
};

handler(req, res)
  .then(() => console.log('Function executed successfully'))
  .catch((error) => console.error('Error executing function:', error));
