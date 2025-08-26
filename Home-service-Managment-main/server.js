const express = require('express')
const app = express()
const port = 3000
const router = express.Router();
// Connect to database
const mongoose = require('mongoose');
const { scheduleReminderChecks } = require('./services/reminderScheduler');

mongoose.connect('mongodb://localhost:27017/home-service-managment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected to database");
  
  // Start the reminder scheduler after database connection
  scheduleReminderChecks();
  console.log("Email reminder scheduler started");
})

//Middlewares
app.use(express.json());
app.use('/user', require('./routes/User'));
app.use('/service', require('./routes/Service'));
app.use('/request', require('./routes/Request'));



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})