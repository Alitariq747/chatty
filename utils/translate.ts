// Description: Translation utility using RapidAPI.

export const translate = async (
	text: string,
	source: string = "en",
	target: string
): Promise<string> => {
	// API Endpoint
	const url = "https://deep-translate1.p.rapidapi.com/language/translate/v2";

	// API Options
	const options = {
		method: "POST",
		headers: {
			"x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
			"x-rapidapi-host": "deep-translate1.p.rapidapi.com",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			q: text,
			source: source,
			target: target,
		}),
	};

	try {
		// Fetch response
		const response = await fetch(url, options);

		// Parse response as JSON
		const result = await response.json();

        // Extract translated text
        console.log(result);
        
		return result.data.translations.translatedText;
	} catch (error) {
		console.error("Translation Error:", error);

		// Fallback: Return original text
		return text;
	}
};
