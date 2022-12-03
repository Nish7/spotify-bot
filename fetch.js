const fs = require('fs');

(async () => {
	const file = fs.readFileSync('songs.txt', 'utf-8');
	const song = file.split(/\r?\n/);

	const d = [];

	for (let i = 0; i < song.length; i += 50) {
		const res = await fetchSongs(song.slice(i, i + 50));
		d.push(...res);
		console.log(`Round ${i}`);
		await sleep(30000);
	}

	console.log(d);

	fs.writeFile(
		'songs_meta_fetch.json',
		JSON.stringify(d),
		{
			encoding: 'utf8',
			flag: 'w',
		},
		(err) => console.log(err)
	);
})();

async function fetchSongs(song) {
	const oauth =
		'BQD_jOuTQZnUq9GOqrSNrhT223p1tfRMP-2eaCOcQ-rf6Sn9xgfcQwmrWaf_i6Gg9BaONODMkPkzVD6BFWmIRGptYocO6IQ1ZSMKyeKI9rY33iCR8iI6wHrW-Sn9ifgC-LX-MfRQ2MSIn-O53Fej4ugHN0bmzEboAcPxp4cpnLVSNYyv27jFWN6uM5trG4BhhGk';

	const promises = song.map((line, i) => {
		const url = new URL('https://api.spotify.com/v1/search');
		url.searchParams.set('q', line);
		url.searchParams.set('type', 'track');
		url.searchParams.set('limit', '1');

		return fetch(url, {
			headers: {
				Authorization: `Bearer ${oauth}`,
			},
		})
			.then((r) => r.json())
			.catch((e) => console.log(e));
	});

	let a = await Promise.all(promises);

	const rf_a = a.map(({ tracks }) => ({
		href: tracks.href,
		name: tracks?.items[0]?.name,
		id: tracks?.items[0]?.id,
	}));

	console.log(rf_a);

	return rf_a;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
