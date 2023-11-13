'use client'
import styles from './createBusiness.module.scss'
import CreateBusinessForm from '@/components/create-business-form/create-business-form';
import { GeoPoint } from 'firebase/firestore';
import { useUserContext } from '@/context/userContext'; 
import firebaseService from '@/services/firebase-service';

export default function BusinessForm() {
	const {user} = useUserContext();
	const firebaseAPI = new firebaseService();

	const onSubmitForm = async (data) => {
		console.log(data);
		const business = {
			name: data.businessName,
			badges:[],
			cover_photo: data.photos[0],
			category: data.category.toLowerCase(),
			photos: data.photos,
			opening_time: data.openingTime,
			closing_time: data.closingTime,
			openTwentyFourHours: data.alwaysOpen,
			daysOpen: data.daysOfOperation,
			coordinates: new GeoPoint(data.address.lat, data.address.lng),
			approved: false,
			description: data.description,
			formatted_address: data.address.formatted_address,
			address: data.address,
			city: data.city,
			state: data.state || 'Florida',
			email: data.email,
			phone_number: data.phoneNumber,
			likes: [],
			upvotes: [],
			downvotes: [],
			videoUrl: data.videoUrl,
			links: [
				{
					type: 'twitter',
					url: data.twitter || null
				},
				{
					type: 'facebook',
					url: data.facebook || null
				},
				{
					type: 'instagram',
					url: data.instagram || null
				},
				{
					type: 'website',
					url: data.website || null
				},
			],
			user: {
				uid: user.uid,
				displayName: user.displayName,
				photoURL: user.photoURL,
			},
		}
		console.log(business);

		const response = await firebaseAPI.addData('businesses', business)

		if(response.result) {
			console.log('successfully uploaded business');
		}

		if (response.error) {
			console.log(response.error);
		}
	}

	

	return (
		<main className={styles.createBusiness}>
			<h1>Create Business</h1>
			<CreateBusinessForm onSubmitForm={onSubmitForm}/>
		</main>
	)
}

