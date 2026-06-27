export const runtime = "nodejs";
export const dynamic = "force-dynamic";


import { NextResponse } from "next/server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { Chroma } from "@langchain/community/vectorstores/chroma";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import axios from "axios";

import { PDFParse } from "pdf-parse";



export async function POST(req) {


    let parser = null;


    try {


        console.log("🚀 RAG Processing Started");


        const body = await req.json();


        const pdfUrl = body?.pdfUrl;



        if (!pdfUrl) {

            return NextResponse.json(
                {
                    success: false,
                    message: "PDF URL required"
                },
                {
                    status: 400
                }
            );

        }



        console.log("🔗 PDF URL:", pdfUrl);



        // Download PDF

        const response = await axios({

            method: "GET",

            url: pdfUrl,

            responseType: "arraybuffer",

            timeout: 30000

        });



        console.log(
            "📥 PDF Downloaded",
            response.data.length,
            "bytes"
        );




        // Parse PDF

        try {


            parser = new PDFParse({

                data: response.data

            });



            const pdfData = await parser.getText();



            console.log(
                "📄 PDF Text Length:",
                pdfData.text.length
            );



            if (!pdfData.text.trim()) {

                throw new Error(
                    "PDF has no readable text"
                );

            }



            // Documents

            const docs = [

                {

                    pageContent: pdfData.text,

                    metadata: {

                        source: pdfUrl

                    }

                }

            ];




            // Chunking

            const splitter =
                new RecursiveCharacterTextSplitter({

                    chunkSize: 500,

                    chunkOverlap: 50

                });



            const chunks =
                await splitter.splitDocuments(docs);



            console.log(
                "✂️ Chunks:",
                chunks.length
            );



            if (chunks.length === 0) {

                throw new Error(
                    "No chunks created from PDF"
                );

            }




            // Gemini Embeddings

            if (!process.env.GOOGLE_API_KEY) {

                throw new Error(
                    "GOOGLE_API_KEY missing"
                );

            }



            const embeddings =
                new GoogleGenerativeAIEmbeddings({

                    apiKey:
                        process.env.GOOGLE_API_KEY,


                    model:
                        "gemini-embedding-001"

                });




            console.log(
                "🧠 Creating embeddings..."
            );




            // Chroma Save

            await Chroma.fromDocuments(

                chunks,

                embeddings,

                {

                    collectionName: "ragpdf",

                    host: "localhost",

                    port: 8000

                }

            );



            console.log(
                "✅ Saved In Chroma"
            );



            return NextResponse.json({

                success: true,

                message: "PDF processed successfully",

                chunks: chunks.length

            });



        }
        catch (pdfError) {

            console.log(
                "📄 PDF ERROR:",
                pdfError.message
            );


            throw new Error(
                "PDF processing failed: " +
                pdfError.message
            );

        }




    }
    catch (error) {


        console.log(
            "❌ RAG ERROR:",
            error.message
        );



        return NextResponse.json({

            success: false,

            message: error.message || "Server Error"

        },
            {
                status: 500
            });


    }
    finally {


        if (parser) {

            try {

                await parser.destroy();

            }
            catch (e) {

                console.log(
                    "Parser cleanup error:",
                    e.message
                );

            }

        }


    }

}