class Tetris{
	
	constructor(element){
		
		this.element = element;
		this.canvas = element.querySelector("#canvas");
		this.context = this.canvas.getContext('2d');
		this.context.scale(20, 20);
		
		this.upcomming = element.querySelector("#upcomming"); // 다음에 뭐나올지
		this.upcontext = this.upcomming.getContext('2d');
		this.upcontext.scale(20, 20);
		
		this.arena = new Arena(12, 20);
		this.player = new Player(this);
		
		this.player.events.listen('score', score => {
			this.updateScore(score);
		});
		

		
		this.colors = [
			null,
			'#2ECC71',
			'#3371FF',
			'violet',
			'yellow',
			'red',
			'#00FFFF',
			'orange',
			'white',
		];

		let lastTime = 0;
		this._update = (time = 0) => {
			
			const deltaTime = time - lastTime;
			lastTime = time;

			this.player.update(deltaTime);
			
			this.draw();			
			this.drawUpcomming(); 
			
			requestAnimationFrame(this._update);
		};
		
		this.updateScore(0);
	}
	
	draw() {
		this.context.fillStyle = 'silver';
		
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.drawMatrix(this.arena.matrix, {x: 0, y: 0});
		this.drawMatrix(this.player.matrix, this.player.pos);
	}
	
	
	
	drawUpcomming() { 
		this.upcontext.fillStyle = 'silver';
		this.upcontext.fillRect(0, 0, this.upcomming.width, this.upcomming.height);
		
		this.drawUpMatrix(this.player.nextmatrix, {x: 1.5, y: 1})
	}



	drawMatrix(matrix, offset) {
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if(value != 0) {
					this.context.fillStyle = this.colors[value];
					this.context.fillRect(x + offset.x,
							         y + offset.y,
							         1,1);
				
					this.context.strokeStyle = 'black';
					this.context.lineWidth = 0.1;
					this.context.strokeRect(x + offset.x,
							           y + offset.y,
							           1,1);
				}
			});
		});
	}
	
	
	
	drawUpMatrix(matrix, offset) {
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if(value != 0) {
					this.upcontext.fillStyle = this.colors[value];
					this.upcontext.fillRect(x + offset.x,
							         y + offset.y,
							         1,1);
				
					this.upcontext.strokeStyle = 'black';
					this.upcontext.lineWidth = 0.1;
					this.upcontext.strokeRect(x + offset.x,
							           y + offset.y,
							           1,1);
				}
			});
		});
	}
	
	run(){
		
		this._update();
	}
	
	serialize(){
		
		return {
			
			arena: {
				matrix: this.arena.matrix,
			},
			
			player: {
				
				matrix: this.player.matrix,
				pos: this.player.pos,
				score: this.player.score,
			}
		}
	}
	
	
	unserialize(state){
		
		this.arena = Object.assign(state.arena);
		this.player = Object.assign(state.player);
		
		this.updateScore(this.player.score);
		this.draw();
	}
	

	updateScore(score){
		this.element.querySelector('.score').innerText = score;
	}
}