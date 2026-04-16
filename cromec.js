import { ChromaClient } from "chromadb";

async function checkData() {
    const client = new ChromaClient({ path: "http://localhost:8000" });

    // Apni collection ka naam wahi rakhein jo save karte waqt tha
    const collection = await client.getCollection({ name: "my-pdf-collection" });

    // Sirf pehle 5 records mangte hain dekhne ke liye
    const results = await collection.peek({ limit: 5 });

    console.log("--- DATABASE MEIN YE DATA HAI ---");
    console.log("IDs:", results.ids);
    console.log("Pehla Chunk Text:", results.documents[0]);
    console.log("Total Records:", results.ids.length);
}

checkData();