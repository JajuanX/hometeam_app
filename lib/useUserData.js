'use client'
import axios from 'axios';
import q from 'q';
import { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { FieldValue, onSnapshot, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'
import getImageDimensions from '../utils/getImageDimensions'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, createUserProfileDocument, db} from '@/app/firebase';

// Custom hook to read auth record and user profile doc
function useUserData() {
	const [ user, setUser ] = useState({});
	// const [ isLoading, setIsLoading ] = useState(false);
	// const [ userFavoriteBusinesses, setUserFavoriteBusinesses] = useState([])
	const [ userHasBusinesses, setUserHasBusinesses ] = useState(false);
	const [ userBusiness, setUserBusiness ] = useState([]);
	const [ userEmail, setUserEmail ] = useState('');
	const [ userPassword, setUserPassword ] = useState('');
	const [ inviteeEmail, setInviteeEmail ] = useState('');
	const [inviteCode, setInviteCode] = useState('');
	const googleAuth = new GoogleAuthProvider();
	const router = useRouter()


	const logInWithGoogle = async () => {
		const userCred = await signInWithPopup(auth, googleAuth)
		
		if(userCred) {
			createUserProfileDocument(userCred, {})
				.then((userCred) => {
					userCred.getIdTokenResult()
					.then(response => {
						
						setUser({
							uid: userCreds.uid,
							isOwner: response?.claims?.isOwner,
							isSubscribed: response?.claims?.stripeRole,
							subscription: response?.claims?.stripeRole,
							...doc.data()
						});
						router.push('/')
					})
				})
				.catch(error => {
					setUser({})
				})
		}
	}

	useEffect(() => {
		let unsubscribe;
		onAuthStateChanged(auth, userCreds => {
			if (userCreds) {
				unsubscribe = onSnapshot(doc(db, "users", userCreds.uid), (doc) => {
					userCreds.getIdTokenResult()
						.then(response => {
							
							setUser({
								uid: userCreds.uid,
								isOwner: response?.claims?.isOwner,
								isSubscribed: response?.claims?.stripeRole,
								subscription: response?.claims?.stripeRole,
								...doc.data()
							});
						})
				});
			} else {
				setUser(null);
			}
		})

		return unsubscribe;
	}, [])

	const handle_userHasBusiness = () => {
		if (user.userBusinesses.length > 0) {
			setUserHasBusinesses(true);
			setUserBusiness(user.userBusinesses);
		}
	}


	const handleUpload = (photo, fileName) => {
		const uploadTask = storage.ref(`images/${fileName}`).put(photo);
		const updateUserRef = db.collection('users').doc(user.uid);

		uploadTask.on(
			"state_changed",
			snapshot => {
				// const progress = Math.round(
				// 	( snapshot.bytesTransferred / snapshot.totalBytes) * 100
				// )								
				// eslint-disable-next-line no-console
				
			},
			error => {
				// eslint-disable-next-line no-console
				console.error(error);
			},
			() => {
				storage
					.ref("images")
					.child(fileName)
					.getDownloadURL()
					.then(url => {
						setUser(val => ({...val, photoURL: url}));
						return url;
					})
					.then((url) => {
						updateUserRef.update({ photoURL : url}).catch(err => {
							
						})
					})
					.catch((err) => {
						
					})
			}
		)
	}

	const handleChange = (event) => {
		setUser(val => ({...val, [event.target.name]: event.target.value}));
	}

	const getInvitation = () => {
		const _deferred = q.defer();
		const errMsg = {display: 'Invited email already exists'}

		axios.get(`api/invite/${inviteeEmail}`)
			.then(response => {
				if(response.data) _deferred.reject({display: 'User already invited'});
				if(!response.data)_deferred.resolve();
			})
			.catch(err => _deferred.reject({ ...err, ...errMsg}));

		return _deferred.promise;
	}

	const addInvitation = () => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to create invitation'}

		axios.post(`api/invite/owner`, {
			sender_id: user.uid,
			sender_email: user.email,
			invitee_email: inviteeEmail
		})
			.then(response => {
				_deferred.resolve(response.data.unique_id)
			})
			.catch(err => _deferred.reject({ ...err, ...errMsg}));

		return _deferred.promise;
	}

	const sendEmail = (response) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Failed to send email'};
		const unique_id = response;
		db
			.collection("mail")
			.add({
				to: inviteeEmail,
				message: {
					subject: "You've been Invited to HomeTeam Business",
					html:	`<p>Your invitation code is: <strong>${unique_id}</strong>` +
							"<br><br>If you haven't already please <a href='https://www.thehometeam.io/login'>create an account</a> with this email to accept invite" +
							"<br><br>If you already have an account head over to your <a href='https://www.thehometeam.io/user'>My Profile</a> to accept your invite." +
							"<br><br>You will need the code above to accept this invite." +
							"<br><br>V/R" +
							"<br>Juan X</p>",
				},
			})
			.then(() => {
				_deferred.resolve('Success Email Sent');
			})
			.catch(err => _deferred.reject({ ...err, ...errMsg}));
	}

	const handle_addInvitation__sendEmail = (unique_id) => sendEmail(unique_id)

	const updateUserInviteList = () => {
		const _deferred = q.defer();
		const errMsg = {display: 'Failed to update user invite list'};

		const updateUserRef = db.doc(`users/${user.uid}`);
		updateUserRef.update({
			invites: FieldValue.arrayUnion({
				email: inviteeEmail,
				accepted: false,
			}),
		})
			.then(() => {
				_deferred.resolve()
			})
			.catch(err => {
				_deferred.reject({ ...err, ...errMsg})
			})
		return _deferred.promise;
	}

	const submitInvite = async () => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to submit invite'}

		getInvitation()
			.then(addInvitation)
			.then(handle_addInvitation__sendEmail)
			.then(updateUserInviteList)
			.catch( error => {
				_deferred.reject(Object.assign(errMsg, error));
			})	
		return _deferred.promise;

	}

	const updateInviteStatus = (_invitationCode) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to submit invite'}

		axios.post(`api/invite/accept/${_invitationCode}`)
			.then(response => {
				_deferred.resolve(response.data)
			})
			.catch((err) => {
				_deferred.reject({ ...err, ...errMsg})
			});
		return _deferred.promise;
	}

	const postCreateBusinessOwner = (email) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to Create Business owner'};

		axios.post(`https://us-central1-hometeam-891a3.cloudfunctions.net/addBusinessOwnerRole`, {
			data: {email},
		})
			.then(response => {
				if(response.data?.result?.errorInfo){
					return _deferred.reject(errMsg)
				}
				_deferred.resolve()
			})
			.catch((err) => {
				_deferred.reject({ ...err, ...errMsg})
			})
		return _deferred.promise
	}

	const createBusinessOwner = (email, invite) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to Create Business owner'};
		postCreateBusinessOwner(email)
			.then(updateInviteStatus(invite.unique_id))
			.catch((err) => {			
				// eslint-disable-next-line no-console
				console.error(err)
				_deferred.reject({ ...err, ...errMsg})
			});
		return _deferred.promise;
	}

	const getInvitateStatus = (_invitationCode) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Fail to get invite status'};
		
		axios.get(`api/invite/accept/${_invitationCode}`)
			.then(response => {
				_deferred.resolve(response.data)
			})
			.catch((err) => {
				_deferred.reject({ ...err, ...errMsg})
			})
		return _deferred.promise
	}

	const handle_getInvitationStatus___createBusinessOwner = (response) => {
		if(!response.accepted) {
			if(response.invitee_email === user.email) {
				return createBusinessOwner(user.email, response)
			}
		}
		return q.when(false);
	}
	
	const acceptInvite = async (invitationCode) => {
		const _deferred = q.defer();
		const errMsg = {display: 'Failed to accept invite'};

		getInvitateStatus(invitationCode)
			.then(handle_getInvitationStatus___createBusinessOwner)
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.error(err);
				_deferred.reject({ ...err, ...errMsg})
			})
		return _deferred.promise;
	}

	const handleUploadChange = async (event) => {
		event.preventDefault()
		const fileName = event.target.files[0].name;
		const targetName = event.target.name;	
		let imageDimensions = {};
		if (event.target.files[0]) {
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
						handleUpload(uri, fileName, targetName, imageDimensions)
					},
					'blob',
					200,
					200,
				);
			} catch(err) {
				
			}
		}
	}

	const signUserOut = () => {
		signOut(auth)
			.then(()=> {
				
			})
			.catch(error => {
				
			})
	}

	const signUp = () => {
		auth.createUserWithEmailAndPassword(userEmail, userPassword).then(userResponse => {
			createUserProfileDocument(user, {})
				.then(() => setUser({ userResponse }))
		})
	}
	const signIn = () => {
		auth.signInWithEmailAndPassword(userEmail, userPassword).then(userResponse => {
			createUserProfileDocument( user, {})
				.then(() => setUser({ userResponse }))
		})
	}
	
	return { 
		user,
		signUp,
		signIn,
		signUserOut,
		logInWithGoogle
	};
}

export default useUserData;
