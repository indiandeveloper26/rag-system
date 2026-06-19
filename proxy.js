import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export function proxy(request) {


    const token =
        request.cookies.get("token")?.value;



    const pathname = request.nextUrl.pathname;



    // public routes
    const publicRoutes = [
        "/login",
        "/register",

    ];



    if (publicRoutes.includes(pathname)) {

        return NextResponse.next();

    }



    // token nahi hai
    if (!token) {


        return NextResponse.redirect(
            new URL("/login", request.url)
        );


    }



    try {


        // JWT verify

        jwt.verify(
            token,
            process.env.JWT_SECRET
        );



        // valid user
        return NextResponse.next();



    }
    catch (error) {


        // invalid token

        const response =
            NextResponse.redirect(
                new URL("/login", request.url)
            );


        // old cookie delete

        response.cookies.delete("token");


        return response;


    }

}



export const config = {
    matcher: [
        // api aur next internal files ko chhod do
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
};