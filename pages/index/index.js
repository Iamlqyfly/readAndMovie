//index.js
//获取应用实例
const app = getApp()

Page({
  onTap: function (event) {
    wx.switchTab({
      url: '../read/read',
    })
  }
})
 