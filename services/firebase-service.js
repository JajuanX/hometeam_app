import { collection, getDocs, addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import collectIdsandDocs from "@/utils/collectIdsandDocs";

class FirebaseService {
	async addData(collectionName, data) {
		const collectionRef = collection(db, collectionName)
		let result = null;
		let error = null;
	
		try {
			result = await addDoc(collectionRef, data);
		} catch (e) {
			error = {message: `Could not add data to ${collectionName} collection`, error: e};
		}
	
		return { result, error };
	}
	
	async updateData(collectionName, data) {
		let result = null;
		let error = null;
	
		try {
			result = await setDoc(doc(db, collectionName), data, {
				merge: true,
			});
		} catch (e) {
			error = {message: `Could not add data to ${collection} collection`, error: e};
		}
	
		return { result, error };
	}


	async getDocuments(collectionName) {
		const docRef = collection(db, collectionName);
		let result = null;
		let error = null;

		try {
			const response = await getDocs(docRef);
			result = response.docs.map(collectIdsandDocs);
		} catch (e) {
			error = {message: `Could not get documents from ${collectionName} collection`};
		}

		return { result, error };
	}

	async getDocument(collectionName, id) {
		const docRef = doc(db, collectionName, id);
		let result = null;
		let error = null;
	
		try {
			const document = await getDoc(docRef);
			console.log(document.data());
			result = document.data();
		} catch (e) {
			error = {
				display: `Could not get data from ${collectionName} collection at id:${id}`,
				message: e,
			};
		}
	
		return { result, error };
	}

}

export default FirebaseService;