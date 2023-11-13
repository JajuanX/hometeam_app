import { NextResponse } from "next/server";


// TEST #1 http://localhost:3000/api/test/1000
// TEST #2 http://localhost:3000/api/test/4?name=jajuan
export async function GET(request, {params}) {
    const {id} = params;
    const {searchParams} = request.nextUrl
    const businessName = searchParams.get("name")
    return NextResponse.json({message: 'hello test', params: id, name: businessName, env: process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY})
}
