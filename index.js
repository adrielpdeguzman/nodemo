const app = require('express')();

app.listen(3000, (err) => {
  if (err) throw err;

  console.log('Server started at http://localhost:3000');
});
