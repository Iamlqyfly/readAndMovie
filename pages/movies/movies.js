// pages/movie/movie.js
Page({
  data: {
    searchPanelShow: false, // 控制X按钮的显示与隐藏

  },
  onLoad: function () {

  },

  onBindFocus: function () {
    this.setData({
      // containerShow: false,
      searchPanelShow: true
    })
  },
  onBindBlur: function () {
    this.setData({
      // containerShow: false,
      searchPanelShow: false
    })
  },
  onCancelImgTap: function () {},
})