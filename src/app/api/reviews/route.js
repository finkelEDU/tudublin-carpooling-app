export async function GET(req, res){
    const {MongoClient} = require('mongodb');
    const uri = "mongodb+srv://admin:pass@cluster0.kgwht1l.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(uri);
    const dbName = 'tudublincarpool';
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('feedback');
    const findResult = await collection.find({}).toArray();
    return Response.json(findResult);
}