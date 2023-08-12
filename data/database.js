const mongodb = require('mongodb');

let db;

async function connectDB (){
   const MongoClient = new mongodb.MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1');

  const connect = await MongoClient.connect();

   db = connect.db('online-shop');
//    return;
}

function getDB(){
    if(!db){
        return;
    }

    return db;
}

module.exports = {
    connectDB: connectDB,
    getDB: getDB
}