// function getQueryParameter(key) {
// 	const queryParams = new URLSearchParams(window.location.search);
// 	console.log(queryParams);
//
// 	return queryParams.get(key);
// }
//
// export let isMuted = getQueryParameter('isMuted') === 'true';
const urlParams = new URLSearchParams(window.location.search);
const isMuted = urlParams.get('isMuted') === 'true';

// console.log("window.location.search:", window.location.search);
// console.log("Extracted isMuted:", getQueryParameter('isMuted'));

export const gameBackgroundMusic = new Audio('./assets/music/backgroundMusic.mp3');
gameBackgroundMusic.loop = true;

export const breakSound = new Audio('./assets/music/breakSound.mp3');

export const gameOverSound = new Audio('./assets/music/gameOverSound.mp3');

export function playBreakSound() {
	if (!isMuted) {
		breakSound.play();
	}
}
export function playGameOverSound() {
	if (!isMuted) {
		gameOverSound.play();
	}
}
export function startBackgroundMusic() {
	if (!isMuted) {
		gameBackgroundMusic.play();
	}
}

export function stopBackgroundMusic() {
	gameBackgroundMusic.pause();
}

export function toggleMuteState() {
	console.log(`Звук выключен: ${isMuted}`);
	if (isMuted) {
		gameBackgroundMusic.pause();
	} else {
		gameBackgroundMusic.pause();
	}
}

toggleMuteState();