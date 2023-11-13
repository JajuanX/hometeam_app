'use client'

import { useEffect, useState } from 'react';
import styles from './home.module.scss'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import BusinessCard from '@/components/businessCard/BusinessCard';
import firebaseService from '@/services/firebase-service';

function Home() {
    const [businesses, setBusinesses] = useState([])
    
    useEffect(() => {
        const firebaseAPI = new firebaseService();
        const getBusinesses = async () => {
            const response = await firebaseAPI.getDocuments('businesses');
            if (response.result) {
                setBusinesses(response.result);
            }
            if (response.error) {
                setBusinesses([]);
            }
        }
        getBusinesses();
    }, [])

	return (
		<main className={styles.main}>
            <Masonry columnsCount={2} gutter='16px'>
                { 
                    businesses && businesses.map((business, index) => {
                        return(
                            <BusinessCard business={business} key={business.id} index={index}/>
                        )
                    })
                }
            </Masonry>
		</main>
	)
}

export default Home;
