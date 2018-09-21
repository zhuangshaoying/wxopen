//app.js
var aldstat = require('/utils/ald-stat.js')
var util = require('/utils/util.js')

App({
  onLaunch: function () {
    var that = this;
    that.globalData.token = wx.getStorageSync('app.globalData.token') || null;
    that.globalData.uid = wx.getStorageSync('app.globalData.uid') || 0;
    this.login();
  },
  login: function () {
    var that = this;
    var token = that.globalData.token;
    if (token) {

      var url = that.globalData.baseUrl+ "/Wx/checktoken";
      var dataInfo = {
        token: token
      }
      util.HttpPost(url, "", dataInfo, function (response) {
        try {
          if (res.code != 200) {
            that.globalData.token = null;
            that.login();
          }          
        } catch (e) {
        }
      });

      return;
    }
    wx.login({
      success: function (res) {
        var url = that.globalData.baseUrl + "/Wx/login";
        var dataInfo = {
          code: res.code
        }
        util.HttpPost(url,"", dataInfo, function (res) {
          if (res.code == 403) {
            // 去注册
           that.registerUser();
            return;
          }
          if (res.code != 200) {
            // 登录错误        
            wx.showModal({
              title: '提示',
              content: '无法登录，请重试',
              showCancel: false
            })
            return;
          }
          //console.log(res.data.data)
          that.globalData.token = res.data.token;
          wx.setStorageSync('app.globalData.token', res.data.token);
          that.globalData.uid = res.data.uid;
          wx.setStorageSync('app.globalData.uid', res.data.uid);
  
        });
      }
    })
  },
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口   
            var url = that.globalData.baseUrl + "/Wx/register";
            var dataInfo = {
              code: code, encryptedData: encryptedData, iv: iv
            }
            util.HttpPost(url, "", dataInfo, function (res) {             
              if (res.code == 200) {
               
                that.login();
            
              }else{             
                wx.showModal({
                  title: '提示',
                  content: '无法登录，请重试',
                  showCancel: false
                })
              }
            
            });

          }
        })
      }
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登陆接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }

  },
  globalData: {
    userInfo: null,  
    token: null,
    uid:0,
    baseUrl:"https://api.xmasn.com/api"
  }

})
