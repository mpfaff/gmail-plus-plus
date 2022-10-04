const filter = {
	"urls": ["*://mail.google.com/sync/u/*/i/*"],
	//"urls": ["*://mail.google.com/mail/u/*/?*act=par*"],
	"types": ["xmlhttprequest"],
};

const theBrowser = window["browser"] || window["chrome"];

const pat = /^https:\/\/mail\.google\.com\/mail\/u\/(\d+)\/\?view=up&act=cma_1$/;

/*theBrowser.webRequest.onBeforeRequest.addListener(({ method, url }) => {
	(async function() {
		console.log("method=" + method + ", url=" + url);

		// The request we need to send. Response seems to be unnecessary for our purposes.
		//https://mail.google.com/mail/u/0/?view=up&act=cma_1
		const matches = pat.matches(url);
		if (matches.length !== 2) {
			console.log(`did not match ${url}`);
			return;
		}
		//const profile = url.split(":")[1].substring(2).split("/")[3];
		const profile = matches[1];
		let tab = new Promise((resolve, reject) => {
			theBrowser.tabs.query({
				active: true,
				currentWindow: true
			}, resolve);
		});
		tab = (await tab)[0];
		let gmail_at = new Promise((resolve, reject) => {
			theBrowser.cookies.get({
				url: tab.url,
				//url: `https://mail.google.com/mail/u/${profile}`,
				name: "GMAIL_AT"
			}, resolve);
		});
		gmail_at = await gmail_at;
		if (gmail_at === null) {
			console.error("Could not get gmail access token");
			return;
		}
		gmail_at = gmail_at.value;
		let url1 = `https://mail.google.com/mail/u/${profile}/?ik=904e750bb6&view=up&act=cma_1&at=${gmail_at}&rt=c`;
		const resp = await fetch(url1);
		console.log(resp);
	})();
}, filter, []);*/
