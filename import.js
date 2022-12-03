const songs = require('./songs_meta_fetch');

(async () => {
	for (let i = 0; i < songs.length; i += 100) {
		await importSongs(songs.slice(i, i + 100));
		console.log(`Round ${i} Completed!`);
		await sleep(5000);
	}
})();

async function importSongs(hund_songs) {
	const oauth =
		'BQDcs8LQUXH8OZcuUXxuTxZkYYa0kRsljrJfUK9HLHyfML9ajhHgyJQltrfW18BH1NSpD292M4VsMQYtbogUByPKmFWWqWy4uFDvOg5nf750SqXLtgmq01s0ot8_IW_IRSyytERqbEPrPEl9UwjPE-XcYzmxRnUxZz-3BsIuCqUrTwNyBb4hz-0Z0NQbMc7eFoeK9RR73OSDmH2A972xLe-ahMdP8M9a1Lcz04py5W-CU6XoMqayzpFfXpKJgUew';
	const playlist_id = '01OwSzdAeUP5A4L8YCGQ9k';

	let ids = hund_songs.map((s) => s.id);
	ids = [...new Set(ids)].map((id) => 'spotify:track:' + id);

	console.log(ids);

	const d = await fetch(
		`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
		{
			headers: {
				Authorization: `Bearer ${oauth}`,
				ContentType: 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ uris: ids }),
		}
	);

	console.log(d.status);
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
