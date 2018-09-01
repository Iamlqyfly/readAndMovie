// pages/read/read-detail/read-detail.js
var postData = require('../../../data.js')
var app = getApp() //从app.js中取得全局变量值
Page({
  data: {
    isPlayingMusic: false,
    collected: true
  },
  onLoad: function(option) {
    var postId = option.id;
    this.data.currentPostId = postId;
    // 如果在onLoad方法中、不是异步的去执行一个数据绑定 则不需要使用this.setData方法，只需要this.data赋值即可实现数据绑定
    //异步可能存在着onload函数里面最后一行代码还未执行，onLoad函数就已经执行完毕
    this.setData({
      postData: postData.postList[postId]
    })
    //    var postCollectedList = {
    //        1: true,

    //        3: false
    //    }
    var postCollectedList = wx.getStorageInfoSync('postCollectedList') //所有缓存
    if (postCollectedList) {
      var postCollected = postCollectedList[postId] //当前缓存的其中一个数据值
      if (!postCollected) {
        postCollectedList[postId] = false
        //更新缓存数据
        wx.setStorageSync('postCollectedList', postCollectedList)
      } else {
        this.setData({
          collected: postCollected
        })
      }  
    } else {
      var postCollectedList = {}
      postCollectedList[postId] = false
      //更新缓存数据
      wx.setStorageSync('postCollectedList', postCollectedList)
    }
    // g_isPlayingMusic 控制全局的音乐是否真正播放按钮 g_currentMusicPostId 哪一首歌正在播放按钮 解决音乐播放器同步问题 
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true //控制本页面音乐播放器按钮
      })
    }
    this.setMusicMonitor()
  },
  onCollectionTap: function() {
    this.getPostsCollectedSyc()
  },
  //异步请求
  // getPostsCollectedAsy: function() {
  //   var that = this
  //   wx.getStorage({
  //     key: 'postCollectedList',
  //     success: function(res) {
  //       var postCollectedList = res.data
  //       var postCollected = postCollectedList[that.data.currentPostId]
  //       postCollected = !postCollected //收藏变成未收藏
  //       postCollectedList[that.data.currentPostId] = postCollected
  //       that.showToast(postCollectedList, postCollected)
  //     },
  //   })
  // },
  getPostsCollectedSyc: function() {
    var postCollectedList = wx.getStorageSync('postCollectedList');
    var postCollected = postCollectedList[this.data.currentPostId]; 
    // 收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected;
    postCollectedList[this.data.currentPostId] = postCollected;
    console.log(postCollectedList,1)
    this.showToast(postCollectedList, postCollected);
  },
  setMusicMonitor: function () {
    //点击播放图标和总控开关都会触发这个函数
    var that = this;
    wx.onBackgroundAudioPlay(function (event) {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        // 打开多个read-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
        // 当前页面的postid，只处理当前页面的音乐播放。
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          // 播放当前页面音乐才改变图标
          that.setData({
            isPlayingMusic: true //在页面中控制保存数据状态的
          })
        }
        // if(app.globalData.g_currentMusicPostId == that.data.currentPostId )
        // app.globalData.g_currentMusicPostId = that.data.currentPostId;
      }
      app.globalData.g_isPlayingMusic = true; //全局为false，不需要去改变

    });
  },  
  onMusicTap: function (event){
    var currentPostId = this.data.currentPostId
    // var postData = postData.postList[currentPostId]
    var isPlayingMusic = this.data.isPlayingMusic
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.postList[currentPostId].music.url,
        title: postData.postList[currentPostId].music.title,
        coverImgUrl: postData.postList[currentPostId].music.coverImgUrl,
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
      app.globalData.g_isPlayingMusic = true;
    }

  }, 
  showModal: function(postCollectedList, postCollected) {
    var that = this
    wx.showModal({
      title: '收藏',
      content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postCollectedList)
          // 更新数据绑定变量，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }

    })
  },
  showToast: function(postCollectedList, postCollected) {
    // 更新文章是否的缓存值
    wx.setStorageSync('postCollectedList', postCollectedList);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },
  onShareTap: function(event) {
    wx.showActionSheet({
      itemList: [
        "分享给微信好评",
        "分享到朋友圈",
        "分享到QQ",
        "分享到微博"
      ],
      itemColor: "#405f80",
      success: function(res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      }
    })
  },
  /*
   * 定义页面分享函数
   */
  onShareAppMessage: function(event) {
    return {
      title: '哈哈哈哈',
      desc: '曾经沧海难为水，除却巫山不是云',
      path: '/pages/read/read-detail/read-detail?id=0'
    }
  }

})