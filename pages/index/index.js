//index.js
//获取应用实例
const app = getApp()

Page({
  onTap: function (event) {
    wx.navigateTo({
      url: '../read/read',
    })
  }
})
 