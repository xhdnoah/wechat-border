//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    ratio: 0,
    motto: "边框",
    canW: 0,
    imgSrc: "",
    hidden: true,
    windowWidth: 0,
    windowHeight: 0,
    imgW: 0,
    imgH: 0,
    allColor: [
      { color: "#ffffff", name: "White" },
      { color: "#000000", name: "Black" },
      { color: "#D3D3D3", name: "Light Grey" },
      { color: "#A9A9A9", name: "Dark Grey" },
      { color: "#FFFF00", name: "Yellow" },
      { color: "#FF7F50", name: "Coral" },
      { color: "#FF4500", name: "Orange" },
      { color: "#aaf0d1", name: "Mint" },
      { color: "#00FF00", name: "Lime" },
      { color: "#008000", name: "Green" },
      { color: "#6D9BC3", name: "Cerulean" },
      { color: "#26619c", name: "Lapis" },
      { color: "#0000FF", name: "Blue" },
      { color: "#800080", name: "Purple" },
      { color: "#FFC0CB", name: "Pink" },
      { color: "#FF7F50", name: "Coral" },
      { color: "#FF0000", name: "Red" }
    ],
    chooseColor: { color: "#ffffff", name: "White" },
    hasUserInfo: false
  },
  onLoad: function() {
    var self = this;
    self.device = app.globalData.myDevice;
    this.setData({
      windowWidth: self.device.windowWidth,
      windowHeight: self.device.windowHeight,
      ratio: 750 / self.device.windowWidth,
      canW: self.device.windowWidth
    });
  },
  chooseImg: function() {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: "origin",
      success: res => {
        let imgUrl = res.tempFilePaths[0];
        wx.getImageInfo({
          src: imgUrl,
          success: data => {
            let imgW = data.width;
            let imgH = data.height;
            self.setData({
              imgW: imgW,
              imgH: imgH,
              imgSrc: imgUrl
            });
            self.createCanvas(imgUrl, imgW, imgH, self.data.canW, self.data.ratio);
          }
        });
        self.setData({
          hidden: false,
          imgSrc: imgUrl
        });
      },
      fail: function(res) {
        self.setData({
          hidden: true
        });
      }
    });
  },
  createCanvas: function(imgUrl, imgW, imgH, canW, ratio) {
    let ctx = wx.createCanvasContext("borderCanvas");
    let dWidth = 0;
    let dHeight = 0;
    if (imgW > imgH) {
        dWidth = canW * (1 - ratio / 24);
        dHeight = imgH / (imgW / dWidth);
    } else {
        dHeight = canW * (1 - ratio/24);
        dWidth = imgW / (imgH / dHeight);
      }
    
    const dx = (dWidth - canW) / 2;
    const dy = (dHeight - canW) / 2;
    console.log(dx, dy, imgW, imgH, dWidth, dHeight, ratio);
    ctx.setFillStyle(this.data.chooseColor.color);
    ctx.fillRect(0, 0, canW, canW);
    ctx.drawImage(imgUrl, -dx, -dy, dWidth, dHeight);
    ctx.draw();
  },
  borderSizeChange(e) {
    this.setData({
      ratio: e.detail.value
    })
    if(this.data.hidden === false){
      this.createCanvas(
        this.data.imgSrc,
        this.data.imgW,
        this.data.imgH,
        this.data.canW,
        this.data.ratio
      );
    }
  },
  saveImg() {
    var that = this
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: "borderCanvas",
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: data => {
              wx.showModal({
                content: "图片已保存至相册",
                showCancel: true,
                confirmText: "好的",
                confirmColor: "#72B9C3",
              });
            }
          });
        }
      });
    }, 300);
  },
  colorChange(e) {
    this.setData({
      chooseColor: e.target.dataset.selected
    })
    this.createCanvas(
      this.data.imgSrc,
      this.data.imgW,
      this.data.imgH,
      this.data.canW,
      this.data.ratio
    );
  },
  closeImg(){
    var that = this
    wx.showModal({
      content: "退出编辑",
      showCancel: true,
      confirmText: "是的",
      confirmColor: "#72B9C3",
      success: function (res) {
        if (res.confirm) {
          that.setData({
            hidden: true
          });
        }
      }
    })
  },
  previewImg(){
    wx.canvasToTempFilePath({
      canvasId: 'borderCanvas',
      success: (res) => {
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      }
    })
  }
});
