const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();

localTetris.element.classList.add('local');
localTetris.run();

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect('ws://' + window.location.hostname + ':9035');

const keyListener = (event) => {
	[
		['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'a', 'd', 'w', 's'],

	].forEach((key, index) => {

		const player = localTetris.player;

		//console.log(event);

		if(event.type == 'keydown' && player.sFlag == true) {

			if(event.key == key[0] || event.key == key[6]){
				player.move(-1);
			}
			else if(event.key == key[1] || event.key == key[7]){
				player.move(1);
			}
			else if(event.key == key[2] || event.key == key[8]){
				player.rotate(1);
			}

			else if(event.key == key[4]){
				player.superDrop();
			}
		}

		if(event.key == key[3] || event.key == key[9]){

			if(event.type == 'keydown'){

				if(player.dropInterval != player.DROP_FAST){
					player.drop();
					player.dropInterval = player.DROP_FAST;
				}
			}

			else{
				player.dropInterval = player.DROP_SLOW;
			}
		}


		if(event.key == key[5]) {

			if(player.sFlag == false){ // 엔터키를 누르면 게임 스타트
				player.sFlag = true;
				audioOnOff(0, true);
			}

			else if(player.rFlag == true){ // rFlagA가 true일때 엔터키를 누르면 게임 재시작
				player.restart();
				audioOnOff(0, true);
			}
		}
	});
};


document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);
