//app.js
App({
  onLaunch: function () {
    this.globalData.myDevice = wx.getSystemInfoSync()
  },
  globalData: {
    myDevice: null
  }
})