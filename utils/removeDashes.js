const removeDashes = (string) => {
	const newString = string.replace(/-/g, ' ');
	return newString;
}

export default removeDashes;