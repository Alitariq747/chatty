import { Language } from "@/types/types";

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
            return result["languages"];
		} catch (error) {
            console.error(error);
            throw new Error('Error Fetching languages..')
		}
}

export const getLanguageNameByCode = (code: string | null, languages: any[]) => {
		if (!languages || !Array.isArray(languages)) return "Unknown";

	// Find the language object based on the code
	const language = languages.find((lang) => lang.language === code);

	// Return the name if found, otherwise return 'Unknown'
	return language ? language.name : "Unknown";
};

export const getLanguageCodeByName = (name: string | null, languages: Language[]) => {
		if (!languages || !Array.isArray(languages)) return "Unknown";

	// Normalize the input name (convert to lowercase)
	const normalizedInput = name?.toLowerCase();

	// Find language where name matches (case-insensitive)
	const language = languages.find(
		(lang) => lang.name.toLowerCase() === normalizedInput
	);

	// Return the code if found, otherwise return 'Unknown'
	return language ? language.language : "Unknown";
};

export const capitalizeFirstLetter = (str: any) => {
	// Ensure the string is not empty or null
	if (!str) return "";

	// Capitalize first letter and append the rest unchanged
	return str.charAt(0).toUpperCase() + str.slice(1);
};