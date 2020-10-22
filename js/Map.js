class Map{
	constructor(){
		// 记录历史存儲棋盘
		this.historysMap = []
		this.chessIdx = 0
		this.init()
		this.lock = true;
		
		// 悔棋函數节流
		this.retractChessLock = true
		
		// 悔棋信号量
		this.retractIdx = 0
	}
	init() {
		/*
		*	棋子编号
		*	黑方: 卒(11) 炮(12) 車(13) 馬(14) 象(15) 士(16) 将(17)
		*	紅方: 兵(21) 炮(22) 车(23) 马(24) 相(25) 仕(26) 帅(27)
		*/
	
		
		this.chessMap = [
			[13,0,0,11,0,0,21,0,0,23],
			[14,0,12,0,0,0,0,22,0,24],
			[15,0,0,11,0,0,21,0,0,25],
			[16,0,0,0,0,0,0,0,0,26,],
			[17,0,0,11,0,0,21,0,0,27],
			[16,0,0,0,0,0,0,0,0,26,],
			[15,0,0,11,0,0,21,0,0,25],
			[14,0,12,0,0,0,0,22,0,24],
			[13,0,0,11,0,0,21,0,0,23]
		]
		
		// 这个矩阵存放真实棋子
		this.chessArr = [[],[],[],[],[],[],[],[],[]]
		// 实例化棋子
		this.createChessArrByCode()
	}
	
	//根据chessMap矩阵来创建chessArr棋子数组
	createChessArrByCode(){
		for (var i = 0;i < this.chessMap.length;i++){
			for (var j = 0;j < this.chessMap[0].length;j++){
				//if(this.chessMap[i][j] != 0){
					if(this.chessMap[i][j] < 18){
						this.chessArr[i][j] = new Chess(i, j, game.R.c[this.chessMap[i][j]], 'c', this.chessMap[i][j])
					}else if(this.chessMap[i][j] > 20){
						this.chessArr[i][j] = new Chess(i, j, game.R.h[this.chessMap[i][j]], 'h', this.chessMap[i][j])
					}
				//}
				
				
			}
		}
	}
	
	// 悔棋
	retractChess() {
		// 函数节流
		if( this.retractChessLock == false ) return
		this.retractChessLock = false
		// 悔棋
		this.retractIdx = this.historysMap.length - 1
		//debugger
		if(this.retractIdx < 0){
			return
		}
		this.chessArr[this.historysMap[this.retractIdx].endY][this.historysMap[this.retractIdx].endX].moveTo(this.historysMap[this.retractIdx].startY,this.historysMap[this.retractIdx].startX,8,false)
		// 备份this
		var self = this
		game.registCallback(12,function(){
			self.chessMap[self.historysMap[self.retractIdx].endY][self.historysMap[self.retractIdx].endX] = self.historysMap[self.retractIdx].endType
			self.chessMap[self.historysMap[self.retractIdx].startY][self.historysMap[self.retractIdx].startX] = self.historysMap[self.retractIdx].startType
			// 同步实例化
			self.createChessArrByCode()
			// 删除悔棋数据(用完即删)
			self.historysMap.pop()
		})
	}
	
	// 更新
	update() {
		
	}
	
	// 渲染
	render(){
		for(var i = 0; i < this.chessMap.length; i++){
			for(var j = 0; j < this.chessMap[0].length; j++){
				if(this.chessMap[i][j] != 0){
					this.chessArr[i][j].render()	// 棋子渲染
					this.chessArr[i][j].update()	// 棋子更新
					
				}
				
			}
		}
	}
	
}