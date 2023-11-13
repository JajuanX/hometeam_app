import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './businessCard.module.scss';
import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter';

function BusinessCard({business, index}) {
	const router = useRouter();

	return (
		<button className={styles.businessCard}
			type='button'
			aria-label={`Navigate to business ${business.name}`}
			onClick={() => router.push(`/businesses/${business.id}`)}
			tabIndex={index}>
			<div className={styles.businessCardContainer} key={business.id}>
				<div className={styles.imageContainer}>
					{ business?.cover_photo?.url &&
						<Image 
							src={business?.cover_photo?.url} 
							alt={business.name}
							height={business.cover_photo.height} 
							width={business?.cover_photo.width}
						/>
					}
				</div>
				<div className={styles.businessCardDetails}>
					<div className={styles.businessCardDetailsInfoContainer}>
						<div className={styles.businessCardDetailsInfoContainerName}>
							{capitalizeFirstLetter(business.name)}
						</div>
						<div className={styles.businessCardDetailsInfoContainerCategory}>
							{business.category.toUpperCase()}
						</div>
					</div>
					<div className={styles.businessCardDetailsInfoContainerEllipses}>
						<div className={styles.ellipse}></div>
						<div className={styles.ellipse}></div>
						<div className={styles.ellipse}></div>
					</div>
				</div>
			</div>
		</button>
	)
}

export default BusinessCard