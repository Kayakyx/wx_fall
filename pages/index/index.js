//index.js
//获取应用实例
const app = getApp()

// 存储所有的雪花
const snows = [];
  
// 下落的加速度
const G = 0.01;

const fps = 60;

// 速度上限，避免速度过快
const SPEED_LIMIT_X = 1;
const SPEED_LIMIT_Y = 1;

const W = wx.getSystemInfoSync().windowWidth;
const H = wx.getSystemInfoSync().windowHeight;

// const snowImage = './img/snow.png';
const snowImage = './img/white-snowflake.png';
// const imgSrc = './img/snow.png';

const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    canvasHeight: 0,
    days: 0
  },
  //事件处理函数
  // bindViewTap: function() {
  // },
  onLoad: function () {
  
    let tickCount = 150;
    let ticker = 0;
    // let lastTime = Date.now();
    let deltaTime = 0;
  
    // let canvas = null;
    let ctx = null;
    // 请求帧动画 实现循环生成 雪花实例
    let requestAnimationFrame = (function() {
      return function (callback) {
        setTimeout(callback, 1000/ fps);
      }
    })();
    init();
    innerAudioContext.autoplay = true;
    innerAudioContext.loop = true;
    // innerAudioContext.src = 'http://fs.w.kugou.com/201812231746/0d50121f1a9d975b15ba4335a7920e1b/G063/M05/0D/03/H5QEAFbNNoWAWlz8ADi_lVSx8Ls270.mp3';
    innerAudioContext.src = 'https://ip-h5-ra03-sycdn.kuwo.cn/07e74dd3ecd362a8c4435c4d7ea1419c/5c6cbc14/resource/a2/48/96/724780588.aac';
    innerAudioContext.onPlay(() => {
      console.log('开始播放');
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res);
    })

    function init() {
      createCanvas();
      // 小屏幕时延长添加雪花时间，避免屏幕上出现太多的雪花
      if (W < 768) {
        tickCount = 350;
      }
      loop();
    }

    function loop() {
      requestAnimationFrame(loop);
  
      ctx.clearRect(0, 0, W, H);
      
      // const now = Date.now();
      deltaTime = 23;
      // lastTime = now;
      ticker += deltaTime;
  
      if (ticker > tickCount) {
        snows.push(
          new Snow(Math.random() * W, 0, Math.random() * 5 + 5)
        );
        ticker %= tickCount;
      }
  
      // const length = snows.length;
      snows.map(function(s, i) {
        s.update();
        s.draw();
        if (s.y >= H) {
          snows.splice(i, 1);
        }
      });
      ctx.draw();
    }
 
    function Snow(x, y, radius) {
      this.x = x;
      this.y = y;
      this.sx = 0;
      this.sy = 0;
      this.deg = 0;
      this.radius = radius;
      this.ax = Math.random() < 0.5 ? 0.005 : -0.005;
    }
 
    Snow.prototype.update = function() {
      const deltaDeg = Math.random() * 0.6 + 0.2;
  
      this.sx += this.ax;
      if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
        this.ax *= -1;
      }
  
      if (this.sy < SPEED_LIMIT_Y) {
        this.sy += G;
      }
  
      this.deg += deltaDeg;
      this.x += this.sx;
      this.y += this.sy;
    }
 
    Snow.prototype.draw = function() {
      const radius = this.radius;
      ctx.save();  //保存绘图上下文
      ctx.translate(this.x, this.y);
      ctx.rotate(this.deg * Math.PI / 180);
      ctx.drawImage(snowImage, -radius, -radius * 1.8, radius * 2, radius * 2);
      ctx.restore();  //恢复之前保存的绘图上下文
    }
 
    function createCanvas() {
      // canvas = document.createElement('canvas');
      // ctx = canvas.getContext('2d');
      ctx = wx.createCanvasContext('myCanvas');
    }
  },
  onShow: function () {
    this.setData({
      canvasHeight: H
    })
     
    var thatDay = new Date('2019/02/08');
    var now = new Date();
    this.setData({
      days: Math.floor((now - thatDay)/3600/1000/24)
    })
    innerAudioContext.play();
  }
})
