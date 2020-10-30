/**
 * 游戏内容页面 逻辑 
 * @author qing
 * @Code by 2020/10/21 
 */
Page({
  data:{
    chessBoard_url: "../../images/chessBoard.png",
    byclear: 1,
    globalArray: [],
    userArray: [],
    chessPos: [
      [],
      [10,10],//刀
      [5,464],//蛛
      [412,464],//卫
      [881,5],//哨
      [881,412],//兵
      [5,881],//蟹
      [412,881],//枪
      [465,5]//神
    ],
    arcPos: null,
    chessBlockWidth: 0, // 一个方块的宽度
    chessBlockHeight: 0, // 一个方块的高度
    selectStatus: 'notSelected', //默认为未选中状态
    chessX: 0, //点击时的宽度 第 X 个 方块 
    chessY: 0,//点击时的高度 第 Y 个方块
    lastChessX: 0, // 保存需要移动的棋子 的 第 X 个方块 进行处理
    lastChessY: 0,//保存你需要移动的棋子的第 Y 个方块 进行处理
    
  },
  onLoad(){
    
  },
  onReady(){
    let parseCanvasWidth
    let parseCanvasHeight
    let that = this
    /**
     * 画布大小控制
     */
    const canvas_box = wx.createSelectorQuery()
    canvas_box.select('#canvas_container')
    .boundingClientRect().exec((res)=>  {
      parseCanvasHeight = res[0].height
      parseCanvasWidth = res[0].width
      this.setData({
        canvasWidth: parseCanvasWidth ,
        canvasHeight: parseCanvasHeight
      })
    })
    
    /**
     * 绘制棋盘
     */
    const query = wx.createSelectorQuery()
            query.select('#chess_board')
                  .fields({
                        id: true,
                        node: true,
                        size: true
                  })
                  .exec(this.init.bind(this));
      },
      init(res) {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            //新接口需显示设置画布宽高；
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            ctx.scale(dpr, dpr);
            this.setData({
                  canvas,
                  ctx
            });
            this.canvasDraw();//向画布载入图片的方法
            this.drawChess()
            
            
      },
      canvasDraw() {
            let img = this.data.canvas.createImage();//创建img对象
            //如果需要向canvas里载入多张图片，则需要分别创建多个img对象
            //let img2=this.data.canvas.createImage()；
            //    img2.οnlοad=()=>{};
            //    img2.src="";

            img.onload = () => {
                 //img.complete表示图片是否加载完成，结果返回true和false;
                  this.data.ctx.drawImage(img, 0, 0, this.data.canvas._width, this.data.canvas._height);
            };
            img.src = this.data.chessBoard_url;
            this.data.chessBlockWidth = this.data.canvasWidth / 9
            this.data.chessBlockHeight = this.data.canvasHeight / 9
      },
      /**
       * 绘制棋子
       * 定义：1 为 刀,2 为 蛛, 3 为 卫, 4 为 哨, 5 为 兵, 6 为 蟹, 7 为 枪, 8 为神 
       *      0  为 空 9 为障碍物 
       * @author qing
       * @code by 2020/10/22
       */
      drawChess(){
            const allChess = 396
            const dao = 449
            //特此说明 userpos ， 渲染棋子时，我需要宽度 从 0 开始计算加载，高度从 9分7
            let userPos = 7
            //初始化二维数组保存全局棋子位置
            for(let i = 0;i < 9;i++){
                  this.data.globalArray[i] = new Array(9)
                  this.data.globalArray[i].fill(0)
            }
            //初始化用户的二维数组保存布局定位 二维数组的长度为 2
            for(let i = 0;i < 2;i++){
                  this.data.userArray[i] = new Array(9)
            }
            this.data.userArray = [
                  [0,2,0,6,8,0,1,0,0],
                  [0,0,4,0,0,3,7,0,0]
            ]
            this.data.globalArray[7] = this.data.userArray[0]
            this.data.globalArray[8] = this.data.userArray[1]
            console.log(this.data.globalArray)
            //userArray draw chess
            let userChessImg = this.data.canvas.createImage()
            userChessImg.onload = ()=>{
                  for(var i = 0;i < 2;i++){
                        for(var j = 0;j < 9;j++){
                              if(this.data.userArray[i][j] == 0) continue;
                              if(this.data.userArray[i][j] == 1){
                                    this.data.ctx.drawImage(userChessImg,this.data.chessPos[1][0],this.data.chessPos[1][1],dao,dao,this.data.canvas._width / 9 * j,this.data.canvas._height / 9 * (i+userPos),this.data.canvas._width / 9 ,this.data.canvas._height / 9)
                              }else if(this.data.userArray[i][j] == 2){
                                    this.data.ctx.drawImage(userChessImg,this.data.chessPos[2][0],this.data.chessPos[2][1],allChess,allChess,this.data.canvas._width / 9 * j,this.data.canvas._height / 9 * (i+userPos),this.data.canvas._width / 9 - 1,this.data.canvas._height / 9 - 1)
                              }else if(this.data.userArray[i][j] == 3){
                                    this.data.ctx.drawImage(userChessImg,this.data.chessPos[3][0],this.data.chessPos[3][1],allChess,allChess,this.data.canvas._width / 9 * j,this.data.canvas._height / 9 * (i+userPos),this.data.canvas._width / 9 - 1,this.data.canvas._height / 9 - 1)
                              }else if(this.data.userArray[i][j] == 4){
                                    this.data.ctx.drawImage(userChessImg,this.data.chessPos[4][0],this.data.chessPos[4][1],allChess,allChess,this.data.canvas._width / 9 * j,this.data.canvas._height / 9 * (i+userPos),this.data.canvas._width / 9 - 1,this.data.canvas._height / 9 - 1)
                              }else if(this.data.userArray[i][j] == 5){
                                    this.data.ctx.drawImage(userChessImg,this.data.chessPos[5][0],this.data.chessPos[5][1],allChess,allChess,this.data.canvas._width / 9 * j,this.data.canvas._height / 9 * (i+userPos),this.data.canvas._width / 9 - 1,this.data.canvas._height / 9 - 1)
                              }else if(this.data.userArray[i][j] == 6){
                                    this.data.ctx.drawImage(userChessImg,this.data.chessPos[6][0],this.data.chessPos[6][1],allChess,allChess,this.data.canvas._width / 9 * j,this.data.canvas._height / 9 * (i+userPos),this.data.canvas._width / 9 - 1,this.data.canvas._height / 9 - 1)
                              }else if(this.data.userArray[i][j] == 7){
                                    this.data.ctx.drawImage(userChessImg,this.data.chessPos[7][0],this.data.chessPos[7][1],allChess,allChess,this.data.canvas._width / 9 * j,this.data.canvas._height / 9 * (i+userPos),this.data.canvas._width / 9 - 1,this.data.canvas._height / 9 - 1)
                              }else if(this.data.userArray[i][j] == 8){
                                    this.data.ctx.drawImage(userChessImg,this.data.chessPos[8][0],this.data.chessPos[8][1],allChess,allChess,this.data.canvas._width / 9 * j,this.data.canvas._height / 9 * (i+userPos),this.data.canvas._width / 9 - 1,this.data.canvas._height / 9 - 1)
                              }
                              
                        }
                  }
                  
                  
            } 
            userChessImg.src = '../../images/blackChess.png'

      },
      /**
       * 此函数用于获取信息  并 赋值 元素 
       */
      async getChessInfo(){
            
      },
      /**
       * 棋子移动规则
       * 点击画布 获取 坐标 ，检测该范围 判定该棋子兵种 同时设定选中状态
       * 再次点击 表示移动，同样得先检测。
       * 选中棋子时，给他添加棋子的移动的距离 标记
       * @author qing
       * @code by 2020/10/22
       * @param 鼠标点击事件的属性
       */
      chessMove(e){
            var event = event || e;
            let chessDefined = 0
            var mouseX = event.detail.x - 20
            var mouseY = event.detail.y - 80
            if(this.data.selectStatus == 'notSelected'){
                  if(this.isChess(mouseX,mouseY,this.data.selectStatus)){
                        chessDefined = this.judgeChess()
                        this.selectAlert(chessDefined)
                        this.data.selectStatus = 'selected'
                  }else{
                        this.data.selectStatus = 'notSelected'
                        return;
                  }
            }else{
                  chessDefined = this.judgeChess()
                  this.isChess(mouseX,mouseY,this.data.selectStatus)
                  if(this.chessMoveRules(chessDefined)){
                        this.showChessMove(chessDefined)
                  }
                  this.data.selectStatus = 'notSelected'
                  this.recoveryAlert()
            }
            
      },
      /**
       * 判断当前位置是否是棋子 无需边界条件，因为只在点击画布有点击事件。
       * @author qing
       * @code by 2020/10/23
       * @param 鼠标点击的距离画布左边缘的宽度,鼠标点击的距离画布上边缘的高度,当前位置的棋   * 子状态
       */
      isChess(x,y,status){
            for(var i = 0;i < 9;i++){
                  if(this.data.chessBlockWidth * i < x && x <this.data.chessBlockWidth * (i+1)){
                        if(status == 'notSelected'){
                              this.data.lastChessX = i
                        }else{
                              this.data.chessX = i;
                        }
                        break;
                  }
            }
            for(var j = 0;j < 9;j++){
                  if(this.data.chessBlockHeight * j < y && y < this.data.chessBlockHeight * (j+1)){
                        if(status == 'notSelected'){
                              this.data.lastChessY = j
                        }else{
                              this.data.chessY = j
                        }
                       break; 
                  }
            }
            if(this.data.globalArray[this.data.lastChessY][this.data.lastChessX] == 0){
                  return false
            }
            return true
      },
      /**
       * 判断是什么棋子
       * @author qing
       * @code by 2020/10/24
       */
      judgeChess(){
            let res = this.data.globalArray[this.data.lastChessY][this.data.lastChessX]
            if(res != 0){
                  return res
            }else{
                  return 0
            }
      },
      /**
       * 棋子移动规则
       * @author qing
       * @code by 2020/10/24
       * @param 棋子定义的属性
       */
      chessMoveRules(chessDefined){
            let xDiff = Math.abs(this.data.chessX - this.data.lastChessX)
            let yDiff = Math.abs(this.data.chessY - this.data.lastChessY)
            if(chessDefined == 1){ //刀
                  if(xDiff <= 2 && yDiff == 0){
                        return true
                  }else if(yDiff <= 2 && xDiff == 0){
                        return true
                  }else{
                        this.data.selectStatus = 'notSelected'
                        return false
                  }
            }else if(chessDefined == 2){ // 蛛
                  if(xDiff == 1 && yDiff == 0){
                        return true
                  }else if(yDiff == 1 && xDiff == 0){
                        return true
                  }else if(yDiff <= 2 && xDiff <= 2 && xDiff == yDiff){
                        return true
                  }else{
                        this.data.selectStatus = 'notSelected'
                        return false
                  }
            }else if(chessDefined == 3){ //卫 不可移动 只可 布局放置
                  this.data.selectStatus = 'notSelected'
                  return false
            }else if(chessDefined == 4){ // 哨
                  if(xDiff == 1 && yDiff == 0){
                        return true
                  }else if(yDiff == 1 && xDiff == 0){
                        return true
                  }else{
                        this.data.selectStatus = 'notSelected'
                        return false
                  }
            }else if(chessDefined == 5){
                  if(xDiff == 1 && yDiff == 0){
                        return true
                  }else if(yDiff == 1 && xDiff == 0){
                        return true
                  }else if(xDiff == 1 && yDiff == 1){
                        return true
                  }else{
                        this.data.selectStatus = 'notSelected'
                        return false
                  }
            }else if(chessDefined == 6){
                  if(xDiff == 0 && yDiff == 1){
                        return true
                  }else if(yDiff == 0){
                        return true
                  }else{
                        this.data.selectStatus = 'notSelected'
                        return false
                  }
            }else if(chessDefined == 7){
                  if(xDiff == 1 && yDiff == 0){
                        return true
                  }else if(xDiff == 0 && this.data.lastChessY - this.data.chessY >= 1){
                        return true
                  }else{
                        this.data.selectStatus = 'notSelected'
                        return false
                  }
            }else if(chessDefined == 8){
                  if(xDiff <= 3 && yDiff <= 3 && xDiff == yDiff){
                        return true
                  }else if(xDiff <= 3 && yDiff == 0){
                        return true
                  }else if(xDiff == 0 && yDiff <= 3){
                        return true
                  }else{
                        this.data.selectStatus = 'notSelected'
                        return false 
                  }
            }
            // 5 为 兵, 6 为 蟹, 7 为 枪, 8 为神 
      },
      /**
       * 棋子移动 画布渲染逻辑 需要判定 落点位置是否有友军棋子存在
       * 
       * @author qing
       * @code by 2020/10/26
       * @param 棋子定义的属性
       */
      showChessMove(chessDefined){
            if(this.data.globalArray[this.data.chessY][this.data.chessX] != 0){
                  return;
            }
            let chessPx = chessDefined == 1 ? 449:396
            let chessX = this.data.canvas._width / 9 * this.data.lastChessX
            let chessY = this.data.canvas._height / 9 * this.data.lastChessY
            let moveX = this.data.canvas._width / 9 * this.data.chessX
            let moveY = this.data.canvas._height / 9 * this.data.chessY
            let canvasX = 319 / 9 * this.data.lastChessX
            let canvasY = 319 / 9 * this.data.lastChessY
            let blockWidth = this.data.canvas._width / 9
            let blockHeight = this.data.canvas._height / 9
            let bgImg = this.data.canvas.createImage()
            // this.data.ctx.clearRect(chessX,chessY,blockWidth,blockHeight)
            // + 0.5  + 0.3 主要为了做调整  主要还是图 太垃圾了
            bgImg.onload = () =>{
                  this.data.ctx.drawImage(bgImg,canvasX,canvasY ,36,36,chessX,chessY,blockWidth + 0.5,blockHeight + 0.3)
            }
            bgImg.src = this.data.chessBoard_url
            let curImg = this.data.canvas.createImage()
            curImg.onload = () =>{
                  this.data.ctx.drawImage(curImg,this.data.chessPos[chessDefined][0],this.data.chessPos[chessDefined][1],chessPx,chessPx,moveX,moveY,blockWidth - 1,blockHeight -1)
            }
            curImg.src = '../../images/blackChess.png'            
            //将之前存储的数组清0  移动后的坐标 存储数组中的相应位置
            this.data.globalArray[this.data.lastChessY][this.data.lastChessX] = 0
            this.data.globalArray[this.data.chessY][this.data.chessX] = chessDefined
      },
      /**
       *  棋子为选中状态时，对用户的提示 
       *  通过一个 二维 数组 记录 需要渲染提示的  位置
       *  需要考虑边界问题 ，及 友军棋子不必渲染 
       * @author qing
       * @code by 2020/10/27
       * @param 棋子定义的属性
       */
      selectAlert(chessDefined){
            let res = []
            if(chessDefined == 1){
                  res = this.rowSelectAlert(2)
                  res = res.concat(this.colSelectAlert(2))
                  this.drawAlert(res)
                  this.data.arcPos = res
            }else if(chessDefined == 2){
                  res = this.rowSelectAlert(1)
                  res = res.concat(this.colSelectAlert(1))
                  res = res.concat(this.biasSelectAlert(2))
                  this.drawAlert(res)
                  this.data.arcPos = res
            }else if(chessDefined == 3){
                  return;
            }else if(chessDefined == 4){
                  res = this.rowSelectAlert(1)
                  res = res.concat(this.colSelectAlert(1))
                  this.drawAlert(res)
                  this.data.arcPos = res
            }else if(chessDefined == 5){
                  res = this.rowSelectAlert(1)
                  res = res.concat(this.colSelectAlert(1))
                  res = res.concat(this.biasSelectAlert(1))
                  this.drawAlert(res)
                  this.data.arcPos = res
            }else if(chessDefined == 6){
                  res = this.rowSelectAlert(8)
                  res = res.concat(this.colSelectAlert(1))
                  this.drawAlert(res)
                  this.data.arcPos = res
            }else if(chessDefined == 7){
                  res = this.rowSelectAlert(1)
                  let arcPos = []
                  let startY = this.data.lastChessY
                  for(let i = 0;i <= this.data.lastChessY;i++){
                        if(this.data.globalArray[startY][this.data.lastChessX] != 0){
                              startY--
                              continue
                        }
                        arcPos[i] = new Array()
                        arcPos[i][0] = this.data.lastChessX
                        arcPos[i][1] = startY-- 
                  }
                  res = res.concat(arcPos)
                  this.drawAlert(res)
                  this.data.arcPos = res
            }else if(chessDefined == 8){
                  res = this.rowSelectAlert(3)
                  res = res.concat(this.colSelectAlert(3))
                  res = res.concat(this.biasSelectAlert(3))
                  console.log(res)
                  this.drawAlert(res)
                  this.data.arcPos = res
            }
      },
      /**
       * 回收 渲染提示 
       * 当棋子为未选中状态，同时渲染数组存在值的同时 回收之前的提示
       * @author qing
       * @code by 2020/10/29
       */
      recoveryAlert(){
            if(this.data.selectStatus == 'notSelected' && this.data.arcPos != null){
                  let blockWidth = this.data.canvas._width / 9
                  let blockHeight = this.data.canvas._height / 9
                  for(let cur in this.data.arcPos){
                        if(this.data.chessX == this.data.arcPos[cur][0] && this.data.chessY == this.data.arcPos[cur][1]){
                              continue
                        }
                        let bgImg = this.data.canvas.createImage()
                        bgImg.onload = () =>{
                              this.data.ctx.drawImage(bgImg,319 / 9 * this.data.arcPos[cur][0],319 / 9 * this.data.arcPos[cur][1],36,36,this.data.arcPos[cur][0] * blockWidth,this.data.arcPos[cur][1] * blockHeight,blockWidth + 0.5,blockHeight + 0.3)
                        }
                        bgImg.src = '../../images/chessBoard.png'
                  }
            }
      },
      /**
       * 横向渲染
       * @author qing
       * @code by 2020/10/30
       * @param 可移动的步数
       */
      rowSelectAlert(steps){
            let arcPos = []
            let startPointX = this.data.lastChessX - steps
            let endPointX = this.data.lastChessX + steps
            if(startPointX < 0){
                  startPointX = 0
            }
            if(endPointX > 8){
                  endPointX = 8
            }
            let xDiff = endPointX - startPointX
            for(let i = 0;i <= xDiff;i++){
                  if(this.data.globalArray[this.data.lastChessY][startPointX] != 0){
                        startPointX++
                        continue
                  }
                  arcPos[i] = new Array()
                  arcPos[i][0] = startPointX++
                  arcPos[i][1] = this.data.lastChessY
            }
            return arcPos
      },
      /**
       * 竖向渲染
       * @author qing
       * @code by 2020/10/30
       * @param 可移动的步数
       */
      colSelectAlert(steps){
            let arcPos = []
            let startPointY = this.data.lastChessY - steps
            let endPointY = this.data.lastChessY + steps
            if(startPointY < 0){
                  startPointY = 0
            }
            if(endPointY > 8){
                  endPointY = 8
            }
            let yDiff = endPointY - startPointY
            for(let j = 0;j <= yDiff;j++){
                  if(this.data.globalArray[startPointY][this.data.lastChessX] !=0){
                     startPointY++
                     continue   
                  }
                  arcPos[j] = new Array()
                  arcPos[j][0] = this.data.lastChessX
                  arcPos[j][1] = startPointY++
           }
           return arcPos
      },
      /**
       * 斜线渲染
       * @author qing
       * @code by 2020/10/30
       * @param 可移动步数
       */
      biasSelectAlert(steps){
            let arcPos = []
            let downStartPointZ = [this.data.lastChessX - steps,this.data.lastChessY - steps]
            let upStartPointZ = [this.data.lastChessX - steps,this.data.lastChessY + steps]
            let downEndPointZ = [this.data.lastChessX + steps,this.data.lastChessY + steps]
            let upEndPointZ = [this.data.lastChessX + steps,this.data.lastChessY - steps]
            if(downStartPointZ[0] < 0 ){
                  downStartPointZ[1] = downStartPointZ[1] + Math.abs(downStartPointZ[0])
                  downStartPointZ[0] = 0
            }
            if(downStartPointZ[1] < 0){
                  downStartPointZ[0] = downStartPointZ[0] + Math.abs(downStartPointZ[1])
                  downStartPointZ[1] = 0
            }
            if(upStartPointZ[0] < 0){
                  upStartPointZ[1] = upStartPointZ[1] - Math.abs(upStartPointZ[0])
                  upStartPointZ[0] = 0
            }
            if(upStartPointZ[1] > 8){
                  upStartPointZ[0] = upStartPointZ[0] + Math.abs(upStartPointZ[1] - 8)
                  upStartPointZ[1] = 8
            }
            if(downEndPointZ[0] > 8){
                  downEndPointZ[1] = downEndPointZ[1] - Math.abs(downEndPointZ[0] - 8)
                  downEndPointZ[0] = 8
            }
            if(downEndPointZ[1] > 8){
                  downEndPointZ[0] = downEndPointZ[0] - Math.abs(downEndPointZ[1] - 8)
                  downEndPointZ[1] = 8
            }
            if(upEndPointZ[0] > 8){
                  upEndPointZ[1] = upEndPointZ[1] + Math.abs(upEndPointZ[0] - 8)
                  upEndPointZ[0] = 8
            }
            if(upEndPointZ[1] < 0){
                  upEndPointZ[0] = upEndPointZ[0] - Math.abs(upEndPointZ[1])
                  upEndPointZ[1] = 0
            }
            //只需一个元素即可 数据已经经过处理
            let downDiff = downEndPointZ[0] - downStartPointZ[0] 
            let upDiff = upEndPointZ[0] - upStartPointZ[0]
            for(let i = 0;i <= downDiff;i++){
                  if(this.data.globalArray[downStartPointZ[1]][downStartPointZ[0]] != 0){
                        if(downStartPointZ[0] < 8 && downStartPointZ[1] < 8){
                              downStartPointZ[0]++
                              downStartPointZ[1]++
                        }
                        continue     
                  }
                  arcPos[i] = new Array()
                  arcPos[i][0] = downStartPointZ[0]++
                  arcPos[i][1] = downStartPointZ[1]++
            }
            let secondStart = arcPos.length
            for(let i = secondStart;i <= upDiff + secondStart;i++){
                  if(this.data.globalArray[upStartPointZ[1]][upStartPointZ[0]] != 0){
                        if(upStartPointZ[0] < 8 && upStartPointZ[1] > 0){
                              upStartPointZ[0]++
                              upStartPointZ[1]--
                        }
                        continue
                  }
                  arcPos[i] = new Array()
                  arcPos[i][0] = upStartPointZ[0]++
                  arcPos[i][1] = upStartPointZ[1]--
            }
            return arcPos
      },
      /**
       *  根据arcPos绘制渲染区域
       *  @author qing
       *  @code by 2020/10/30
       *  @param arcPos数组
       */
      drawAlert(arcPos){
            let width = this.data.canvas._width / 9
            let height = this.data.canvas._height / 9
            if(arcPos != null){
                  for(let drawArr in arcPos){ 
                        let x = arcPos[drawArr][0]
                        let y = arcPos[drawArr][1]
                         this.data.ctx.beginPath()
                         this.data.ctx.arc(width * x + width / 2,height * y + height / 2,5,0,2 * Math.PI)
                         this.data.ctx.fillStyle = '#99ccff'
                         this.data.ctx.fill()
                  }
            }
      }
})