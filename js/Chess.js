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
		
		// 是否存活
		this.isHide = true
		
		// 移动速度
		this.speed = game.config.chessSpeed
		
		this.matrixLock = false
	}
	
	// 更新
	update(){
		if(this.isMove){
			this.x += this.dx
			this.y += this.dy
			
			//帧编号变小
			this.moveFno--
		}
		// 当小帧编号小于0则停止运动
		if(this.moveFno <= 0){
			this.isMove = false
		}
	}
	
	// 运动
	moveTo(targetRow, targetCol, duringFrames) {
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
			self.updataMatrix(targetRow, targetCol)
		},500)
	}
	
	// 更新棋盘矩阵
	updataMatrix(targetX, targetY){
		game.maps.chessMap[this.row][this.col] = 0
		game.maps.chessMap[targetX][targetY] = this.NumberIdx
		game.maps.createChessArrByCode()
	}
	
	
	// 渲染
	render(){
		game.ctx.drawImage(this.imageName, this.x, this.y, this.w, this.w)
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
