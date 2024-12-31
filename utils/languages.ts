export const getAllLanguages = async () => {
    const url =
			"https://deep-translate1.p.rapidapi.com/language/translate/v2/languages";
		const options = {
			method: "GET",
			headers: {
				"x-rapidapi-key": "83aa78731cmsh92bec3834e1b101p1239fajsn9d59e151f583",
				"x-rapidapi-host": "deep-translate1.p.rapidapi.com",
			},
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();
            console.log(result["languages"]);
            return result['languages']
		} catch (error) {
            console.error(error);
            throw new Error('Error Fetching languages..')
		}
}