import {MongoClient} from 'mongodb';

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

if (!url) {
    throw new Error('MONGODB_URI environment variable is not set');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    if(!global.mongoClient) global._mongoClient = new MongoClient(url);
    client = global._mongoClient
} else {
    client = new MongoClient(url);
}

clientPromise = client.connect();

export default clientPromise;