function deepen(obj: object): object {
	const result = {};

	// For each object path (property key) in the object
	for (const objectPath in obj) {
		// Split path into component parts
		const parts = objectPath.split('.');

		// Create sub-objects along path as needed
		let target = result;
		while (parts.length > 1) {
			const part = parts.shift();
			// @ts-ignore
			target = target[part] = target[part] || {};
		}

		// Set value at end of path
		// @ts-ignore
		target[parts[0]] = obj[objectPath];
	}
	return result;
}

function dotNotationParser(obj: object | object[]) {
	if (Array.isArray(obj)) {
		return obj.map((entry) => deepen(entry));
	} else {
		return deepen(obj);
	}
}

export default dotNotationParser;
