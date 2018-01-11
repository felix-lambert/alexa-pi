const express = require('express');
const bodyParser = require('body-parser');

const recastai = require('recastai').default;
const exec = require('child_process').exec;
const build = new recastai.build('a9a139557223331345e7d917072c8ce0', 'en');

const { musicStyle, playMusic } = require('./controller/');

// Instantiate Recast.AI SDK

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.post('/errors', (req, res) => {
  console.log(req.body);
  res.send();
});

app.post('/musicStyle', musicStyle);
app.post('/playSong', playMusic);

app.post('/hello', (req, res) => {
  const answerArray = [
    'Hello, how are you, nice to see you back. Which song do you want to play today?',
    'Hello my friend. Tell me a song, and I will play it for you!',
  ];
  const randomAnswer = Math.floor(Math.random() * answerArray.length);
  console.log(answerArray[randomAnswer]);
  res.send();
  // exec(`/home/pi/alexa-pi/controller/speech.sh ${randomAnswer}`);
});

app.post('/goodbye', (req, res) => {
  const answerArray = [
    'See you soon, I hope you are happy about my service',
    'Goodbye, very nice talking to you',
  ];
  const randomAnswer = Math.floor(Math.random() * answerArray.length);
  console.log(answerArray[randomAnswer]);
  // exec(`/home/pi/alexa-pi/controller/speech.sh ${randomAnswer}`);
  res.send();
});

app.post('/getVoice', (req, res) => {
  console.log('get voice');
  console.log(req.body);
  build
    .dialog(
      { type: 'text', content: req.body.content },
      { conversationId: 'CONVERSATION_ID' }
    )
    .then(res => {
      res.send();
    });
});

app.post('/help', (req, res) => {
  const answerArray = [
    'Ok I will help, can you tell me what type of music you like?',
    'Please tell me a style of music you enjoy listening',
  ];
  const randomAnswer = Math.floor(Math.random() * answerArray.length);
  console.log(answerArray[randomAnswer]);
  // exec(`/home/pi/alexa-pi/controller/speech.sh ${randomAnswer}`);
  res.send();
});

app.post('/understand', (req, res) => {
  const answerArray = ['What?', "I don't understand. Can you repeat?"];
  const randomAnswer = Math.floor(Math.random() * answerArray.length);
  console.log(answerArray[randomAnswer]);
  // exec(`/home/pi/alexa-pi/controller/speech.sh ${randomAnswer}`);
  res.send();
});

app.post('joke', (req, res) => {
  const answerArray = [
    'Today a man knocked on my door and asked for a small donation towards the local swimming pool. I gave him a glass of water',
    'Feeling pretty proud of myself. The Sesame Street puzzle I bought said 3-5 years, but I finished it in 18 months.',
    `Life is all about perspective. The sinking of the Titanic was a miracle to the lobsters in the ship's kitchen.`,
  ];
  const randomAnswer = Math.floor(Math.random() * answerArray.length);
  console.log(answerArray[randomAnswer]);
  // exec(`/home/pi/alexa-pi/controller/speech.sh ${randomAnswer}`);
  res.send();
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
