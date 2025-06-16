/*
*
*
* FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
* -----[Keep the tests in the same order!]-----
* */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let testBookId; // Variabel untuk menyimpan _id

  /*
  * ----[AFTER ALL TESTS ARE COMPLETE, UNCOMMENT FOR DELETING]----
  *
  * suiteSetup(function(){
  * return chai.request(server)
  * .delete('/api/books')
  * });
  *
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done){
        chai.request(server)
        .post('/api/books')
        .send({title: 'Faux Book'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          assert.equal(res.body.title, 'Faux Book');
          bookID = res.body._id; // Simpan _id untuk tes selanjutnya
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done){
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/invalidId123')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + bookID)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'Faux Book');
          assert.equal(res.body._id, bookID);
          assert.isArray(res.body.comments);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/' + bookID)
        .send({comment: 'test comment'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.comments);
          assert.include(res.body.comments, 'test comment');
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/' + bookID)
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/invalidId123')
        .send({comment: 'test comment'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
    });

    suite('DELETE /api/books/[id] => text', function() {

      test('Test DELETE /api/books/[id] with valid id', function(done) {
        chai.request(server)
        // INI BAGIAN YANG DIBENERIN:
        .delete('/api/books/' + bookID)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai.request(server)
        .delete('/api/books/invalidId123')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });

    });
    
    // Suite tambahan untuk DELETE semua buku
    suite('DELETE /api/books => text', function() {
        test('Test DELETE /api/books', function(done) {
            chai.request(server)
            .delete('/api/books')
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'complete delete successful');
                done();
            });
        });
    });

  });

});
