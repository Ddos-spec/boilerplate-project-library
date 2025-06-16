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

  /*
  * ----[AFTER ALL TESTS ARE COMPLETE, UNCOMMENT FOR DELETING]----
  *
  * suiteSetup(function() {
  * // Hapus semua buku sebelum memulai tes
  * return chai.request(server)
  * .delete('/api/books')
  * });
  *
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'The Lord of the Rings' })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.equal(res.body.title, 'The Lord of the Rings');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        // Nanti kita isi tes kedua di sini
        done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        // Nanti kita isi tes ketiga di sini
        done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        // Nanti kita isi tes keempat di sini
        done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        // Nanti kita isi tes kelima di sini
        done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        // Nanti kita isi tes keenam di sini
        done();
      });
      
    });

  });

});
