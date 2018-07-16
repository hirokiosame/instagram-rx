const extractSharedData = (html => JSON.parse(html.split('window._sharedData = ')[1].split(';</script>')[0]));

module.exports = extractSharedData;
