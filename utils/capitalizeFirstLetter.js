const capitalizeFirstLetter = (string) => {
	// string.charAt(0).toUpperCase() + string.slice(1)
	const splitStr = string.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i += 1) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
	}
	return splitStr.join(' '); 
}

export default capitalizeFirstLetter;
