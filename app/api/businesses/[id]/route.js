import getDocument from "@/utils/getDocument";
import { NextResponse } from "next/server";

// TEST #1 http://localhost:3000/api/test/1000
// TEST #2 http://localhost:3000/api/test/4?name=jajuan
export async function GET(request, {params}) {
	const {id} = params;
	try {
		const doc = await getDocument('businesses', id);
		if(doc.result){ 
			const business = doc.result
			const businessDetails = {
				...business,
				photos: [business.featurePhoto1, business.featurePhoto2, business.featurePhoto1]
			} 
			return NextResponse.json(businessDetails)
		} else {
			return NextResponse.json({error: 'document not found'})
		}


	} catch (error) {
		return NextResponse.json({error: 'Error fetching document'})
	}
}
