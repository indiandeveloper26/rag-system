import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const setupRAG = async (req, res) => {
    try {
        console.log("🚀 Ingestion process started...");

        // 1. PDF Load karein
        const loader = new PDFLoader("./test.pdf");
        const docs = await loader.load();
        console.log("📄 PDF Loaded successfully");

        // 2. Chunks banayein
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50
        });
        const rawChunks = await splitter.splitDocuments(docs);

        // 3. Metadata Fix (ChromaDB validation ke liye)
        const chunks = rawChunks.map(chunk => ({
            ...chunk,
            metadata: {
                source: "test.pdf",
                loc: JSON.stringify(chunk.metadata.loc || {})
            }
        }));

        // 4. Embedding Model
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A", // Ideally use process.env
            modelName: "embedding-001",
        });

        // 5. Save to Chroma
        console.log("⏳ Saving to ChromaDB...");
        await Chroma.fromDocuments(chunks, embeddings, {
            collectionName: "user",
            url: "http://localhost:8000",
        });

        // ✅ Final Response (Pura kaam hone ke baad)
        res.status(200).json({
            success: true,
            message: "Data processed and saved successfully!",
            totalChunks: chunks.length
        });

    } catch (error) {
        console.error("❌ Error detail:", error.message);
        res.status(500).json({
            success: false,
            error: "Ingestion Failed",
            details: error.message
        });
    }
};