const config = {
	firebase: {
		apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
		databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
		messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
		measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
		private_key: '85WNtbNlY7897hUWfUmMLBbJMdohxoKF6DNgSxyM'.replace(/\\n/g, '\n'),
		client_email: 'jjjjjj2121@gmail.com'
	}
}

export default config;