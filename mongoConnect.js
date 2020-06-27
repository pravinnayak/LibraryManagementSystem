const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUserPassword@cluster0-sgxqj.gcp.mongodb.net/test?retryWrites=true";
const client = new MongoClient({ useNewUrlParser: true });
// MongoClient.connect
client.connect(uri, function (err, client) {
  if (err) {
    // console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
  }
  console.log('Connected...');
  // const collection = client.db("test").collection("devices");

})
