var app = getApp();
var util = require('../../utils/util.js')

var Grid = require('./grid.js');
var Tile = require('./tile.js');
var GameManager = require('./game_manager.js');

var config = {
    data: {
        hidden: false,
        enabled: true,
        txtenabled: false,
        rankenabled: false,
        adsList: [],
        imgUrls: [],
        scoreD: [],
        scoreM: [],
        scoreAll: [],
        // 数据可以通过参数控制
        grids: [],
        over: false,
        win: false,
        score: 0,
        highscore: 0,
        overMsg: '游戏结束',   
        users: null,
        usersCount: null,
        tap: 1,  
    },
    onLoad: function() {
    
    
        this.GameManager = new GameManager(4);
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        wx.setStorageSync('begingametime', timestamp);    

        this.setData({
            grids: this.GameManager.setup(),
            highscore: wx.getStorageSync('highscore') || 0
        });

    },
    onReady: function() {
        var that = this;
        //console.log(app.globalData.token);
       that.GetAdsList();
      // that.GetRankList(1);
     //  console.log(that.data.scoreD);
      // that.GetRankList(2);
     //  console.log(that.data.scoreM);
       //that.GetRankList(3);
     //  console.log(that.data.scoreAll);
        // 页面渲染完毕隐藏loading
        that.setData({
          hidden: true,          
          imgUrls: [
                '/images/201802082.jpg'                
              ]
          
        });
    },
    onShow: function() {
        // 页面展示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
  onShareAppMessage: function () {
    return {
      title: '小试牛刀，不服来战',
      desc: '合并这些数字方块，你能拿到2048吗？',
      path: '/pages/2048/2048'
    }
  },
  detail: function (event) {
 
    wx.navigateToMiniProgram({
      appId: event.target.dataset.appid,
      path: event.target.dataset.linkurl,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })

},
    // 更新视图数据
    updateView: function(data) {
        // 游戏结束
        if(data.over){
            data.overMsg = '游戏结束';
        }

        // 获胜
        if(data.win){
            data.overMsg = '恭喜';
        }

        //结束或获胜 上传记录
        if (data.score > 0 && app.globalData.token && (data.over)) {

          var url = app.globalData.baseUrl + "/Wx/AddGameScore";
          var dataInfo = {
            score: data.score,
            token: app.globalData.token,
            GameTime: wx.getStorageSync('begingametime') || 0
          }
          util.HttpPost(url, "", dataInfo, function (res) {
            if (res.code == 200) {

            }
          });
        }
     
        this.setData(data);
    },

    //切换tab
    changeTap: function (e) {
      var that = this;
      var tap = e.currentTarget.dataset.tap;
      console.log(e.currentTarget.dataset.tap);
      that.setData({
        tap: tap
      });
      //pageIndex = 1;
      //GetList(this);
    },

    // 重新开始
    restart: function() {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;  
      wx.setStorageSync('begingametime', timestamp);
      
        this.updateView({
            grids: this.GameManager.restart(),
            over: false,
            won: false,
            score: 0
        });
    },
    // 
    rank: function () {
      wx.navigateTo({
        url: '../2048/rank'
      })
    },
    touchStartClienX: 0,
    touchStartClientY: 0,
    touchEndClientX: 0,
    touchEndClientY: 0,
    isMultiple: false, // 多手指操作

    touchStart: function(events) {

        // 多指操作
        this.isMultiple = events.touches.length > 1;
        if (this.isMultiple) {
            return;
        }

        var touch = events.touches[0];

        this.touchStartClientX = touch.clientX;
        this.touchStartClientY = touch.clientY;

    },

    touchMove: function(events) {
        var touch = events.touches[0];
        this.touchEndClientX = touch.clientX;
        this.touchEndClientY = touch.clientY;
    },

    touchEnd: function(events) {
        if (this.isMultiple) {
            return;
        }

        var dx = this.touchEndClientX - this.touchStartClientX;
        var absDx = Math.abs(dx);
        var dy = this.touchEndClientY - this.touchStartClientY;
        var absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
            var direction = absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);

            var data = this.GameManager.move(direction) || {
                grids: this.data.grids,
                over: this.data.over,
                won: this.data.won,
                score: this.data.score
            };

            var highscore = wx.getStorageSync('highscore') || 0;
            if(data.score > highscore){
                wx.setStorageSync('highscore', data.score);
            }

            this.updateView({
                grids: data.grids,
                over: data.over,
                won: data.won,
                score: data.score,
                highscore: Math.max(highscore, data.score)
            });

        }

    },
    tuodong:function(){
     
    },
    GetAdsList: function () {
      var that = this;
      //加载轮播图
      var url = app.globalData.baseUrl + "/Wx/GetAds";
      var dataInfo = {
        
      }
      util.HttpGet(url, "", dataInfo, function (res) {
      
        if (res.code == 200) {

          that.setData({
            adsList: that.data.adsList.concat(res.data.ads),
              // enabled: true,
          enabled: res.data.newenabled,
           //   txtenabled: false,
           txtenabled: res.data.newinfoenabled,
            //  rankenabled: true,
          rankenabled: res.data.rankenabled
          })

        } 
      });

    },
    GetRankList: function (type1) {
      var that = this;
   
      var url = app.globalData.baseUrl + "/Wx/GetScoreRank";
      var dataInfo = {
        type:type1
      }
      util.HttpGet(url, "", dataInfo, function (res) {

        if (res.code == 200) {

         
          if (type1==1)
            {
            that.setData({ scoreD: res.data.ranks});
            console.log("D"+that.data.scoreD);
            } else if (type1 == 2)    
            {
            that.setData({ scoreM: res.data.ranks });
            console.log("m "+that.data.scoreM);
          } else if (type1 == 3)
            {
            that.setData({ scoreALL: res.data.ranks});
            console.log(that.data.scoreALL);
            }    
         

        }
      });

    },
};

Page(config);
