const extractSharedData = (html) => {
	try {
		return JSON.parse(html.split('window._sharedData = ')[1].split(';</script>')[0]);
	} catch (e) {
		console.log(html);
		throw e;
	}
};

module.exports = extractSharedData;
