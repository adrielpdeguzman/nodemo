const _ = require('lodash');
const app = require('express')();
const Mongo = require('mongodb');

/**
 * Set heroku/local "env" variables
 */
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/nodemo';
const PORT = process.env.PORT || '3000';

app.use(require('body-parser').json());

Mongo.MongoClient.connect(MONGO_URI, (err, db) => {
  if (err) throw err;

  console.log('Successfully connected to MongoDB!');

  /**
   * Setup /api/contacts routes
   */
  app.route('/api/contacts')
    .get((req, res) => {
      db.collection('contacts').find({}).toArray((err, docs) => {
        if (err) throw err;

        res.json(docs);
      })
    })

    .post((req, res) => {
      const contact = _.pick(req.body, ['first_name', 'last_name', 'address', 'email_address', 'contact_number']);
      db.collection('contacts').insert(contact, (err, doc) => {
        if (err) throw err;

        res.status(201).json(doc);
      })
    });

  /**
   * Setup /api/contacts/:id routes
   */

  app.route('/api/contacts/:id')
    .get((req, res) => {
      db.collection('contacts').findOne(Mongo.ObjectId(req.params.id), (err, doc) => {
        if (err) throw err;

        res.json(doc);
      });
    })

    .put((req, res) => {
      const contact = _.pick(req.body, ['first_name', 'last_name', 'address', 'email_address', 'contact_number']);
      db.collection('contacts').updateOne({ _id: Mongo.ObjectId(req.params.id) }, { $set: contact }, (err, doc) => {
        if (err) throw err;

        res.json(doc);
      });
    })

    .delete((req, res) => {
      db.collection('contacts').removeOne({ _id: Mongo.ObjectId(req.params.id) }, (err, doc) => {
        if (err) throw err;

        res.status(204).json(doc);
      })
    });
});

/**
 * Error 404 middleware
 */
/*app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});*/

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`Server started at ${PORT}`);
});
