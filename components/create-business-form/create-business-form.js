import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import styles from './create-business-form.module.scss';
import Autocomplete from "react-google-autocomplete";
import Image from "next/image";
import getImageDimensions from "@/utils/getImageDimensions";
import { storage } from "@/app/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Resizer from 'react-image-file-resizer';
import uploadIcon from '../../public/assets/uploadIcon.svg'
import { v4 as uuidv4 } from 'uuid';

function CreateBusinessForm({ onSubmitForm }) {
	const [address, setaddress] = useState({});
	const [photos, setPhotos] = useState([])
	const [uploadedVideoURL, setUploadedVideoURL] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [addressSelected, setAddressSelected] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [videoUploadProgress, setVideoUploadProgress] = useState(0);
	const [uploadingPhoto, setUploadingPhoto] = useState(false);
	const [uploadingVideo, setUploadingVideo] = useState(false);
	const [disableOpenCloseHours, setDisableOpenCloseHours] = useState(false);
	const {
		register,
		handleSubmit,
		getFieldState,
		getValues,
		trigger,
		setValue,
		formState: { errors },
	} = useForm({
		mode: "onChange"
	});
	const linkValidation = /^(https?:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

	const setLocation = (location) => {
		const {formatted_address} = location;
		const addressSplit = formatted_address.split(', ');
		const [ address, city, stateAndZip, country ] = addressSplit;
		const [state, zipCode] = stateAndZip.split(' ')
		const lat = location.geometry.location.lat()
		const lng = location.geometry.location.lng()
		setaddress({
			formatted_address, 
			address, 
			city, 
			state, 
			zipCode,
			country,
			lat,
			lng
		})
		setLatitude(lat)
		setLongitude(lng)
		setValue('address', address);
		setValue('zipCode', zipCode);
		setValue('city', city);
		setAddressSelected(true)
	}

	const atLeastOneDaySelected = () => {
		return getValues("daysOfOperation").length ? true : "Please tell me if this is too hard.";
	}
	
	const disableHours = () => {
		setDisableOpenCloseHours(value => !value)
	}

	const southFloridaCoordinates = {
		north: 26.986252,  // Northern latitude coordinate
		south: 25.709042,  // Southern latitude coordinate
		east: -79.942352,  // Eastern longitude coordinate
		west: -80.337954   // Western longitude coordinate
	};

	const handle_imageUpload = (photo, fileName, imageDimensions) => {
		const imagesRef = ref(storage, `images/${fileName}`);
		const uploadTask = uploadBytesResumable(imagesRef, photo);

		setUploadingPhoto(true)
		uploadTask.on('state_changed', 
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setUploadProgress(progress)
				switch (snapshot.state) {
				case 'paused':
					break;
				case 'running':
					break;
				}
			}, 
			(error) => {
				// Handle unsuccessful uploads
			}, 
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					setPhotos(values => [...values, {url, height: imageDimensions.height, width: imageDimensions.width, id: uuidv4()}])
					setUploadingPhoto(false)
					trigger(['images'])
				});

			}
		);
		
	}

	const handle_videoUpload = async (event) => {
		let video = event.target.files[0];
		const fileName = event.target.files[0].name;

		
		// Validations
		if (!video) {
			alert('Please select a video file.');
			return;
		}
		
		const allowedTypes = ['video/mp4', 'video/mov', 'video/avi'];
		if (!allowedTypes.includes(video.type)) {
			alert('Please select a valid video file (MP4, MOV, or AVI).');
			return;
		}
		
		const maxSize = 60 * 1024 * 1024; // 60MB
		if (video.size > maxSize) {
			alert('Please select a video file smaller than 60MB.');
			return;
		}

		const videosRef = ref(storage, `videos/${fileName}`);
		const uploadTask = uploadBytesResumable(videosRef, video);

		// Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		setUploadingVideo(true);
		uploadTask.on('state_changed', 
			(snapshot) => {
				
				// Observe state change events such as progress, pause, and resume
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setVideoUploadProgress(progress.toFixed(0))
				
				switch (snapshot.state) {
				case 'paused':
					
					break;
				case 'running':
					
					break;
				}
			}, 
			(error) => {
				
				// Handle unsuccessful uploads
			}, 
			() => {
				// Handle successful uploads on complete
				// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					
					setUploadedVideoURL(downloadURL)
					setUploadingVideo(false);
				});
			}
		);
		
	}


	const handle_ImageUploadChange = async (event) => {
		event.preventDefault()
		if(photos.length === 8) return;

		if (event.target.files[0]) {
			const fileName = event.target.files[0].name;
			let imageDimensions = {};

			imageDimensions = await getImageDimensions(event.target.files[0]);
			try {
				Resizer.imageFileResizer(
					event.target.files[0],
					300,
					300,
					'JPEG',
					100,
					0,
					async (uri) => {
						handle_imageUpload(uri, fileName, imageDimensions)
					},
					'blob',
					200,
					200,
				);
			} catch(err) {
				
			}
		}
	}

	const handle_PhotoDelete = (id) => {
		let items = photos.filter((item)=> {
			
			return item.id !== id;
		})
		
		setPhotos([...items])
	}

	return (
		<form className={styles.businessForm} onSubmit={handleSubmit((data) => {
			if(!address.formatted_address) return
			onSubmitForm({
				...data, 
				address: {
					...address,
					street: address.address,
					zipCode: getValues('zipCode'),
					city: getValues('city')
				},
				photos, 
				videoUrl: uploadedVideoURL})
		})}>
			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Business Name</span>
				<input 
					{...register('businessName', { required: true })}
					placeholder="Name of your business"
				/>
				<div className={styles.validationContainer}>
					{errors.businessName && <p className={styles.validationMessage}>Business name is required.</p>}
				</div>
			</label>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Business Email</span>
				<input 
					{...register('email', { required: true })}
					placeholder="support@hometeam.com"
				/>
				<div className={styles.validationContainer}>
					{errors.email && <p className={styles.validationMessage}>Business email is required.</p>}
				</div>
			</label>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Search and Select Address</span>
				<Autocomplete
					apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_APIKEY}
					autoComplete='off'
					onPlaceSelected={(place) => setLocation(place)}
					options={{
						types: ['address'],
						componentRestrictions: {
							country: 'us',
						},
						bounds: southFloridaCoordinates,
						/* Define search scope here */
					}}
					
				/>
			</label>
			<div className={styles.addressContainer}>
				<label className={styles.labelContainer}>
					<span className={styles.labelTitle}>Address</span>
					<input
					disabled={!addressSelected}
					{...register('address', { required: true })} />
					<div className={styles.validationContainer}>
						{errors.address && <p className={styles.validationMessage}>Address is required.</p>}
					</div>
				</label>

				<label className={styles.labelContainer}>
					<span className={styles.labelTitle}>City</span>
					<input
					disabled={!addressSelected}
					{...register('city', { required: true })} />
					<div className={styles.validationContainer}>
						{errors.city && <p className={styles.validationMessage}>City is required.</p>}
					</div>
				</label>

				<label className={styles.labelContainer}>
					<span className={styles.labelTitle}>State</span>
					<input 
						disabled={!addressSelected} 
						{...register('state')} 
						defaultValue='Florida'
					/>
					<div className={styles.validationContainer}>
						{errors.state && <p className={styles.validationMessage}>State is required.</p>}
					</div>
				</label>

				<label className={styles.labelContainer}>
					<span className={styles.labelTitle}>Zip Code</span>
					<input
					disabled={!addressSelected}
					{...register('zipCode', { required: true })} />
					<div className={styles.validationContainer}>
						{errors.zipCode && <p className={styles.validationMessage}>Zip Code is required.</p>}
					</div>
				</label>
				<p className={styles.helperText}>*Must select address unlock fields</p>
			</div>
			<div className={styles.validationContainer}></div>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Phone Number</span>
				<input
					id="phoneNumber"
					className="input-single"
					placeholder="What is your Business Number"
					type="tel"
					{...register('phoneNumber',
					{ 
						required: true, 
						maxLength: 10,
						pattern: {
							value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
							message: 'Invalid phone number format.'
						},
					},
					)} 
					autoComplete="off"
				/>
				<div className={styles.validationContainer}>
					{errors.phoneNumber?.type === 'required' && <p className={styles.validationMessage}>Phone Number is required.</p>}
					{errors.phoneNumber?.type === 'maxLength' && <p className={styles.validationMessage}>Phone number should be less than 10 digits.</p>}
					{errors.phoneNumber?.type === 'pattern' && <p className={styles.validationMessage}>{errors.phoneNumber.message}</p>}
				</div>
			</label>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Describe your Business</span>
				<textarea
					className="input-single"
					placeholder="Tell us about your business."
					type="text"
					name="description"
					{...register('description', { required: true})} 
					autoComplete="off"
				/>
				<div className={styles.validationContainer}>
					{errors.description && <p className={styles.validationMessage}>Business Description is required.</p>}
				</div>
			</label>

			<label className={`${styles.labelContainerModifier}`}>
				<span className={styles.labelTitle}>Open 24 Hours?</span>
				<div className={styles.dayContainer}>
					<input onClick={disableHours} type="checkbox" {...register("alwaysOpen")} name="alwaysOpen"/>	
				</div>
			</label>
			<div className={styles.validationContainer}></div>
			
			<div>
				<span className={styles.labelTitle}>Hours of Operation</span>
				<div className={styles.hoursOfOpContainer}>
					<div className={styles.labelContainer}>
						<div className={styles.daysOfWeekContainer}>
							{
								DAYS_OF_WEEK.map( dayOfWeek => {
									return (
										<label className={styles.dayContainer} key={dayOfWeek.abbrev} htmlFor={dayOfWeek.day}>
											<input className={styles.checkbox} 
												id={dayOfWeek.day} 
												type="checkbox" 
												{...register("daysOfOperation", {validate: atLeastOneDaySelected})} 
												value={dayOfWeek.abbrev}
											/>	
											<span className={styles.checkmark}></span>
											{dayOfWeek.abbrev}
										</label>
									) 
								})
							}
						</div>
					</div>

					<div className={styles.timesContainer}>
						<div className={styles.timeContainer}>
							<label>
								Opens
								<input disabled={disableOpenCloseHours} type="time" {...register('openingTime', { required: !disableOpenCloseHours })}/>
							</label>
						</div>
						<div className={styles.timeContainer}>
							<label>
								Closes
								<input disabled={disableOpenCloseHours} type="time" {...register('closingTime', { required: !disableOpenCloseHours })}/>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.validationContainer}>
				{errors.closingTime && <p className={styles.validationMessage}>Closing Time is required.</p>}
				{errors.openingTime && <p className={styles.validationMessage}>Opening Time is required.</p>}
				{errors.daysOfOperation && <p className={styles.validationMessage}>Days of operation is required.</p>}
			</div>

			<label className={styles.industryContainer}>
				<span className={styles.labelTitle}>Industry</span>
				<div className={styles.categoriesContainer}>
					
					{
							businessTypes.map( type => {
								return (
									<label className={styles.categoryContainer} key={type} htmlFor={type}>
										<input className={styles.checkbox} 
											id={type} 
											type="radio" 
											value={type}
											{...register("category", {required: true})}
											/>	
										<span className={styles.checkmark}></span>
										{type}
									</label>
								)
							})
						}
				</div>
			</label>
			<div className={styles.validationContainer}>
				{errors.category && <p className={styles.validationMessage}>Business Industry is required.</p>}
			</div>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Link to Instagram</span>
				<input {...register('instagram', {
					pattern: {
						value: linkValidation,
						message: 'Must be a valid URL',
					},
				})} />
			</label>
			<div className={styles.validationContainer}>
				{errors.instagram?.type === "pattern" && <p className={styles.validationMessage}>{errors.instagram.message}</p>}
			</div>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Link to Facebook</span>
				<input {...register('facebook', {
					pattern: {
						value: linkValidation,
						message: 'Must be a valid URL',
					},
				})} />
			</label>
			<div className={styles.validationContainer}>
				{errors.facebook?.type === "pattern" && <p className={styles.validationMessage}>{errors.facebook.message}</p>}
			</div>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Link to Threads</span>
				<input {...register('threads', {
					pattern: {
						value: linkValidation,
						message: 'Must be a valid URL',
					},
				})} />
			</label>
			<div className={styles.validationContainer}>
				{errors.threads?.type === "pattern" && <p className={styles.validationMessage}>{errors.threads.message}</p>}
			</div>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Link to Twitter</span>
				<input {...register('twitter', {
					pattern: {
						value: linkValidation,
						message: 'Must be a valid URL',
					},
				})} />
			</label>
			<div className={styles.validationContainer}>
				{errors.twitter?.type === "pattern" && <p className={styles.validationMessage}>{errors.twitter.message}</p>}
			</div>

			<label className={styles.labelContainer}>
				<span className={styles.labelTitle}>Link to Website</span>
				<input {...register('website', {
					pattern: {
						value: linkValidation,
						message: 'Must be a valid URL',
					},
				})} />
			</label>
			<div className={styles.validationContainer}>
				{errors.website?.type === "pattern" && <p className={styles.validationMessage}>{errors.website.message}</p>}
			</div>

			<div>
				<span className={styles.labelTitle}>Business Photos(Upload up to 8 photos)</span>
				<div className={styles.uploadContainer}>
					<div className={styles.uploadedPhotoContainer}>
						<label className={styles.photoUploader}>
							<Image src={uploadIcon} alt="Upload" width={50} height={50}/>
							{photos.length === 0 ? <span className={styles.photoHelperText}>Upload Your Cover Photo</span>: <span>Upload Your Photos Here</span>}
							<span className={styles.helperText}>Browse</span>
							<div className={styles.placeholderText}>
								{uploadingPhoto && <p>Uploading {uploadProgress}%</p>}
							</div>
							<input
								className={styles.photoupload}
								name="photoUploader"
								type="file"
								{...register("images", {
									required: true
								})}
								onChange={handle_ImageUploadChange}
							/>
							<div className={styles.validationContainer}>
								{errors.images && <p className={styles.validationMessage}>At least one photo is required.</p>}
							</div>
						</label>
					</div>

					<div className={styles.photosContainer}>
						<p>My Photos</p>
						<div className={styles.uploaderContainer}>
							{photos.length === 0 && <p className={styles.photoHelperText}>Looks like you need to add some photos</p>}
							{photos && photos?.map((photo) => {
								return (
									<div key={photo.id} className={styles.photoContainer}>
										<Image
											src={photo.url}
											alt="business"
											width={photo.width}
											height={photo.height}
										/>
										<button
											className={styles.deleteButton}
											onClick={() => handle_PhotoDelete(photo.id)}
											type="button"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
											>
											<path
												fill="none"
												d="M0 0h24v24H0V0z"
											/>
											<path
												fill="#ff0000"
												d="M18 6l-1.41-1.41L12 10.17 7.41 5.59 6 7l4 4-4 4 1.41 1.41L12 13.83l4.59 4.59L18 18l-4-4z"
											/>
											</svg>
										</button>
									</div>
								)})
							}
						</div>
					</div>
				</div>
			</div>
			<div className={styles.validationContainer}></div>

			<span className={styles.labelTitle}>Upload a Video</span>
			<div className={styles.videoUploaderContainer}>
				<label className={styles.uploader}>
					<Image src={uploadIcon} alt="Upload" width={50} height={50}/>
					<span className="">Upload a Video</span>
					<span className={styles.helperText}>Browse</span>
					<div className={styles.placeholderText}>
						{uploadingVideo && <p>Uploading {videoUploadProgress}%</p>}
					</div>
					<input
						className={styles.photoupload}
						name="videoUploader"
						type="file" 
						onChange={handle_videoUpload}
					/>
				</label>
			</div>
			
			{uploadedVideoURL && <div>
				<video width="100%" height="auto" controls>
					<source 
						src={uploadedVideoURL} type="video/mp4" />
					<source 
						src={uploadedVideoURL} type="video/ogg" />
					Your browser does not support the video tag.
				</video>
			</div>}
			<button className={styles.submit} type="submit">Submit</button>
		</form>
	);
}

export default CreateBusinessForm;

const businessTypes = [
	'Restaurants',
	'Beauty',
	'Church',
	'Education',
	'Event Planning',
	'Financial',
	'Fitness',
	'Graphic Design',
	'Web Services',
	'Videography',
	'Photography',
	'Clothing',
	'Printing Services',
	'Car Wash',
	'Real Estate',
	'Coaching',
	'Tattoo Artist',
	'Art',
	'Barbershop',
	'Mobile Repair',
].sort();

const DAYS_OF_WEEK = [
	{
		day: 'monday',
		abbrev: 'Mon',
	},
	{
		day: 'tuesday',
		abbrev: 'Tue',
	},
	{
		day: 'wednesday',
		abbrev: 'Wed',
	},
	{
		day: 'thursday',
		abbrev: 'Thu',
	},
	{
		day: 'friday',
		abbrev: 'Fri',
	},
	{
		day: 'saturday',
		abbrev: 'Sat',
	},
	{
		day: 'sunday',
		abbrev: 'Sun',
	},
];