const btnSave = document.getElementById("btn-save");
const optInterval = document.getElementById("opt-interval");

async function reload() {
	const { refresh_interval } = await getPrefs({ refresh_interval: 15 });

	console.log(`refresh_interval=${refresh_interval}`);

	optInterval.value = refresh_interval;
}

reload();

btnSave.addEventListener("click", (event) => {
	const interval = parseInt(optInterval.value, 10);
	if (isNaN(interval)) {
		optInterval.setCustomValidity("Invalid integer.");
	} else {
		optInterval.setCustomValidity("");
	}
	setPrefs({
		refresh_interval: interval
	}).then(() => reload());
});
