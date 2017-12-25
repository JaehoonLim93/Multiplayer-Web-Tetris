class ConnectionManager{
	
	constructor(tetrisManager){
		
		this.conn = null;
		this.peers = new Map;
		
		this.tetrisManager = tetrisManager;
		this.localTetris = [...tetrisManager.instances][0];
	}
	
	connect(address){
		
		this.conn = new WebSocket(address);
		
		this.conn.addEventListener('open', () => {
			console.log('Connection established');
			
			this.initSession();
			this.watchEvents();
		});
		
		this.conn.addEventListener('message', event => {
			
			console.log('Received message', event.data);
			this.received(event.data);
		});
	}
	
	initSession(){
		
		const sessionId = window.location.hash.split('#')[1]; // URL에서 #뒤에있는걸 sessionId로 가져옴
		const state = this.localTetris.serialize();
		
		
		if(sessionId){ // 가져오는데 성공했다면 = sessionId가 존재한다면
			
			this.send({
				type: 'join-session', // 가져와서 같이 접속하고
				id: sessionId,
				state,
			});
		}
		
		else{
			this.send({ // 없으면
				type: 'create-session', // 새로 하나 만든다
				state,
			});	
		}
	}
	
	watchEvents(){
		
		const local = this.localTetris;
		
		const player = local.player;
		['pos', 'matrix', 'score'].forEach(prop => {
			player.events.listen(prop, value => {
				this.send({
					type: 'state-update',
					fragment: 'player',
					state: [prop, value],
				});
			});
		});
		
		
		const arena = local.arena;
		['matrix', 'rowCount'].forEach(prop => {
			arena.events.listen(prop, value => {
				this.send({
					type: 'state-update',
					fragment: 'arena',
					state: [prop, value],
				});
			});
		});
	}
	
	
	updateManager(peers){
		
		const me = peers.you;
		const clients = peers.clients.filter(client => me != client.id);
		
		clients.forEach(client => {
			if(!this.peers.has(client.id)) {
				const tetris = this.tetrisManager.createPlayer();
				
				tetris.unserialize(client.state);
				this.peers.set(client.id, tetris);
				
			}
			
		});
		
		[...this.peers.entries()].forEach(([id, tetris]) => {
			if(!clients.some(client => client.id == id)){ // client id 중복 방지
				this.tetrisManager.removePlayer(tetris);
				this.peers.delete(id);
			}
		});
		

		const sorted = peers.clients.map(client => this.peers.get(client.id) || this.localTetris);
		this.tetrisManager.sortPlayers(sorted);		
		//console.log(sorted);
		
	}
	
	updatePeer(id, fragment, [prop, value]){
		
		if(!this.peers.has(id)){
			
			console.error('Client does not exists', id);
			return;
		}
		
		const tetris = this.peers.get(id);
		tetris[fragment][prop] = value;
		
		if(prop == 'score'){
			
			tetris.updateScore(value);
		}
		
		else if(prop == 'rowCount'){
			
			//console.log('OtherSweep :', value);
			////////////////////////////////////
			////////////////////////////////////
			
			this.localTetris.arena.otherSweep = value;
			console.log(this.localTetris.arena);
			
		}
		
		else{
			
			tetris.draw();
		}
	}
	
	received(msg){
		
		const data = JSON.parse(msg);
		if(data.type == 'session-created'){
			
			window.location.hash = data.id; // 주소 URL 끝 해쉬값으로 data.id를 집어넣기
		}
		
		else if(data.type == 'session-broadcast'){
			
			this.updateManager(data.peers);
		}
		
		else if(data.type == 'state-update') {
			
			this.updatePeer(data.clientId, data.fragment, data.state);
		}
	}
	
	send(data){
		
		const msg = JSON.stringify(data);
		console.log('Sending message', msg);
		this.conn.send(msg);
	}
}