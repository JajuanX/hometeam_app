'use client'

import React from 'react'
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import styles from './navigationHeader.module.scss';
import HomeTeamLogo from '../../public/assets/homeTeamWords.svg';
import HomeTeamShield from '../../public/assets/homeIcon.svg';
import { useUserContext } from '@/context/userContext'; 
import Link from 'next/link'
import map from '../../public/assets/mapIcon.svg'

function NavigationLayout({children}) {
	const {user} = useUserContext();
	const router = useRouter();
	const pathname = usePathname()
	const isHomeActive = pathname.startsWith('/')

	return (
		<>
			<header className={styles.header}>
				<nav className={`${styles.nav} ${isHomeActive ? 'highlight' : ''}`}>
					<div className={styles.logoContainer}>
						<Image priority src={HomeTeamLogo} alt='Hometeam'/>
					</div>

				</nav>
			</header>
			{children}
			<footer className={styles.footer}>
				<nav className={styles.navigation}>
					<Link className={styles.linktag} href="/">
						<div className={styles.imageContainer}>
							<Image as="image" width={50} height={50} src={HomeTeamShield} alt="hometeam" />
						</div>
						<span className={styles.iconLabel}>HOME</span>
					</Link>
					<Link className={styles.linktag} href='/map'>
						<div className={styles.imageContainer}>
							<Image src={map} width={50} height={50} alt='profile' />
						</div>
						<span>MAP</span>
					</Link>
					<div className={styles.profilePicContainer}>
						{user?.photoURL ?
							<Link className={styles.linktag} href='/profile'>
								<div type='button' className={styles.profileImageContainer}>
									<Image height={50} width={50} className="rounded-full" src={user && user.photoURL} alt="User profile" />
								</div>
								<span>PROFILE</span>
							</Link>
							: 
							<Link className={styles.linktag} href='/login'>
								Log In
							</Link>
						}
					</div>
				</nav>
			</footer>
		</>
	)	
}

export default NavigationLayout