'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext'; 
import styles from './map.module.scss';

export default function Map() {
	const {user} = useUserContext();
	const router = useRouter();
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false // toggle flag after first render/mounting
			return;
		}
		if (user) {
			router.push('/')
		}
	}, [user, router]);

	return (
		<div className={styles.loginPage}>
			Map page
		</div>
	)
}