const playarea = document.querySelector('#playarea');
const playareaDimension = playarea.getBoundingClientRect();
const dias = document.querySelector('#diafe li:first-child');
const life = document.querySelector('#diafe li:last-child');
const time = document.querySelector('#scime li:first-child');
const score = document.querySelector('#scime li:last-child');
const restart = document.querySelector('#playAgain');

const environment = [
	[4, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	[1, 1, 0, 1, 4, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 4],
	[8, 1, 0, 1, 1, 1, 0, 1, 9, 1, 0, 4, 0, 1, 0, 0, 0, 0, 0, 1, 1],
	[0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
	[0, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 2, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 2, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
	[0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 4],
	[3, 1, 0, 4, 0, 1, 0, 1, 0, 4, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0],
	[7, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 4, 0, 0, 1, 0, 0, 0]
];

let enemyInterval, timeInterval;
coinRotate = 1;
const goTo = { up: false, down: false, left: false, right: false };
const charInfo = {};
const controls = [
	'KeyW',
	'KeyS',
	'KeyA',
	'KeyD',
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight'
];

function createEnvironment() {
	let ecount = 1;
	let pcount = 1;
	let diasCount = 1;
	for (let i = 0; i < environment.length; i++) {
		for (let j = 0; j < environment[i].length; j++) {
			const divs = document.createElement('div');
			// obtacle
			if (environment[i][j] === 1) {
				let x = Math.floor(Math.random() * 7) + 1;
				divs.classList.add('obstacles');

				divs.style.left = `${j * 50}px`;
				divs.style.top = `${i * 50}px`;

				divs.style.backgroundImage = `url("./assets/obstacle/${x}.png")`;
				// enemy
			} else if (environment[i][j] === 2) {
				divs.id = `e${ecount}`;
				divs.classList.add('characters');

				divs.style.left = `${j * 50 + 5}px`;
				divs.style.top = `${i * 50 + 5}px`;

				ecount++;
				// prota
			} else if (environment[i][j] === 3) {
				divs.id = `p${pcount}`;
				divs.classList.add('characters');

				divs.style.left = `${j * 50 + 5}px`;
				divs.style.top = `${i * 50 + 5}px`;
				pcount++;
			} else if (environment[i][j] === 4) {
				divs.classList.add('diamond');

				divs.style.left = `${j * 50 + 5}px`;
				divs.style.top = `${i * 50 + 5}px`;

				divs.style.backgroundImage = `url('./assets/others/dias${diasCount}.png')`;
				diasCount++;
			} else if (environment[i][j] === 7) {
				divs.classList.add('spawnpoint');

				divs.style.left = `${j * 50 + 2}px`;
				divs.style.top = `${i * 50 - 5}px`;

				divs.style.backgroundImage = 'url("./assets/others/spawnpoint.png")';
			} else if (environment[i][j] === 8) {
				divs.id = 'key';
				divs.classList.add('coin');

				divs.style.left = `${j * 50 + 15}px`;
				divs.style.top = `${i * 50 + 15}px`;

				divs.style.backgroundImage = `url('./assets/others/coin${coinRotate}.png')`;
			} else if (environment[i][j] === 9) {
				divs.id = 'door';
				divs.classList.add('coin');

				divs.style.left = `${j * 50 + 15}px`;
				divs.style.top = `${i * 50 + 15}px`;

				divs.style.backgroundImage = `url('./assets/others/coin${coinRotate}.png')`;
			} else {
				divs.classList.add('coin');

				divs.style.left = `${j * 50 + 15}px`;
				divs.style.top = `${i * 50 + 15}px`;

				divs.style.backgroundImage = `url('./assets/others/coin${coinRotate}.png')`;
			}
			playarea.appendChild(divs);
		}
	}
}

function coinFlip() {
	const coins = document.querySelectorAll('.coin');
	if (coinRotate === 4) {
		coinRotate = 1;
	}
	for (let coin of coins) {
		coin.style.backgroundImage = `url("./assets/others/coin${coinRotate}.png")`;
	}
	coinRotate++;
}

function initailPos() {
	const characters = document.querySelectorAll('.characters');
	time.children[1].innerText = '00:00:00';

	for (let char of characters) {
		let design = Math.floor(Math.random() * 3) + 1;
		if (char.id.startsWith('e')) {
			charInfo[char.id] = {
				xValue:
					playareaDimension.width -
					(playareaDimension.width - char.style.left.slice(-0, -2)),
				yValue:
					playareaDimension.height -
					(playareaDimension.height - char.style.top.slice(-0, -2)),
				direction: 'down',
				walkValue: 1,
				model: design,
				moveStop: {},
				interval: null
			};
			charInfo[char.id].moveStop = goTo;
		} else {
			charInfo[char.id] = {
				xValue:
					playareaDimension.width -
					(playareaDimension.width - char.style.left.slice(-0, -2)),
				yValue:
					playareaDimension.height -
					(playareaDimension.height - char.style.top.slice(-0, -2)),
				direction: 'down',
				walkValue: 1,
				respawn: {},
				life: 3,
				dias: 0,
				score: 0,
				moveStop: {}
			};
			charInfo[char.id].moveStop = goTo;
			charInfo[char.id].respawn = {
				x: charInfo[char.id].xValue,
				y: charInfo[char.id].yValue
			};
		}
	}
	moving();
}

function moving() {
	for (let id of Object.keys(charInfo)) {
		const character = document.querySelector(`#${id}`);
		const cid = charInfo[id];
		character.style.top = `${cid.yValue}px`;
		character.style.left = cid.xValue + 'px';
		if (id.startsWith('e')) {
			character.style.backgroundImage = `url("./assets/enemy/${cid.model}/${cid.direction}${cid.walkValue}.png")`;
		} else if (id.startsWith('p')) {
			character.style.backgroundImage = `url("./assets/prota/${cid.direction}${cid.walkValue}.png")`;
		}
	}
}

function animation(charId) {
	charInfo[charId].walkValue < 4
		? charInfo[charId].walkValue++
		: (charInfo[charId].walkValue = 1);
}

function resetMoveStop(protanemy) {
	for (let direction in charInfo[protanemy].moveStop) {
		charInfo[protanemy].moveStop[direction] = false;
	}
}

function enemyMovement(id) {
	const enemy = document.querySelector(`#${id}`).getBoundingClientRect();
	const randDirection = Math.floor(Math.random() * 4);
	let randDistance = (Math.floor(Math.random() * 3) + 1) * 50;
	const steps = 5;

	resetMoveStop(id);

	charInfo[id].interval = setInterval(() => {
		isCollide(id);

		charInfo[id].previousDirection = randDirection;
		switch (randDirection) {
			// Go to Up
			case 0:
				if (charInfo[id].yValue <= 0 || charInfo[id].moveStop.up === true) {
					stopEnemy(id);
					charInfo[id].direction = 'up';
					enemyMovement(id);
				} else {
					charInfo[id].yValue -= steps;
					charInfo[id].direction = 'up';
				}
				break;
			// Go to Down
			case 1:
				if (
					charInfo[id].yValue + enemy.height >= playareaDimension.height ||
					charInfo[id].moveStop.down === true
				) {
					stopEnemy(id);
					charInfo[id].direction = 'down';
					enemyMovement(id);
				} else {
					charInfo[id].yValue += steps;
					charInfo[id].direction = 'down';
				}
				break;
			// Go to Left
			case 2:
				if (charInfo[id].xValue <= 0 || charInfo[id].moveStop.left === true) {
					stopEnemy(id);
					charInfo[id].direction = 'left';
					enemyMovement(id);
				} else {
					charInfo[id].xValue -= steps;
					charInfo[id].direction = 'left';
				}
				break;
			// Go to Right
			case 3:
				if (
					charInfo[id].xValue + enemy.width >= playareaDimension.width ||
					charInfo[id].moveStop.right === true
				) {
					stopEnemy(id);
					charInfo[id].direction = 'right';
					enemyMovement(id);
				} else {
					charInfo[id].xValue += steps;
					charInfo[id].direction = 'right';
				}
				break;
		}
		randDistance -= steps;
		if (randDistance === 0) {
			stopEnemy(id);
			enemyMovement(id);
		}
		animation(id);
		moving();
	}, 100);
}

function enemyGo() {
	const enemies = Object.keys(charInfo);
	for (let enemy of enemies) {
		if (enemy.startsWith('e')) {
			enemyMovement(enemy);
		}
	}
}

function stopEnemy(id) {
	clearInterval(charInfo[id].interval);
	charInfo[id].interval = null;
}

function isCollide(id) {
	const divs = document.querySelectorAll('div[style]');
	const aRect = document.querySelector(`#${id}`).getBoundingClientRect();
	for (let div of divs) {
		const bRect = div.getBoundingClientRect();
		const xDiff = Math.floor(bRect.x + bRect.width - aRect.x);
		const yDiff = Math.floor(bRect.y + bRect.height - aRect.y);
		if (
			(id.startsWith('p') &&
				div.hasAttribute('id') &&
				div.getAttribute('id') != 'key' &&
				div.getAttribute('id') != 'door') ||
			(id.startsWith('e') && div.getAttribute('id') === 'p1')
		) {
			if (
				(yDiff >= 10 && yDiff <= 15 && xDiff >= 5 && xDiff <= 70) ||
				(yDiff >= 70 && yDiff <= 75 && xDiff >= 5 && xDiff <= 70) ||
				(xDiff >= 0 && xDiff <= 5 && yDiff >= 10 && yDiff <= 75) ||
				(xDiff >= 70 && xDiff <= 75 && yDiff >= 10 && yDiff <= 75)
			) {
				if (id.startsWith('p')) {
					respawn(id);
				} else {
					respawn(div.getAttribute('id'));
				}
			}
		} else if (
			id.startsWith('p') &&
			(div.getAttribute('class') === 'diamond' ||
				div.getAttribute('id') === 'key' ||
				div.getAttribute('id') === 'door' ||
				div.getAttribute('class') === 'coin')
		) {
			if (
				(yDiff >= 10 && yDiff <= 15 && xDiff >= 5 && xDiff <= 70) ||
				(yDiff >= 70 && yDiff <= 75 && xDiff >= 5 && xDiff <= 70) ||
				(xDiff >= 0 && xDiff <= 5 && yDiff >= 10 && yDiff <= 75) ||
				(xDiff >= 70 && xDiff <= 75 && yDiff >= 10 && yDiff <= 75)
			) {
				if (
					div.getAttribute('id') === 'key' &&
					div.getAttribute('class') === 'key'
				) {
					charInfo[id].score += 5000;
					initialGameInfo();
					div.style.display = 'none';
					const door = document.querySelector('#door');
					door.classList.remove('coin');
					door.classList.remove('hide');
					door.classList.add('door');
					door.style.backgroundImage = 'url("./assets/others/door.png"';
					door.style.left = door.style.left.slice(-0, -2) - 15 + 'px';
					door.style.top = door.style.top.slice(-0, -2) - 15 + 'px';
				} else if (div.getAttribute('class') === 'coin') {
					charInfo[id].score += 20;
					initialGameInfo();
					div.classList.add('hide');
				} else if (div.getAttribute('id') === 'door') {
					charInfo[id].score += 2000;
					endGame('win');
				} else {
					charInfo[id].dias += 1;
					charInfo[id].score += 1000;
					initialGameInfo();
					div.remove();
				}
			}
		} else {
			if (
				id.startsWith('e') &&
				(div.getAttribute('class') === 'diamond' ||
					div.getAttribute('id') === 'key' ||
					div.getAttribute('class') === 'coin')
			) {
			} else {
				// Moving Up Collision Detection
				if (yDiff >= 5 && yDiff <= 10 && xDiff >= 5 && xDiff <= 85) {
					charInfo[id].moveStop.up = true;
					// Moving Down Collision Detection
				} else if (yDiff >= 90 && yDiff <= 95 && xDiff >= 5 && xDiff <= 85) {
					charInfo[id].moveStop.down = true;
					// Moving Left Collision Detection
				} else if (xDiff >= -5 && xDiff <= 0 && yDiff >= 10 && yDiff <= 85) {
					charInfo[id].moveStop.left = true;
					// Moving Right Collision Detection
				} else if (xDiff >= 85 && xDiff <= 90 && yDiff >= 10 && yDiff <= 85) {
					charInfo[id].moveStop.right = true;
				}
			}
		}
	}
}

function respawn(id) {
	charInfo[id].life -= 1;
	if (charInfo[id].life === 0) {
		endGame('died');
	} else {
		charInfo[id].xValue = charInfo[id].respawn.x;
		charInfo[id].yValue = charInfo[id].respawn.y;
		initialGameInfo();
	}
}

function initialGameInfo() {
	time.children[0].style.backgroundImage = 'url(./assets/others/time.png)';
	score.children[0].style.backgroundImage = 'url(./assets/others/star.png)';
	score.children[1].innerText = `x${charInfo.p1.score}`;
	dias.children[0].style.backgroundImage = 'url(./assets/others/dias0.png)';
	dias.children[1].innerText = `x0${charInfo.p1.dias}`;
	life.children[0].style.backgroundImage = `url(./assets/others/life${charInfo.p1.life}.png)`;
	life.children[1].innerText = `x0${charInfo.p1.life}`;
	if (charInfo.p1.dias == 8) {
		const key = document.querySelector('#key');
		key.classList.remove('coin');
		key.classList.remove('hide');
		key.classList.add('key');
		key.style.backgroundImage = 'url("./assets/others/key.png")';
		key.style.left = `5px`;
	}
}

function gameIntro() {
	const playGame = document.querySelector('#endGame');
	restart.onclick = () => {
		playGame.style.display = 'none';
		gameInitialize();
	};
}

function gameInitialize() {
	createEnvironment();
	initailPos();
	initialGameInfo();
	enemyGo();
	setInterval(coinFlip, 150);
	startTimer();
}

function startTimer() {
	let totalTime = 3 * 60 * 1000;

	const timerDisplay = document.querySelector('#scime>li p');
	timeInterval = setInterval(() => {
		const minutes = Math.floor(totalTime / (60 * 1000));
		const seconds = Math.floor((totalTime % (60 * 1000)) / 1000);
		const milliseconds = totalTime % 1000;

		timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(
			seconds
		).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;

		if (totalTime <= 0) {
			clearInterval(timeInterval);
			timerDisplay.textContent = '00:00:00';
			endGame('timeEnd');
		} else {
			totalTime -= 10;
		}
	}, 10);
}

function endGame(status) {
	const endStatus = document.querySelector('#endStatus');
	const displayEndTime = document.querySelector('#time');
	const finalScore = document.querySelector('#finalScore');
	const endGame = document.querySelector('#endGame');
	const characters = document.querySelectorAll('.characters');
	const endTime = document.querySelector('#scime>li p');

	for (let character of characters) {
		character.remove();
	}
	clearInterval(timeInterval);
	timeInterval = null;
	if (status === 'win') {
		endStatus.innerText = 'YOU WON!';
	} else if (status === 'timeEnd') {
		endStatus.innerText = 'YOU LOSE!';
	} else if (status === 'died') {
		endStatus.innerText = 'YOU DIED!';
	}
	displayEndTime.innerText = 'Remaining Time: ' + endTime.innerHTML.slice(0, 8);
	displayEndTime.style.fontSize = '60px';
	finalScore.classList.remove('hide');
	finalScore.innerText = 'Final Score: ' + charInfo.p1.score;
	restart.innerText = 'Play Again';
	endGame.style.display = 'flex';
	restart.style.fontSize = '40px';
	restart.onclick = () => {
		endGame.style.display = 'none';
		gameInitialize();
	};
}

document.addEventListener('keydown', function (e) {
	const prota = document.querySelector('#p1').getBoundingClientRect();
	resetMoveStop('p1');
	for (let i = 0; i < controls.length; i++) {
		if (e.code === controls[i]) {
			// Check if Collided to obstacles
			isCollide('p1');
			// Move Up
			if (e.code === 'KeyW' || e.code === 'ArrowUp') {
				// Stop Moving Upward if collided to obstacles or top border reach
				if (charInfo.p1.yValue <= 0 || charInfo.p1.moveStop.up === true) {
					charInfo.p1.direction = 'up';
				} else {
					charInfo.p1.yValue -= 5;
					charInfo.p1.direction = 'up';
					// resetMoveStop('p1');
				}
				// Move Down
			} else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
				// Stop Moving Upward if collided to obstacles or top border reach
				if (
					charInfo.p1.yValue + prota.height >= playareaDimension.height ||
					charInfo.p1.moveStop.down === true
				) {
					charInfo.p1.direction = 'down';
				} else {
					charInfo.p1.yValue += 5;
					charInfo.p1.direction = 'down';
					// resetMoveStop('p1');
				}
			} else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
				if (charInfo.p1.xValue <= 0 || charInfo.p1.moveStop.left === true) {
					charInfo.p1.direction = 'left';
				} else {
					charInfo.p1.xValue -= 5;
					charInfo.p1.direction = 'left';
					// resetMoveStop('p1');
				}
			} else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
				if (
					charInfo.p1.xValue + prota.width >= playareaDimension.width ||
					charInfo.p1.moveStop.right === true
				) {
					charInfo.p1.direction = 'right';
				} else {
					charInfo.p1.xValue += 5;
					charInfo.p1.direction = 'right';
					// resetMoveStop('p1');
				}
			}
			animation('p1');
			moving();
		}
	}
});

gameIntro();
