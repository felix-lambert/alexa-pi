const express = require('express');
const bodyParser = require('body-parser');

const { musicStyle, playMusic } = require('./controller/');

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.post('/', (req, res) => {
  res.send({
    replies: [
      {
        type: 'text',
      },
    ],
    conversation: {
      memory: { key: 'value' },
    },
  });
});

app.post('/errors', (req, res) => {
  console.log(req.body);
  res.send();
});

app.post('/musicStyle', musicStyle);
app.post('/playSong', playMusic);

app.listen(port, () => {
  console.log('Server is running on port 5000');
});
