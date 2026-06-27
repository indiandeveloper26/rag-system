import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(request) {

    try {

        const body = await request.json();

        console.log("LOGIN API HIT ✅");
        console.log(body);


        const token = jwt.sign(
            {
                uid: body.uid,
                email: body.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        const response = NextResponse.json({
            success: true,
            message: "Login successful"
        });


        response.cookies.set(
            "token",
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/"
            }
        );


        return response;


    }
    catch (error) {

        console.log(error);

        return NextResponse.json({
            success: false,
            message: error.message
        }, {
            status: 500
        });

    }

}