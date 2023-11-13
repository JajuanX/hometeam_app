import { NextResponse } from "next/server";
import getDocuments from "@/utils/getDocuments";

export async function GET(_request) {
    const businesses = await getDocuments('business')
    return NextResponse.json(businesses)
}