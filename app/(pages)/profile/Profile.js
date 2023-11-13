'use client'

import React, {useRef, useEffect} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './profile.module.scss';
import { useUserContext } from '@/context/userContext'; 
import Link from 'next/link';

export default function UserProfile() {
	const {user, signUserOut} = useUserContext();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push('/')
		}
	}, [user, router]);

	return (
		<main className={styles.profilePage}>
			<section className={styles.userProfile}>
				<div className={styles.userInfoContainer}>
					<label className={styles.uploadContainer}>
						<input name="photoURL"
							placeholder="Photo"
							type="file"
							onChange={(e) => handleUploadChange(e)}
							autoComplete="off"
							title="" />
						{ user?.photoURL ?
							<Image src={user?.photoURL && user?.photoURL} height={100} width={100} alt="User" /> : 
							<div className={styles.profilePicPlaceholder}><span>Upload Photo</span></div>
						}
					</label>
					<div className={styles.userDetailsContainer}>
						<p className={styles.userName}>{user?.displayName}</p>
						{user?.business?.name && <div className={styles.userInfo}>{user.business.name}</div>}
						<p className={styles.userInfo}>{user?.isOwner ? 'Business Owner': 'Local Enthusiast'}</p>
					</div>
				</div>
				<div className={styles.buttonContainer}>
					<button className={styles.signOutButton} onClick={signUserOut} type="button">Sign Out</button> 
				</div>
			</section>
			<section className={styles.contentContainer}>
				<h1>User Settings</h1>
				<div className={styles.settingsContainer}>
					{user?.business?.id ? <Link className={styles.linkTag} href={`/businesses/${user.business.id}/edit`}>Edit Business</Link> : <Link className={styles.linkTag} href='/business/create'>Create Business</Link>}
				</div>
			</section>
		</main>
	)
}
