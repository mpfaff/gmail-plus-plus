const SENSITIVE_DEBUG = true;

const TAB_URL_PAT = /^https?:\/\/mail\.google\.com\/mail\/u\/(\d+)\/.+$/;

// DOMContentLoaded does not work for extensions (at least on Chrome)

// this url contains a hard-coded token that we need.
const theIframe = document.body.getElementsByTagName("iframe")[0];
const dataUrl = new URL(theIframe.src);
const dataUrlToken = JSON.parse(dataUrl.searchParams.get("token"));
if (SENSITIVE_DEBUG) console.debug(`dataUrlToken=${dataUrlToken}`);
const iCftp = dataUrlToken.indexOf("cftp");
const vCftp = dataUrlToken[iCftp + 1];
if (SENSITIVE_DEBUG) console.debug(`cftp=${vCftp}`);

const SEEN = Symbol();

function getCookies(name) {
	return document.cookie
		.split("; ")
		.filter((row) => row.startsWith(`${name}=`))
		.map((row) => row.split("=")[1]);
}

function getAccessToken() {
	const gmail_at = getCookies("GMAIL_AT");
	if (gmail_at.length === 0) {
		console.error(`Could not get gmail access token`);
		return null;
	} else if (gmail_at.length !== 1) {
		console.error(`More than one gmail access token: ${gmail_at}`);
		return null;
	}
	return gmail_at[0];
}

async function fullRefresh() {
	const tab_url = window.location.href;
	const matches = tab_url.match(TAB_URL_PAT);
	if (matches === null) {
		console.error(`Not on gmail: ${tab_url}`);
		return;
	}
	const profile = matches[1];
	const gmail_at = getAccessToken();
	if (gmail_at === null) {
		return;
	}

	// The request we need to send. Response seems to be unnecessary for our purposes.
	const url = `https://mail.google.com/mail/u/${profile}/?ik=${vCftp}&view=up&act=cma_1&at=${gmail_at}&rt=c`;
	const resp = await fetch(url);
	if (resp.status !== 200) {
		console.error(`Failed to refresh external POP3 account: Status ${resp.status}`);
		if (SENSITIVE_DEBUG) console.error(resp);
	} else {
		if (SENSITIVE_DEBUG) console.debug(resp);
	}
}

// refresh on page load
fullRefresh();

// modify the refresh button to also do a full refresh

function modRefreshButton(btn) {
	console.log("found refresh button");
	lastRefreshButton = btn;
	btn.addEventListener('click', (event) => {
		fullRefresh();
	});
}

function modRefreshButtons(retry) {
	const candidates = Array.from(document.querySelectorAll(".asf"))
		.map((node) => node.parentElement.parentElement)
		.filter((node) => node[SEEN] !== true);
	candidates.forEach((node) => node[SEEN] = true);
	const btns = Array.from(candidates);
	if (retry && btns.length === 0) {
		console.log("couldn't find refresh button");
		setTimeout(() => modRefreshButtons(retry), 100);
		return;
	}
	btns.forEach(modRefreshButton);
}

window.addEventListener('hashchange', () => {
	modRefreshButtons(false);
});

modRefreshButtons(true);
