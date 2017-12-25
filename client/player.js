class Player{
	
	constructor(tetris){
				
		this.DROP_SLOW = 1000;
		this.DROP_FAST = 50;
		
		this.events = new Events();
		
		this.tetris = tetris;
		this.arena = tetris.arena;
		
		this.dropCounter = 0;
		this.dropInterval = this.DROP_SLOW;

		this.pos = {x: 0, y: 0};
		this.matrix = null;
		this.nextmatrix = null;
		this.score = 0;
		
		this.sFlag = false; // 게임 시작 변수
		this.rFlag = false; // 게임 재시작 변수 A = Arena Clean
		this.rFlag2 = false;
				
		this.reset();
	}
	
	
	
	createPiece(type){
		if(type == 'T') {
			return [
				[0,0,0],
				[1,1,1],
				[0,1,0],
			];
		}
		
		else if(type == 'O'){
			return [
				[2, 2],
				[2, 2],
			];
		}
		
		else if(type == 'L'){
			return [
				[0, 3, 0],
				[0, 3, 0],
				[0, 3, 3],
			];
		}
		
		else if(type == 'J'){
			return [
				[0, 4, 0],
				[0, 4, 0],
				[4, 4, 0],
			];
		}
		
		else if(type == 'I'){
			return [
				[0, 5, 0, 0],
				[0, 5, 0, 0],
				[0, 5, 0, 0],
				[0, 5, 0, 0],
			];
		}
		
		else if(type == 'S'){
			return [
				[0, 6, 6],
				[6, 6, 0],
				[0, 0, 0],
			];
		}
		
		else if(type == 'Z'){
			return [
				[7, 7, 0],
				[0, 7, 7],
				[0, 0, 0],
			];
		}
	}
	
	
	
	drop(){
		
		if(this.sFlag == true){
			
			this.pos.y++;
			this.dropCounter = 0;
		
			if(this.arena.collide(this)){

				this.pos.y--;
				this.arena.merge(this);
			
				this.reset();
				this.score += this.arena.sweep();
				this.events.emit('score', this.score);
				
				audioOnOff(1, this.rFlag);
				return;
			}
		
			this.events.emit('pos', this.pos);
		}
	}
	
	superDrop(){
		
		if(this.rFlag == false){
		
			while(!this.arena.collide(this)){
				this.pos.y++;
				this.dropCounter = 0;
				
			}
		
			this.pos.y--;
			this.arena.merge(this);
			
			this.reset();
			this.score += this.arena.sweep();
			this.events.emit('score', this.score);
			
			audioOnOff(1, this.rFlag);
			return;
		}
	}
	
	
	
	move(dir) {
		this.pos.x += dir;
		if(this.arena.collide(this)){
			this.pos.x -= dir;
			return;
		}
		this.events.emit('pos', this.pos);
	}
	
	
	
	reset(){
		const pieces = 'ILJOTSZ'; 
		
		if(this.rFlag == false){
		
			if(this.matrix == null)
				this.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]); // 1번째 블록은 랜덤으로 블록 결정
		
			else
				this.matrix = this.nextmatrix; // 2번째 블록부터는 nextmatrix의 블록을 사용
			
			this.nextmatrix = this.createPiece(pieces[pieces.length * Math.random() | 0]); // 다음에 사용될 블록을 랜덤으로 결정
		}
		
		this.pos.y = 0;
		this.pos.x = (this.arena.matrix[0].length / 2 | 0) -
		       		 (this.matrix[0].length / 2 | 0);
		
	
		if(this.arena.collide(this)){
			
			this.rFlag = true; // 블록이 끝까지 쌓였을 때 게임 재시작 플래그를 true로 변경
			
			
			if(this.rFlag2 == false){
				
				audioOnOff(0, false);
				
				endGame(this.score);
				this.rFlag2 = true;
			}
		}
		
		this.events.emit('pos', this.pos);
		this.events.emit('matrix', this.matrix);
	}
	
	restart(){ // Arena 클리어 및 점수 재설정
		
		this.arena.clear();
		this.score = 0;
		this.events.emit('score', this.score);
		
		this.rFlag = false;
		this.rFlag2 = false;
	}
	
	
	
	rotate(dir){
		const pos = this.pos.x;
		let offset = 1;
		this._rotateMatrix(this.matrix, dir);
		while(this.arena.collide(this)){
			this.pos.x += offset;
			
			offset = -(offset + (offset > 0 ? 1 : -1));
			if(offset > this.matrix[0].length){
				this._rotateMatrix(this.matrix, -dir);
				this.pos.x = pos;
				return;
			}		
		}
		
		this.events.emit('matrix', this.matrix);
	}
	
	
	
	_rotateMatrix(matrix, dir){
		for(let y = 0; y < matrix.length; ++y){
			for(let x = 0; x < y; ++x){
				[ matrix[x][y], matrix[y][x], ] = 
				[ matrix[y][x], matrix[x][y], ];
			}
		}
		
		if(dir > 0){
			matrix.forEach(row => row.reverse());
		}
		
		else{
			matrix.reverse();
		}
	}
	
	
	update(deltaTime){
		
		this.arena.penalty(); /////////////
		
		this.dropCounter += deltaTime;
		if(this.dropCounter > this.dropInterval) {
			this.drop();
		}
	
	}
}	