import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import config from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as geofirestore from 'geofirestore';
import 'firebase/compat/firestore';

export function initialize () {
	const firebaseApp = initializeApp(config.firebase);
	const auth = getAuth(firebaseApp);
	const firestore = getFirestore(firebaseApp)
	const storage = getStorage(firebaseApp);
	const GeoFirestore = geofirestore.initializeApp(firestore);

	// if( process.env.BASE_URL === 'http://localhost:3000') {
	// 	connectAuthEmulator(auth, 'http://localhost:9099')
	// 	connectFirestoreEmulator(firestore, 'localhost', 8080)
	// }

	return {firebaseApp, auth, firestore, storage, GeoFirestore}
}

export const {firebaseApp, auth, firestore, storage, GeoFirestore} = initialize()


export const db = getFirestore(firebaseApp);


export const getUserDocument = async (uid) => {
	if (!uid) return null;
	try {
		const userRef = doc(db, "users", uid)
		const snapshot = await getDoc(userRef);
		return snapshot.data();
		
	} catch (error) { 
		console.error('Error fetching user', error.message);

	}
} 

export const createUserProfileDocument = async (user, additionalInfo) => {
	if (!user) return
	const { displayName, email, photoURL} = user.user; 
	const userRef = doc(db, "users", user.user.uid);
	const userSnapshot = await getDoc(userRef);
	if (!userSnapshot.exists()) {
		const createdAt = new Date();
		const favorites = [];
		const invites = [];
		const userBusinesses = {};
		try {
			await setDoc(userRef, {
				displayName,
				email,
				photoURL,
				createdAt,
				favorites,
				invites,
				userBusinesses,
				...additionalInfo
			})
			// .then(() => {
			// 	db
			// 		.collection("mail")
			// 		.add({
			// 			to: email,
			// 			message: {
			// 				subject: "Welcome to the Hometeam! (Beta)",
			// 				html: "<h1>Thank you for signing up to the HomeTeam Beta program!</h1>" +
			// 		"<p>A message from our founder/creator, Juan X." +
			// 		`<br><br>Good Evening, ${displayName}!` +
			// 		"<br><br>Let me extend a warm welcome to HomeTeam, and thank you for signing up to be apart of our Beta Program." +
			// 		"<br><br>Here at Hometeam, we created HomeTeam app that provides an opportunity for Black and minority business owners to have a way to be discovered by local users without the barriers and extensive competitors that comes from other search engines such as: Yelp, Google, etc. " +
			// 		"<br><br>The objective for this beta program is to receive feedback from a small sample of local  business owners that we trust." +
			// 		"<br><br>Your feedback is imperative because  Hometeam constantly strives to improve the quality of our products and services to give an awesome experience to our consumers." +
			// 		"<br><br>Follow this link to the <a href='https://forms.gle/bPT7JJ9kv3J6dgbe6'>survey</a> and let us know if this app actually benefits you, and how can we improve further. The survey is 2 minutes or less. The deadline to complete the survey is July 9th, 2021 at 11:59pm." +
			// 		"<br><br>Thank you in advance for your valuable insights." +
			// 		"<br><br>V/R" +
			// 		"<br>Juan X</p>",
			// 			},
			// 		})
			// 		.then(() => console.log("Queued email for delivery!"));
			// })
		}

		catch (error) {
			console.error('Error creating user', error);
			
		}
	}
	
	return getUserDocument(user.user.uid)
}
