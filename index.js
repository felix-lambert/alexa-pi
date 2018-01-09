const express = require('express');
const bodyParser = require('body-parser');
const recastai = require('recastai').default

var build = new recastai.build('a9a139557223331345e7d917072c8ce0', 'en')

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

app.post('/getVoice', function(req, res) {
   console.log('get voice')
   console.log(req.body)
   build.dialog({ type: 'text', content: req.body.content}, { conversationId: 'CONVERSATION_ID' })
  .then(function(res) {
    res.send()
  })   
})

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
