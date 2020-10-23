class Chess{
	constructor(row,col, imageName, type, NumberIdx){
		this.row = row;	// 所在行
		this.col = col;	// 所在的列
		this.imageName = imageName;  //图片名字
		// 计算坐标
		this.x = this.calcXYbyRowCol(this.row, this.col).x	// 自己的位置
		this.y = this.calcXYbyRowCol(this.row, this.col).y	// 自己的位置
		this.w = this.calcXYbyRowCol(this.row, this.col).w	// 自己的宽度
		// 属于那方的棋子
		this.type = type
		// 棋子的编号
		this.NumberIdx = NumberIdx
		
		// 自己是否在运动
		this.isMove = false
		this.moveFno = 0	//小帧编号
		
		// 是否选中
		this.isBorder = false
		this.borderIdx = 0
		this.boderMax = game.R.border.length - 1
		
		// 移动速度
		this.speed = game.config.chessSpeed
		
		this.matrixLock = false
		
		this.isLimitChess = false
		
		//记录棋子
		this.historysChess = {
			startX: null,
			startY: null,
			endX: null,
			endY: null,
			type: null
		}
	}
	
	// 更新
	update(){
		this.borderIdx++
		if (this.borderIdx >= this.boderMax){
			this.borderIdx = 0
		}
		
		if(this.isMove){
			this.x += this.dx
			this.y += this.dy
			
			//帧编号变小
			this.moveFno--
		}
		// 当小帧编号小于0则停止运动
		if(this.moveFno <= 0){
			//game.fsm = '静稳'
			this.isMove = false
		}
	}
	
	//棋子运动规则
	limitChess(targetRow, targetCol) {
		if(this.NumberIdx == 11){
			if(
			(targetCol < this.col) || (this.col+1 != targetCol && this.col < 5) 
			|| (this.row > 4 && this.row+1 != targetCol) ||
			(this.col+1 == targetCol && this.row+1 == targetRow) || 
			(this.col+1 == targetCol && this.row-1 == targetRow) 
			){
				return
			}
		}
	}
	
	
	// 运动
	moveTo(targetRow, targetCol, duringFrames,lock=true) {
		if(this.NumberIdx == 11 && lock){	// 黑兵走棋规则
			if(
			(targetCol < this.col) || (this.col+1 != targetCol && this.col < 5) ||
			(this.col+1 == targetCol && this.row+1 == targetRow) || 
			(this.col+1 == targetCol && this.row-1 == targetRow) ||
			(this.col+1 != targetCol && this.col > 4 && this.row + 1 != targetRow && this.row - 1 != targetRow) ||
			(this.col > 4 &&  this.row != targetRow && this.row+1 == targetRow && this.row-1 == targetRow)

			){
				return
			}
		}
		if(this.NumberIdx == 21 && lock){	// 紅兵走棋规则
			if(
			(targetCol > this.col) || (this.col-1 != targetCol && this.col > 5) ||
			(this.col-1 == targetCol && this.row+1 == targetRow) || 
			(this.col-1 == targetCol && this.row-1 == targetRow) ||
			(this.col-1 != targetCol && this.col < 4 && this.row + 1 != targetRow && this.row - 1 != targetRow) ||
			(this.col < 4 &&  this.row != targetRow && this.row+1 == targetRow && this.row-1 == targetRow)

			){
				return
			}
		}
		
		if (this.NumberIdx == 12 && lock || this.NumberIdx == 22) {		// 炮走棋規則
			if (
				this.col != targetCol && targetRow !=  this.row
			) {
				return
			}
			
		}
		
		if (this.NumberIdx == 13 && lock || this.NumberIdx == 23) {		// 車、车 走棋規則
			if (
				this.col != targetCol && targetRow !=  this.row
			) {
				return
			}
			
		}
		
		if (this.NumberIdx == 14 && lock || this.NumberIdx == 24){
			
		}
		
		
		
		
		
		
		// 打印
		//console.log('棋子的坐标：',this.col,this.row,'移动的坐标',targetCol,targetRow)
		
		this.isMove = true
		this.pageX = targetRow
		this.pageY = targetCol
		// 计算目标X,Y值
		const targetX = this.calcXYbyRowCol(targetRow, targetCol).x
		const targetY = this.calcXYbyRowCol(targetRow, targetCol).y
		
		// 计算差值
		let distanceX = targetX - this.x
		let distanceY = targetY - this.y
		
		// 平均分配到X,Y值
		this.dx = distanceX / duringFrames;
		this.dy = distanceY / duringFrames;
		
		this.moveFno = duringFrames
		
		this.matrixLock = true
		
			
		var self = this
		setTimeout(function(){
			self.updataMatrix(targetRow, targetCol,lock)
			game.fsmPick = ''
			game.fsm = '静稳'
		},100)
	}
	
	// 更新棋盘矩阵
	updataMatrix(targetX, targetY,lock){
		window.localStorage.setItem('autosavechess',JSON.stringify(game.maps.chessMap))
		this.isBorder = false
		game.test = '无选中'
		//game.maps.historysMap.shift()
		game.maps.retractChessLock = true
		if(!lock) return
			//记录棋子开始,结束坐标,棋子属性
			this.historysChess = {
				startX: this.col,
				startY: this.row,
				endX: targetY,
				endY: targetX,
				startType: this.NumberIdx,
				endType: game.maps.chessMap[targetX][targetY]
			}
			if(game.maps.chessMap[targetX][targetY] != 0){
				console.log('你的'+game.chessType[game.maps.chessMap[this.row][this.col]]+'把对方的'+game.chessType[game.maps.chessMap[targetX][targetY]]+'给吃了')
			}
			game.maps.historysMap.push(this.historysChess)
		
		
		game.maps.chessMap[this.row][this.col] = 0
		
		game.maps.chessMap[targetX][targetY] = this.NumberIdx
		game.maps.createChessArrByCode()
		
	}
	
	
	// 渲染
	render(){
		//if(game.test == '无选中'){
		//	game.ctx.drawImage(this.imageName, this.x, this.y, this.w, this.w)
			
		//}else{
			if (this.isBorder == true) {
				game.ctx.drawImage(game.R.border[this.borderIdx], this.x, this.y-3, this.w, this.w)
				game.ctx.drawImage(this.imageName, this.x, this.y, this.w, this.w)
			}else{
				game.ctx.drawImage(this.imageName, this.x, this.y, this.w, this.w)
			}
		//}
		
	}
	
	// 辅助函数
	calcXYbyRowCol(row, col){
		return {
			x: col * (game.config.gridSize + game.config.borderSize),
			y: row * (game.config.gridSize + game.config.borderSize),
			w: game.config.chessSize
		}
	} 
}