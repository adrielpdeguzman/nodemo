const _ = require('lodash');
const app = require('express')();
const Mongo = require('mongodb');

app.use(require('body-parser').json());

Mongo.MongoClient.connect('mongodb://localhost/nodemo', (err, db) => {
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

app.listen(3000, (err) => {
  if (err) throw err;

  console.log('Server started at http://localhost:3000');
});
