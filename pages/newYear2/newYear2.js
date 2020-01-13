// pages/newYear2/newYear2.js
var fall = require('../../utils/fall.js');
const W = wx.getSystemInfoSync().windowWidth;
const H = wx.getSystemInfoSync().windowHeight;
const newYearImgs = ['/resource/year/xin.png', '/resource/year/nian.png', '/resource/year/kuai.png', '/resource/year/le.png'];
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
    let ctx = wx.createCanvasContext('myCanvas');
    fall(ctx, W, H, newYearImgs, {
      // duration: 15,
      G: 2
    });
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