const getImageDimensions = file => new Promise((resolve,reject) => {
	try {
		const url = URL.createObjectURL(file);
		const img = new Image;
		img.onload = () => {
			const { width, height } = img;

			URL.revokeObjectURL(img.src);
			if (width && height) 
				resolve({ width, height });
			else 
				reject(new Error("Missing image dimensions"));
		};
		img.src=url;
	}
	catch(err) {
		console.error(err);
		reject(new Error("getImageDimensions error"));
	}
});

export default getImageDimensions;