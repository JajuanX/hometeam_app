'use client'

import React, { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import SimpleReactValidator from 'simple-react-validator';
import FacebookLogo from '../../public/assets/facebookLogo.png';
import GoogleLogo from '../../public/assets/googleLogo.png';
import { useUserContext } from '@/context/userContext'; 
import styles from './Login.module.scss';

export default function Login() {
	const {user, logInWithGoogle} = useUserContext();
	const router = useRouter();
	const isFirstRender = useRef(true);
	const validator = useRef(new SimpleReactValidator());

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false // toggle flag after first render/mounting
			return;
		}
		if (user) {
			router.push('/')
		}
	}, [user, router]);
	


	// const logInWithFacebook = () => {
	// 	signInWithFacebook()
	// 		.then(() => {
	// 			router.push('/user')
	// 		})
	// 		.catch(error => {
	// 			if (error) toast.error('Login Failed');
	// 		})
	// }

	// const signInWithUserAndPassword = (e) => {
	// 	e.preventDefault();
	// 	if (!validator.current.allValid()) {
	// 		validator.current.showMessages();
	// 		return;
	// 	}
	// 	signIn();
	// }

	return (
		<div className={styles.loginPage}>
			<Toaster 
				position='top-center'
			/>
			{/* <EmailPasswordLogIn 
				email={this.state.email} 
				password={this.state.password}
				handleChange={this.handleChange} 
				submit={this.signIn}
				/> */}
			{/* <form className={styles.signUpForm} onSubmit={(e) => signInWithUserAndPassword(e)}>
				<div className={styles.inputsContainers}>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="email">
								Email
						</label>
						<input className='input-single'
							placeholder="IE: john.doe@gmail.com"
							type="email"
							name="email"
							value={userEmail}
							onChange={(e) => setUserEmail(e.target.value)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('email')}
						/>
						{validator.current.message(
							'email',
							userEmail,
							'required|email'
						)}
					</div>
					<div className={styles.inputContainer}>
						<label className="business-label" htmlFor="password">
								Password
						</label>
						<input className='input-single'
							placeholder="Enter a Password"
							type="password"
							name="password"
							value={userPassword}
							onChange={(e) => setUserPassword(e.target.value)}
							autoComplete="off"
							onBlur={() => validator.current.showMessageFor('password')}
						/>
						{validator.current.message(
							'password',
							userPassword,
							['required', {max: 20}, {min: 6}]
						)}
					</div>
				</div>
				<button type='submit'>Log In</button>
			</form> */}
			<div className={styles.footer}>
				<div className={styles.subText}>or connect with</div>
				<div className={styles.buttonContainer}>
					<button type='button' className={styles.googleLoginButton}
						onClick={logInWithGoogle} >
						<div className="">
							<Image width={20}
								height={20} 
								src={GoogleLogo} 
								alt="google" />
						</div>
						<p className={styles.buttonText}>
								Google
						</p>
					</button>
					{/* <button type='button' className={styles.faceBookLoginButton}
						onClick={logInWithFacebook} >
						<div className="flex shrink-0 mx-2">
							<Image width={20}
								height={20} 
								src={FacebookLogo} 
								alt="google" />
						</div>
						<p className={styles.buttonText}>
								Facebook
						</p>
					</button> */}
				</div>

			</div>
			<button type='button' onClick={() => router.push('/signup')}>
				<div className={styles.subText}>Already a Member?</div>
			</button>
		</div>
	)
}