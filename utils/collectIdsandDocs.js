const collectIdsandDocs = doc => {
	return {
	id: doc.id,
	...doc.data()
	}
}

export default collectIdsandDocs;