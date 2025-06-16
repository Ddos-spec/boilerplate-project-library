'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');
const { MongoClient }   = require('mongodb');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- KONEKSI DATABASE & SERVER STARTUP ---

// Buat instance MongoClient baru. Gunakan process.env.DB sesuai instruksi.
const client = new MongoClient(process.env.DB);

// Fungsi utama untuk konek ke DB dan menjalankan server
async function startServer() {
  try {
    // Konek ke client MongoDB
    await client.connect();
    console.log("Successfully connected to database");
    
    // Pilih database (misal: 'personal-library')
    const db = client.db('personal-library'); 
    
    // Index page (static HTML)
    app.route('/')
      .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
      });

    //For FCC testing purposes
    fccTestingRoutes(app);

    //Routing for API - PENTING: kirim 'db' object ke routes
    apiRoutes(app, db);
    
    // Front-end routes, setelah API
    app.route('/:project/')
      .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/issue.html');
      });
        
    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });

    //Start our server and tests!
    const listener = app.listen(process.env.PORT || 3000, function () {
      console.log('Your app is listening on port ' + listener.address().port);
      if(process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
          try {
            runner.run();
          } catch(e) {
            var error = e;
              console.log('Tests are not valid:');
              console.log(error);
          }
        }, 1500);
      }
    });
    
  } catch (e) {
    console.error("Failed to connect to database:", e);
    process.exit(1);
  }
}

// Panggil fungsi utama untuk memulai segalanya
startServer();


module.exports = app; // for testing
