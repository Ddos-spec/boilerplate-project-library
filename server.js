'use strict';
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
require('dotenv').config();
const apiRoutes  = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner     = require('./test-runner');
const { MongoClient } = require('mongodb');

const app = express();

// Middleware dasar
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Front-end route & testing
app.route('/').get((req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});
fccTestingRoutes(app);

// DB connection
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('personal-library');

// 🚀 Mount route API SEBELUM konek ke DB
apiRoutes(app, db);

// 404 handler
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

// Start server setelah konek DB
client.connect()
  .then(() => {
    console.log('MongoDB connected');

    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log('App listening on port ' + listener.address().port);

      // Run test kalau NODE_ENV=test
      if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(() => {
          try {
            runner.run();
          } catch (e) {
            console.log('Tests are not valid:');
            console.error(e);
          }
        }, 3500);
      }
    });
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

module.exports = app;
