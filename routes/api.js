/*
*
*
* Complete the API routing below
*
* */

'use strict';
const { ObjectId } = require('mongodb');

module.exports = function (app, db) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await db.collection('books').find({}).toArray();
        // Proses tiap buku untuk menambahkan commentcount
        const result = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: Array.isArray(book.comments) ? book.comments.length : 0
        }));
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: 'could not retrieve books' });
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }
      try {
        const newBook = {
          title: title,
          comments: [],
          commentcount: 0 // Inisialisasi commentcount
        };
        const result = await db.collection('books').insertOne(newBook);
        res.json({
          _id: result.insertedId,
          title: title
        });
      } catch (err) {
        res.status(500).json({ error: 'could not create book' });
      }
    })
    
    .delete(async (req, res) => {
      // Ini rute buat ngehapus SEMUA buku
      try {
        await db.collection('books').deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.send('could not delete');
      }
    });


  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookId = req.params.id;
      if (!ObjectId.isValid(bookId)) {
        return res.send('no book exists');
      }
      try {
        const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });
        if (!book) {
          return res.send('no book exists');
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments || []
        });
      } catch (err) {
        res.status(500).json({ error: 'could not retrieve book' });
      }
    })
    
    .post(async (req, res) => {
      let bookId = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send('missing required field comment');
      }
      if (!ObjectId.isValid(bookId)) {
        return res.send('no book exists');
      }

      try {
        const updateResult = await db.collection('books').findOneAndUpdate(
          { _id: new ObjectId(bookId) },
          { 
            $push: { comments: comment },
            $inc: { commentcount: 1 } // Tambah commentcount
          },
          { returnDocument: 'after' }
        );

        if (!updateResult.value) {
          return res.send('no book exists');
        }
        res.json(updateResult.value);

      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .delete(async (req, res) => {
      let bookId = req.params.id;
      if (!ObjectId.isValid(bookId)) {
        return res.send('no book exists');
      }
      try {
        const deleteResult = await db.collection('books').deleteOne({ _id: new ObjectId(bookId) });
        if (deleteResult.deletedCount === 0) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
  
};
