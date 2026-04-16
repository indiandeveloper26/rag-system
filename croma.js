// // import { Chroma } from "@langchain/community/vectorstores/chroma";
// // import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
// // import { StringOutputParser } from "@langchain/core/output_parsers";
// // import { PromptTemplate } from "@langchain/core/prompts";
// // import "dotenv/config";

// // async function ragWithGemini(question) {
// //     try {
// //         // 1. Embedding Model (Vector banane ke liye - 768 Dimensions)
// //         const embeddings = new GoogleGenerativeAIEmbeddings({
// //             apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A",
// //             model: "gemini-embedding-001",
// //         });

// //         // 2. ChromaDB se connect karein (Jo aapne pehle save kiya tha)
// //         const vectorStore = await Chroma.fromExistingCollection(embeddings, {
// //             collectionName: "my-pdf-collection",
// //             url: "http://localhost:8000",
// //         });

// //         // 3. RETRIEVAL: Sawal ke hisaab se top 2 matching chunks nikaalein
// //         console.log("🔍 Database se info nikal raha hoon...");
// //         const searchResults = await vectorStore.similaritySearch(question, 2);

// //         console.log('dataseracr', searchResults)


// //         // Milte-julte text ko ek sath jodein
// //         const contextText = searchResults.map(doc => doc.pageContent).join("\n\n");

// //         // 4. Gemini LLM (Jawab dene ke liye)
// //         const model = new ChatGoogleGenerativeAI({
// //             apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A",
// //             modelName: "gemini-1.5-flash",
// //         });

// //         // 5. PROMPT: Gemini ko batana ki context use kare
// //         const template = `
// //       Aap ek helpful assistant hain. 
// //       Niche diye gaye CONTEXT ka use karke user ke SAWAL ka jawab dein.
// //       Agar context mein jawab nahi hai, toh kahein "Data available nahi hai".

// //       CONTEXT: 
// //       {context}

// //       SAWAL: 
// //       {question}

// //       JAWAB (Hinglish mein dein):`;

// //         const prompt = PromptTemplate.fromTemplate(template);

// //         // Chain banana
// //         const chain = prompt.pipe(model).pipe(new StringOutputParser());

// //         // 6. Final Result
// //         const response = await chain.invoke({
// //             context: contextText,
// //             question: question
// //         });

// //         console.log("\n--- AI KA JAWAB ---");
// //         console.log(response);

// //     } catch (error) {
// //         console.error("❌ Error aa gaya:", error.message);
// //     }
// // }

// // // Run karein
// // ragWithGemini("Suraj ki skills kya kya hain?");























// import { Chroma } from "@langchain/community/vectorstores/chroma";
// import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import "dotenv/config";

// async function rag(question) {
//     try {
//         console.log("🔍 Query process start...");

//         // 🔹 Embedding
//         const embeddings = new GoogleGenerativeAIEmbeddings({
//             apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A",
//             model: "gemini-embedding-001",
//         });

//         // 🔹 Chroma connect
//         const vectorStore = await Chroma.fromExistingCollection(embeddings, {
//             collectionName: "my-pdf-collection",
//             url: "http://localhost:8000",
//         });

//         // 🔹 Search
//         const results = await vectorStore.similaritySearch(question, 3);

//         console.log("📦 Search Results:", results);

//         if (!results || results.length === 0) {
//             console.log("❌ Koi data nahi mila!");
//             return;
//         }

//         // 🔹 Context
//         const context = results.map(doc => doc.pageContent).join("\n\n");

//         // 🔹 Gemini LLM
//         const model = new ChatGoogleGenerativeAI({
//             apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A",
//             modelName: "gemini-1.5-flash",
//         });

//         // 🔹 Prompt
//         const prompt = PromptTemplate.fromTemplate(`
// Tum ek smart AI assistant ho.

// Sirf niche diye gaye context se jawab do.

// Context:
// {context}

// Question:
// {question}

// Answer (Hinglish):
// `);

//         const chain = prompt.pipe(model).pipe(new StringOutputParser());

//         const response = await chain.invoke({
//             context,
//             question,
//         });

//         console.log("\n🤖 FINAL ANSWER:");
//         console.log(response);

//     } catch (err) {
//         console.error("❌ Error:", err);
//     }
// }

// rag("Suraj ki skills kya kya hain?");









import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Direct Key Definition
const MY_DIRECT_KEY = "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A";

async function rag(question) {
    try {
        console.log("🔍 Query process start (using direct key)...");

        // 1. Embeddings Setup
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: MY_DIRECT_KEY,
            model: "gemini-embedding-001",
        });

        // 2. Connect to Chroma
        const vectorStore = await Chroma.fromExistingCollection(embeddings, {
            collectionName: "user",
            url: "http://localhost:8000",
        });

        // 3. Search logic
        const results = await vectorStore.similaritySearch(question, 2);
        console.log("📦 Matching Chunks Found:", results.length);

        if (results.length === 0) {
            console.log("⚠️ Database mein kuch nahi mila. Kya aapne data save kiya tha?");
            return;
        }

        const contextText = results.map(d => d.pageContent).join("\n\n");

        // 4. Gemini Model Setup
        const model = new ChatGoogleGenerativeAI({
            apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A", // Make sure this is valid
            model: "gemini-3.1-flash-lite-preview",    // Aap 'gemini-1.5-pro' bhi use kar sakte hain
            temperature: 0.7,
        });

        // 5. Final Prompt
        const prompt = `You are a helpful assistant. Use the following context to answer the question.
        
        CONTEXT:
        ${contextText}
        
        QUESTION:
        ${question}
        
        ANSWER (In Hinglish):`;

        console.log("🚀 Gemini is generating response...");
        const response = await model.invoke(prompt);

        console.log("\n--- FINAL JAWAB ---");
        console.log(response.content);

    } catch (error) {
        console.error("❌ Final Error:", error.message);
        if (error.message.includes("404")) {
            console.log("💡 Tip: Agar 404 aaye toh modelName ko 'models/embedding-001' karke dekhein.");
        }
    }
}

// Call the function
rag("mera study bato mrea aducaiton kyahai ?");