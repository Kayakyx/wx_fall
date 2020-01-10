// pages/newYear/newYear.js

const W = wx.getSystemInfoSync().windowWidth;
const H = wx.getSystemInfoSync().windowHeight;

// const snowImage = '/resource/imgs/white-snowflake.png';
const newYearImgs = ['/resource/year/xin.png', '/resource/year/nian.png', '/resource/year/kuai.png', '/resource/year/le.png'];


// 存储所有的雪花 实例
const snows = [];

// 每秒多上帧
const fps = 60;
// 下落的加速度
const G = 0.01;
// const G = 0.05;
// 速度上限，避免速度过快
const SPEED_LIMIT_X = 1;
const SPEED_LIMIT_Y = 1;
// const SPEED_LIMIT_Y = 10;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasHeight: 0
  },
  //点透canvas   pointer-events: none;
  handleTap(){
    console.log('点透canvas');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let ctx = null;


    let tickCount = 150;  //雪花生成的阈值， 当 ticker 的值 > tickCount 时 生成一个 雪花 实例
    let ticker = 0;      // 控制 一个雪花 生成 初始值
    let deltaTime = 0;   // 每次执行 loop函数的 增量 

    function createCanvas() {
      // canvas = document.createElement('canvas');
      // ctx = canvas.getContext('2d');
      ctx = wx.createCanvasContext('myCanvas');
    }

    function init() {
      createCanvas();
      // 小屏幕时延长添加雪花时间，避免屏幕上出现太多的雪花
      if (W < 768) {
        tickCount = 350;
      }
      loop();
    }

    // 请求帧动画 实现循环生成 雪花实例  IIFE   必须在 init方法 调用之前
    let requestAnimationFrame = (function() {
      return function (callback) {
        setTimeout(callback, 1000/ fps);
      }
    })();


    init();
    console.log(ctx, 'ctx');

    // ctx.translate(0, 0);
    // ctx.drawImage(snowImage, 300, 0, 20, 20);
    // ctx.draw()

    // 构造函数  飘雪构造函数
    /*
      @params x 飘落图片 相对于 canvas 画布左上角 x坐标
      @params y 飘落图片 相对于 canvas 画布左上角 y坐标
    */
    function Snow(x, y, radius) {
      // 每个图案的实例的
      this.x = x;     // x坐标
      this.y = y;     // y坐标
     
      this.sx = 0;    // 上一帧和下一帧 x 轴方向 偏移量(初始化)
      this.sy = 0;    // 上一帧和下一帧 y 轴方向 偏移量(初始化)  sy 偏移量会随着 下落递增 存在加速度G
      this.deg = 0;   // 旋转角度 (初始化)
      this.radius = radius;  // 半径
      this.ax = Math.random() < 0.5 ? 0.005 : -0.005; // 初始化 x 轴的方向  正 向右飘  负 向左飘   0.005 x轴上的运动增量 相当于 y 轴上的 G
      
      this.name = Math.floor( Math.random() * 4 ); //随机获取  新 年 快 乐 中的 任意一张图
    }

    Snow.prototype.draw = function() {
      const radius = this.radius;
      ctx.save();  //保存绘图上下文
      ctx.translate(this.x, this.y);  //对当前坐标系的原点 (0, 0) 进行变换。默认的坐标系原点为页面左上角。

      ctx.rotate(this.deg * Math.PI / 180); //旋转度数
      /**
       drawImage(imageResource, dx, dy, dWidth, dHeight)
        number dx
        imageResource的左上角在目标 canvas 上 x 轴的位置

        number dy
        imageResource的左上角在目标 canvas 上 y 轴的位置

        number dWidth
        在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放

        number dHeight
        在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放
       */
      // console.log(radius, '半径');
      // ctx.drawImage(snowImage, -radius, radius * 1.8, radius * 2, radius * 2);  
      // ctx.drawImage(snowImage, 0, 0, radius * 2, radius * 2);  
      //随机获取  新 年 快 乐 中的 任意一张图
      const index = Math.floor( Math.random() * 4 );
      ctx.drawImage(newYearImgs[this.name], -radius, radius * 1.8, radius * 2, radius * 2);  

      ctx.restore();  //恢复之前保存的绘图上下文
    }

    // 飘落  动起来
    Snow.prototype.update = function() {
      //随机雪花运动过程中的 角度变化
      const deltaDeg = Math.random() * 0.6 + 0.2;   
  
      this.sx += this.ax; 

      //当x轴方向的加速度达到 速度上线时 进行反向运动
      if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
        this.ax *= -1;
      }
      
      if (this.sy < SPEED_LIMIT_Y) {  //下落速度 为达到速度上线，进行加速度
        this.sy += G;
      }
  
      this.deg += deltaDeg;
      this.x += this.sx;
      this.y += this.sy;

    }


/*
     // 生成雪花实例
     for(let i = 0; i < 10; i++){
      snows.push(
        // new Snow(Math.random() * W, 0, Math.random() * 5 + 5)
        new Snow(Math.random() * W, 0, Math.random() * 5 + 5)
      );
     }
     //绘制到画布上
     snows.map(function(s, i) {
        console.log(s, '每个实例');   
        s.draw();
    });
    ctx.draw();
*/


    //重复生成 雪花实力 函数
    function loop() {
      requestAnimationFrame(loop);  //回调 loop 函数
  
      ctx.clearRect(0, 0, W, H);  // 清空画布
      
      // const now = Date.now();
      deltaTime = 23;  // 每次 执行 loop 函数的 时间增量 
      // lastTime = now;
      ticker += deltaTime;
  
      if (ticker > tickCount) {
        snows.push(
          // new Snow(Math.random() * W, 0, Math.random() * 5 + 5)
          new Snow(Math.random() * W, 0, Math.random() * 5 + 10)
          // new Snow(Math.random() * W, Math.random() * H, Math.random() * 5 + 5)
        );
        ticker %= tickCount;
      }
  
      // const length = snows.length;
      snows.map(function(s, i) {
        s.update();
        s.draw();
        //飘出 屏幕底部 的 实例 移除
        if (s.y >= H) {
          snows.splice(i, 1);
        }
      });
      // 绘制
      ctx.draw();
      console.log('实例', snows[0]);
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      canvasHeight: H
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})