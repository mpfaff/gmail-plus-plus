function findTheBrowser() {
	if (typeof browser !== typeof undefined) {
		return browser;
	}
	return chrome;
}

const theBrowser = findTheBrowser();

async function getPrefs(keys) {
	return new Promise((resolve, reject) => {
		theBrowser.storage.sync.get(keys, resolve);
	});
}

async function setPrefs(pairs) {
	return new Promise((resolve, reject) => {
		theBrowser.storage.sync.set(pairs, resolve);
	});
}

function onPrefsChanged(callback) {
	theBrowser.storage.sync.onChanged.addListener(callback);
}
