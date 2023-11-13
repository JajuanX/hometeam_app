'use client'
import styles from './business.module.scss'
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/Business-Icon';
import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter';
import { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import firebaseService from '@/services/firebase-service';

export default function Business({ params }) {
	const [business, setBusiness] = useState({})
	const [messageSent, setMessageSent] = useState(false)
	const [seeMore, setSeeMore] = useState(false)
	const [input, setInputs] = useState({
		contactName: '',
		email: '',
		message: '',
		phoneNumber: ''
	});
	
	useEffect(()=> {
		const firebaseAPI = new firebaseService();
		const getBusiness = async () => {
			const response = await firebaseAPI.getDocument('businesses', params.id)
			if (response.result) {
				setBusiness(response.result)
				console.log(response.result);
			}
			if (response.error) {
				setBusiness({})
			}
		}
		getBusiness()
	}, [params.id])

	const toggleSeeMore = () => {
		setSeeMore(value => !value)
	}

	const location = {
		address: '4821 sw 23rd st West Park, FL 33023',
		lat: business?.coordinates?.latitude,
		lng: business?.coordinates?.longitude,
	}

	const sendEmail = async (event) => {
		event.preventDefault();
		const firebaseAPI = new firebaseService();
		const response = await firebaseAPI.addData('mail', {
			to: business.email,
			message: {
				subject: "Hometeam Connect Message",
				html: `<div style="font-family: Arial, sans-serif;">
						<p>Hello ${business.user.displayName},</p>
						<p>You have a new message. Below are the details:</p>
						<ul>
							<li><strong>Name:</strong> ${input.contactName}</li>
							<li><strong>Email:</strong> ${input.email}</li>
							<li><strong>Phone Number:</strong> ${input.phoneNumber}</li>
							<li><strong>Message:</strong> ${input.message}</li>
						</ul>
						<p>Thank you for using Hometeam Connect!</p>
					</div>`
			},
		})
		if (response.result) {
			setMessageSent(true);
		}
		if (response.error) {
			console.log(error);
		}
			
	}

	const handleChange = (event) => {
		setInputs(value => ({...value, [event.target.name]: event.target.value}));
	}

	if (!business) {
		return (
			<h1>
				Loading
			</h1>
		)
	}

	
	return (
		<main className={styles.business}>
			<div className={styles.imageContainer}>
				{business?.cover_photo?.url && <Image src={business?.cover_photo?.url} alt='cover' width={100} height={100} />}
			</div>
			<section className={styles.businessDetails}>
				<p className={styles.businessDetailsCategory}>{business?.category && capitalizeFirstLetter(business?.category)}</p>
				<h1 className={styles.businessDetailsName}>{business?.name}</h1>
				<p className={`${styles.businessDetailsDescription} ${seeMore ? styles.hashLinkActive : ''}`}>
					{business?.description}
				</p>
				<button type='button' onClick={toggleSeeMore} className={styles.hashLink}>See More</button>
				<h2 className={styles.businessDetailsSocialMediaTitle}>Social Media</h2>
				<section className={styles.businessDetailsSocialMediaContainer}>
					{
						business?.links?.map(link => {
							return (
								<Link className={styles.socialMediaLink} key={link.type} href={link.url || 'facebook.com'}>
									<Icon icon={link.type} size="40"/>
								</Link>
							)
						})
					}
				</section>
				<h2 className={styles.businessDetailsGalleryTitle}>Gallery</h2>
				<section className={styles.businessDetailsImageGalleryContainer}>
					{
						business?.photos?.map((photo, index) => {
							return (
								<div className={styles.imageContainer} key={index}>
									<Image src={photo?.url} alt='media' width={photo?.width} height={photo?.height}/>
								</div>
							)
						})
					}
				</section>
				<h2>View on Map</h2>
				{ 
					business?.coordinates && 
					<section style={{ height: '50vh', width: '100%' }}>
						<GoogleMapReact
							bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY }}
							defaultCenter={location}
							defaultZoom={15}
						>
							<LocationPin
								lat={business?.coordinates?.latitude}
								lng={business?.coordinates?.longitude}
								icon={business?.category}
							/>
						</GoogleMapReact>
					</section> 
				}

				<section>
					<h2>Contact Us</h2>
					{ !messageSent ? 
					<>
						<form onSubmit={sendEmail}>
							<input
								autoComplete='off'
								type='text'
								value={input.contactName}
								onChange={(e) => handleChange(e)}
								name="contactName"
								placeholder="Your Name"
							/>
							<input
								autoComplete='off'
								type='email'
								value={input.email}
								onChange={(e) => handleChange(e)}
								name="email"
								placeholder="Email"
							/>
							<input
								autoComplete='off'
								type='tel'
								value={input.phoneNumber}
								onChange={(e) => handleChange(e)}
								name="phoneNumber"
								placeholder="Phone Number"
							/>
							<textarea
								rows="4" 
								cols="50"
								autoComplete='off'
								type='text'
								value={input.message}
								onChange={(e) => handleChange(e)}
								name="message"
								placeholder="Message"
							/>
							<button>Send</button>
						</form>
					</> :
					<div className={styles.messageSentContainer}>
						<p>Message sent</p>
					</div>
					}
					
				</section>
			</section>
		</main>
	)
}

function LocationPin({ icon, lat, lng }) {
	return (
		<div className='h-6'>
			<a target="_blank" 
				className="h-6"
				rel="noopener noreferrer"
				href={`https://www.google.com/maps/search/?api=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY}&query=${lat},${lng}`}>
				<Icon 
					icon={icon}
					size="40"
				/>
			</a>
		</div>
	)
}
