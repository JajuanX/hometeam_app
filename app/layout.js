import './globals.css'
import { Roboto } from 'next/font/google';
import {UserProvider} from '@/context/userContext'
export const metadata = {
	title: 'The Hometeam app',
	description: 'Generated by @driven_juan',
}
const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
})

export default function RootLayout({ children }) {

	return (
		<html lang="en" className={roboto.className}>
			<body>
				<UserProvider>
					{children}
				</UserProvider>
			</body>
		</html>
	)
}
