const { MongoClient } = require('mongodb');

const database = module.exports;

database.connect = async function connect() {
  database.client = await MongoClient.connect('mongodb://database:27017/todo', { useUnifiedTopology: true });
};
