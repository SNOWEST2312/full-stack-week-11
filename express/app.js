import express from 'express';
const app = express();
app.listen(3000, () => console.log('listening on 3000'));

app.use(express.static('public'));

// API for comments

// instead of SQLite databases, we just simple array
const comments = ['Hello', 'Goodbye'];

app.get('./comments', (req, res) => {
  res.json(comments);
});

app.post('/comments', (req, res) => {
  // we assume the client will send a comment as a string
  comments.push(req.body.comments);
  // we send the comment back upon 
  res.json(req.body.comments);
});
