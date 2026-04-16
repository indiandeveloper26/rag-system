// // import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// // import { HumanMessage } from "@langchain/core/messages";

// // // 1. Model initialize karein
// // const model = new ChatGoogleGenerativeAI({
// //   apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A", // Make sure this is valid
// //   model: "gemini-3.1-flash-lite-preview",    // Aap 'gemini-1.5-pro' bhi use kar sakte hain
// //   temperature: 0.7,
// // });

// // // 2. Message bhejein
// // async function run() {
// //   try {
// //     const response = await model.invoke([
// //       new HumanMessage("Node.js aur LangChain ke baare mein 2 line batao.")
// //     ]);
// //     console.log("AI Response:", response.content);
// //   } catch (error) {
// //     console.error("Error occur hua:", error.message);
// //   }


// // }

// // run();




// // // // // // // // import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// // // // // // // // import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// // // // // // // // async function processPDF() {
// // // // // // // //   try {
// // // // // // // //     // 1. PDF Load karein
// // // // // // // //     const loader = new PDFLoader("aapki_file.pdf", {
// // // // // // // //       splitPages: false, // Puri PDF ek saath load hogi
// // // // // // // //     });

// // // // // // // //     const docs = await loader.load();
// // // // // // // //     console.log("PDF loaded successfully.");

// // // // // // // //     // 2. Text Splitter setup karein (Chunking)
// // // // // // // //     const splitter = new RecursiveCharacterTextSplitter({
// // // // // // // //       chunkSize: 1000,     // Har chunk 1000 characters ka hoga
// // // // // // // //       chunkOverlap: 200,   // Do chunks ke beech 200 characters common honge
// // // // // // // //     });

// // // // // // // //     // 3. Chunks banayein
// // // // // // // //     const allChunks = await splitter.splitDocuments(docs);

// // // // // // // //     console.log(`Total Chunks bane: ${allChunks.length}`);

// // // // // // // //     // Pehla chunk check karne ke liye:
// // // // // // // //     console.log("Pehla Chunk content:", allChunks[0].pageContent);

// // // // // // // //     return allChunks;

// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error processing PDF:", error);
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // processPDF();





















// // // // // // import { Pinecone } from "@pinecone-database/pinecone";
// // // // // // import { PineconeStore } from "@langchain/pinecone";
// // // // // // import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// // // // // // import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// // // // // // import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// // // // // // import "dotenv/config";

// // // // // // async function setupRAG() {
// // // // // //   try {
// // // // // //     // 1. PDF Load aur Chunking (Jo humne pehle kiya tha)
// // // // // //     const loader = new PDFLoader("test.pdf");
// // // // // //     const docs = await loader.load();
// // // // // //     const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
// // // // // //     const chunks = await splitter.splitDocuments(docs);

// // // // // //     // 2. Gemini Embeddings Model setup karein
// // // // // //     const embeddings = new GoogleGenerativeAIEmbeddings({
// // // // // //       apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A",
// // // // // //       model: "gemini-embedding-001", // Gemini ka embedding model
// // // // // //     });

// // // // // //     // 3. Pinecone Client setup karein
// // // // // //     const pc = new Pinecone({
// // // // // //       apiKey: "pcsk_4QPTZW_8zk1dLbgNZCsq12af3fbUxnAScAFnouhjaLWRwaiNytoBeTve1R7cC4X1MfULQv"
// // // // // //     });
// // // // // //     const pineconeIndex = pc.Index("rag");

// // // // // //     // 4. Vectors banakar Pinecone mein save karein
// // // // // //     console.log("Vectors ban rahe hain aur Pinecone mein save ho rahe hain...");

// // // // // //     await PineconeStore.fromDocuments(chunks, embeddings, {
// // // // // //       pineconeIndex,
// // // // // //       maxConcurrency: 5, // Speed control ke liye
// // // // // //     });

// // // // // //     console.log("Success! Aapka data Pinecone mein save ho gaya hai.");

// // // // // //   } catch (error) {
// // // // // //     console.error("Error:", error);
// // // // // //   }
// // // // // // }

// // // // // // setupRAG();















// // // // // import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// // // // // import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// // // // // import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// // // // // async function generateEmbeddingsOnly() {
// // // // //   try {
// // // // //     console.log("PDF loading...");
// // // // //     const loader = new PDFLoader("test.pdf");
// // // // //     const docs = await loader.load();

// // // // //     const splitter = new RecursiveCharacterTextSplitter({
// // // // //       chunkSize: 500,
// // // // //       chunkOverlap: 50
// // // // //     });
// // // // //     const chunks = await splitter.splitDocuments(docs);
// // // // //     console.log(`${chunks.length} chunks taiyar hain.`);

// // // // //     // 1. Stable Model use karein: 'embedding-001'
// // // // //     const embeddings = new GoogleGenerativeAIEmbeddings({
// // // // //       apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A",
// // // // //       model: "gemini-embedding-001", // Yeh sabse stable hai
// // // // //     });

// // // // //     console.log("Pehle chunk ka embedding generate ho raha hai...");

// // // // //     // 2. Vector generate karein
// // // // //     const vector = await embeddings.embedQuery(chunks[0].pageContent);

// // // // //     console.log("\n--- SUCCESS! VECTOR BAN GAYA ---");
// // // // //     console.log("Dimensions:", vector.length);
// // // // //     console.log("Vector (First 5 values):", vector.slice(0, 5));
// // // // //     console.log("--------------------------------");

// // // // //   } catch (error) {
// // // // //     console.error("Naya Error:", error.message);
// // // // //   }
// // // // // }

// // // // // generateEmbeddingsOnly();





// // // // import "dotenv/config";
// // // // import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// // // // import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// // // // import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// // // // import { Chroma } from "@langchain/community/vectorstores/chroma";

// // // // // 🔥 STEP 1: Load PDF
// // // // const loader = new PDFLoader("./test.pdf");
// // // // const docs = await loader.load();

// // // // console.log("📄 PDF Loaded:", docs.length);

// // // // // 🔥 STEP 2: Chunking
// // // // const splitter = new RecursiveCharacterTextSplitter({
// // // //   chunkSize: 500,
// // // //   chunkOverlap: 50,
// // // // });

// // // // const splitDocs = await splitter.splitDocuments(docs);

// // // // console.log("✂️ Chunks:", splitDocs.length);

// // // // // 🔥 STEP 3: Gemini Embeddings
// // // // const embeddings = new GoogleGenerativeAIEmbeddings({
// // // //   apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A",
// // // //   model: "gemini-embedding-001",
// // // // });

// // // // // 🔥 STEP 4: Save to Chroma
// // // // const vectorStore = await Chroma.fromDocuments(
// // // //   splitDocs,
// // // //   embeddings,
// // // //   {
// // // //     collectionName: "pdf-data",
// // // //     host: "localhost",
// // // //     port: 8000,
// // // //   }
// // // // );

// // // // console.log("✅ Stored in Chroma DB!");












// import { Chroma } from "@langchain/community/vectorstores/chroma";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import path from "path"
// async function run() {

//   const filePath = path.join(process.cwd(), "test.pdf");
//   try {
//     // 1. PDF Load karein
//     const loader = new PDFLoader("./test.pdf");
//     const docs = await loader.load();
//     console.log("📄 PDF Loaded:", docs.length);

//     // 2. Chunks banayein
//     const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
//     const rawChunks = await splitter.splitDocuments(docs);

//     // 🔥 METADATA FIX: ChromaDB ko sirf simple strings pasand hain
//     const chunks = rawChunks.map(chunk => ({
//       ...chunk,
//       metadata: {
//         source: "test.pdf",
//         // Agar metadata mein koi object hai toh use delete kar do
//         loc: JSON.stringify(chunk.metadata.loc || {})
//       }
//     }));
//     console.log("✂️ Chunks Created:", chunks.length);

//     // 3. Embedding Model (Jo aapne pehle setup kiya tha)
//     const embeddings = new GoogleGenerativeAIEmbeddings({
//       apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A",
//       model: "gemini-embedding-001",
//     });

//     // 4. ChromaDB mein save karein
//     console.log("🚀 ChromaDB mein save ho raha hai...");
//     const vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
//       collectionName: "user",
//       url: "http://localhost:8000", // Agar local Chroma chal raha hai toh
//     });

//     console.log("✅ Success! Data save ho gaya.");

//   } catch (error) {
//     console.error("❌ Error:", error.message);
//   }
// }

// run();



















import express from "express";
import cors from "cors";
import ragrouter from "./src/routers.js";


const app = express();
app.use(cors());
app.use(express.json());

// Routes link karein
app.use("/ai", ragrouter);






const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`👉 Test API at: http://localhost:5000/api/rag/ask`);
});