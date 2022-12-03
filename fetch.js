const fs = require('fs');

(async () => {
	// Read files from songs.txt
	const file = fs.readFileSync('songs.txt', 'utf-8');
	// each line seperated using regex
	const song = file.split(/\r?\n/);

	// return data object
	const d = [];

	// fetch songs 50 at a time -> to avoid rate limits
	for (let i = 0; i < song.length; i += 50) {
		const res = await fetchSongs(song.slice(i, i + 50));
		d.push(...res);
		console.log(`Round ${i}`);

		// wait for 30sec.
		await sleep(30000);
	}

	// write the response into a new file.
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
	// this is  expired
	const oauth =
		'BQD_jOuTQZnUq9GOqrSNrhT223p1tfRMP-2eaCOcQ-rf6Sn9xgfcQwmrWaf_i6Gg9BaONODMkPkzVD6BFWmIRGptYocO6IQ1ZSMKyeKI9rY33iCR8iI6wHrW-Sn9ifgC-LX-MfRQ2MSIn-O53Fej4ugHN0bmzEboAcPxp4cpnLVSNYyv27jFWN6uM5trG4BhhGk';

	// 50 parallel request
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

	// wait for all of the promises to be fullfilled
	let a = await Promise.all(promises);

	// data clean up
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
