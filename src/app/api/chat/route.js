//import connectDb from '../../../lib/connectDb';
//import Pool from '../../../models/Pool';
import {MongoClient} from "mongodb";

//const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://admin:pass@cluster0.kgwht1l.mongodb.net/?appName=Cluster0";
//let clientPromise = client.connect();

export async function POST(req) {
    try {
        //await connectDb();
        const client = new MongoClient(uri);
        const dbName = 'tudublincarpool';
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('feedback');

        const data = await req.json();
        const { user, driverName, rating, comment } = data;

        if (!user || !driverName || !comment || !rating) {
            return new Response(JSON.stringify({ data: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        //const newPool = await Pool.create({
        //    username,
        //    driver,
        //    message,
        //});



        //return new Response(JSON.stringify({ data: 'pool created successfully', pool: newPool }), {
        //    status: 201,
        //    headers: { 'Content-Type': 'application/json' },
        //});

        const result = await collection.insertOne({
            user,
            driverName,
            rating: Number(rating),
            comment,
        });

        return new Response(
            JSON.stringify({ message: "Review submitted", id: result.insertedId }),
            {
                status: 201,
                headers: {"Content-Type": "application/json"},
            }
        );
    } catch (err) {
        console.error('Error submitting review:', err);
        return new Response(
            JSON.stringify({error: "Failed", message: err.message}),
        {
            status: 500,
            headers: {"Content-Type": "application/json"},
        }
        );
    }
}