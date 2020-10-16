class Game{
	constructor(page){
		this.canvas = document.querySelector(page.el);
		this.imgUrl = page.imgUrlData;
		this.ctx = this.canvas.getContext('2d');
		this.notStrike = true
		
		
		// 配置
		this.config = {
			
			// 画布初始化宽高
			canvasSize: {
				w: 648,
				h: 576
			},
			// 间距
			interval: 24,
			// 边线大小
			borderSize: 1,
			// 格子大小
			gridSize: 65,
			// 棋子大小
			chessSize: 50,
			// 棋子移动速度
			chessSpeed: 6
		}
		// 存儲棋盘
		this.historysMap = []
		this.chessIdx = 0
		
		this.init();
		
		
		
		// 静态资源文件全部加载完毕执行 渲染程序
		var self = this;
		this.dataAllLoad(function (info){
			self.start();
			// 绑定监听
			self.bingEvent();
		});
		
		// 回调类数组对象 key是帧编号 value是这个帧编号要做的事情
		this.callbackss = {}
		
		//状态机
		this.fsm = '静稳'
		
	}
	
	// 初始化
	init() {
		// set画布宽高
		this.canvas.width = this.config.canvasSize.w;
		this.canvas.height = this.config.canvasSize.h;

		
		
		// 计算每个格子的平均width
		this.scaleX = (this.canvas.width - this.config.interval * 2 ) / 9;
		// 计算每个格子的平均height
		this.scaleY = (this.canvas.height - this.config.interval * 2 ) / 8;
		
		// 棋子间距
		this.chessInterval = this.config.gridSize - this.config.chessSize;
		
		// 初始化 X,Y 坐标
		this.coord = {
			X: 0,
			Y: 0
		}
		
		// 帧编号
		this.info = 0;
		this.helpInfo = 0;
		
		
	}
	
	// 进场文本
	tipInfo(count, countAll){
		// 提示信息
		this.ctx.fillStyle = 'rgb(0, 0 ,0)'
		this.ctx.fillRect(this.canvas.width / 2 - this.canvas.width / 4, this.canvas.height / 2 - 50, this.canvas.width / 2, 80)
		this.ctx.font = '15px Microsoft YaHei'
		this.ctx.fillStyle = 'rgb(255, 255 ,255)'
		this.ctx.fillText('图片资源加载中··· ' +  count + '/' + countAll, this.canvas.width / 2 - 112 , this.canvas.height / 2 - 10)
	}
	
	// 注册回调函数方法
	registCallback(howmanyframelater, fn) {
		console.log(typeof fn)
		this.callbackss[this.info + howmanyframelater] = fn
	}
	
	
	
	//資源配置
	dataAllLoad(callback){
		// 静态资源集合
		this.R = {
			bg:{},
			c:{},
			h:{}
		};
		// 计数
		this.count = 0;
		// 总数
		this.countAll = 15;
		var self = this
		
		for(var k in this.imgUrl){
			if(typeof this.imgUrl[k] === 'object'){
				for(var key in this.imgUrl[k]){
					this.R[k][key] = new Image();
					this.R[k][key].src = this.imgUrl[k][key];
					this.R[k][key].onload = function (){
						self.count++
						self.tipInfo(self.count, self.countAll)
						if (this.count === this.countAll){
							if(!self.notStrike) return 
							callback()
							self.notStrike = false
						}
					}
				}
			}else{
				this.R[k] = new Image()
				this.R[k].src = this.imgUrl[k];
				this.R[k].onload = function (){
					self.count++
					self.tipInfo(self.count, self.countAll)
					if (this.count == this.countAll){
						if(!self.notStrike) return 
						callback()
						self.notStrike = false
					}
				}
				
				
			}
		}
	}
	
	// 绑定监听
	bingEvent(){
		
		
		//备份this 因为监听的this指向的是监听自己不是Game实例所以得备份
		var self = this;
		this.canvas.addEventListener('click', function(e){
			self.is++
			// 计算鼠标在canvas点击的真实坐标
			var x = e.pageX - self.canvas.offsetLeft;
			var y = e.pageY - self.canvas.offsetTop;
			var startX = parseInt(x / self.scaleX)
			var startY = parseInt(y / self.scaleY)
			
			/* 
			*	计算坐标 
			*	startX = x(鼠标canvas里点击的X坐标) / [(canvas的宽 - 左右边距*2) / 9个坐标点]
			*	startY = y(鼠标canvas里点击的Y坐标) / [(canvas的高 - 上下边距*2) / 8个坐标点]
			*	startMinX = startX * 棋子大小 + (格子大小 - 棋子大小)
			*	startMaxX = startX * 格子大小 + 棋子大小
			*	计算出每个坐标的范围值
			*/
			let startMinX = startX * self.config.chessSize + (self.config.gridSize - self.config.chessSize)
			let startMaxX = startX * self.config.gridSize + self.config.chessSize
			let startMinY = startY * self.config.chessSize + (self.config.gridSize - self.config.chessSize)
			let startMaxY = startY * self.config.gridSize + self.config.chessSize
			// 必须在以上的范围内才算点击成功，否则点击失败
			if(
				(x + self.config.borderSize) > startMinX && (x + self.config.borderSize) < startMaxX &&
				(y + self.config.borderSize) > (startY*50+15) && (y + self.config.borderSize) < (startY * 65 +50)
			){
				// 记录当前坐标
				self.coord.X = startX
				self.coord.Y = startY
				console.log(self.coord.X,self.coord.Y)
				if(self.maps.chessMap[startY][startX] != 0){
					console.log('棋子的信息',self.maps.chessArr[startX][startY])
				}
				
			}
			
		})
	}
	
	// 信息文本
	infoText () {
		
		// 帧编号
		this.info++
		this.ctx.fillStyle = 'black'
		this.ctx.font = '15px Microsoft YaHei'
		this.ctx.fillText('帧编号',this.canvas.width / 2 - 28,50)
		this.ctx.fillStyle = 'rgb(12,190,208)'
		this.ctx.font = '12px Arial'
		this.ctx.fillText(this.info,this.canvas.width / 2 - 28,70)
		
		//状态机
		this.ctx.fillStyle = 'rgb(255, 87, 34)'
		this.ctx.font = '12 Microsoft YaHei'
		this.ctx.fillText('状态机:' + this.fsm, this.canvas.width / 2 - 32, 90)
		
		
		// 楚河坐标
		this.ctx.fillStyle = 'black'
		this.ctx.font = '30px Microsoft YaHei'
		this.ctx.fillText('楚',this.canvas.width / 2 - 18,120)
		this.ctx.fillText('河',this.canvas.width / 2 - 18,158)
		
		// 汉界坐标
		this.ctx.fillStyle = 'red'
		this.ctx.font = '30px Microsoft YaHei'
		this.ctx.fillText('汉',this.canvas.width / 2 - 18,420)
		this.ctx.fillText('界',this.canvas.width / 2 - 18,478)
	}
	
	// 状态机配置
	fsmConfig() {
		switch(this.fsm){
			case '静稳' :
				
			break
			case '红方' :
				
			break
			case '黑方' :
				
			break
			case '红方' :
				
			break
			case '检查' :
				
			break
			default :
				
			break
		}
	}
	
	// 开始渲染
	start() {
		
		
		// 备份this 因为定时器的this指向window对象
		var self = this;
		// 实例化棋盘
		this.maps = new Map()
		
		this.timer = setInterval(function(){
			// 清屏
			self.ctx.clearRect(0, 0, self.config.canvasSize.w, self.config.canvasSize.h);
			
			// 绘制棋盘，棋盘不在运动，所以它不是一个类，就是直接画上去
			self.ctx.drawImage(self.R.bg, 0, 0, self.config.canvasSize.w, self.config.canvasSize.h);
			// 渲染棋盘初始化棋子
			self.maps.render()
			
			self.ctx.drawImage(self.maps.chessArr[8][9].imageName, 594, 528, 50, 50);
			
			// 检测当前帧编号是不是回调函数中的帧编号
			if(self.callbackss.hasOwnProperty(self.info)) {
				// 执行回调函数
				//console.log(self.info)
				self.callbackss[self.info]()
				
				// 当这个回调函数执行完毕后销毁
				delete self.callbackss[self.info]
			}
			// 渲染状态机
			self.fsmConfig()
			
			//self.map.ma.render()
			//self.map.ma.update()
			
			
			// 打印信息文本
			self.infoText()
		},50)
	}
	
}
