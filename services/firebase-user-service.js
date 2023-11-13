class firebaseUserService {
	async addOwnerRole (email) {
		let response = null;
		let error = null;

		try {
			response = axios.post(`https://us-central1-hometeam-891a3.cloudfunctions.net/addBusinessOwnerRole`, {
				data: { email },
			})

			if(response.data?.result?.errorInfo){
				error = { 
					display: 'Fail to Create Business owner',
					message: response.data?.result?.errorInfo
				}
				return error;
			}
		} catch (error) {
			error = {display: 'Fail to Create Business owner'};
		}
		return {response, error}
	}
}

export default firebaseUserService;