var vm = new Vue({
  el: '#app',

  data: {
    commonIp: 'http://www.walmart2019.com/activity-server',
    // commonIp: 'http://192.168.1.104:8080/elantrip-server',
    query: {},
    latitude: '',
    longitude: '',
    banners1: [],
    banners2: [],
    serviceList1: [],
    serviceList2: [],
    showChange: 0,
    shopList: [],
    currentShop: '',
    shopData: {},
    citys: [],
    city: 'default',
    second: parseInt(Math.random() * 5),
    visitId: '',
  },

  mounted: function() {
    this.query = this._urlParse();

    // 获取banner
    this.getBanners();

    // 获取服务列表
    this.getServiceList();

    // 获取经纬度
    // 获取门店列表
    this.getLocation();

    // 初始化计时器
    this.initTimer();

    // ...
    // this._getShooList('31.07332', '121.5166');
  },

  methods: {
    getBanners: function() {
      var dataArgs = {
        pageNum: 1,
        pageSize: 1000,
        keyWords: '',
        activated: 1,
      };

      this.$http.post(this.commonIp + '/banner/getBannerList.do?', dataArgs, {emulateJSON: true}).then(function (res) {
        // ...
        console.log('banners', res);

        this.banners1 = res.body.result.filter(function(banner) {
          return banner.bannerType === 1;
        });

        // 只拿一张
        this.banners2 = res.body.result.filter(function(banner) {
          return banner.bannerType === 2;
        }).slice(0, 1);

        this.$nextTick(function() {
          this._swiperInit();
        });

      }, function () {
        window.alert('server error: getBannerList');
      });
    },

    getServiceList: function() {
      var dataArgs = {
        pageNum: 1,
        pageSize: 1000,
        keyWords: '',
      };

      this.$http.post(this.commonIp + '/serve/getServeList.do?', dataArgs, {emulateJSON: true}).then(function (res) {
        // ...
        console.log('service', res);

        var serviceList = res.body.result;

        this.serviceList1 = serviceList.filter(function(serve) {
          return serve.serveType === 1;
        });

        this.serviceList2 = serviceList.filter(function(serve) {
          return serve.serveType === 2;
        });

      }, function () {
        window.alert('server error: getServeList');
      });
    },

    getLocation: function() {
      var self = this;

      var dataArgs = {
        jsSdk: 'http://app.edaycn.com/api/jssdk/?url=',
        requestUrl: encodeURIComponent(window.location.href.split('#')[0].toString()),
      };

      this.$http.post(this.commonIp + '/visit/getLocation.do?', dataArgs, {emulateJSON: true}).then(function (res) {
        var data = res.body.result;

        // ...
        // console.log(data);

        if (!this._isWx()) {
          this._getShooList('', '');
        }

        wx.config({
          debug : false, // 生产环境需要关闭debug模式
          appId : data.appId, // appId通过微信服务号后台查看
          timestamp : data.timestamp, // 生成签名的时间戳
          nonceStr : data.nonceStr, // 生成签名的随机字符串
          signature : data.signature, // 签名
          jsApiList : ['getLocation'] //需要调用的JS接口列表
        });
      }, function () {
        window.alert('server error: getLocation');
      });

      wx.error(function() {
        window.alert('验证失败!');

        self._getShooList('', '');
      });

      wx.ready(function() {
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180

            // ...
            // self.test = self.latitude + '-' + self.longitude;

            self._getShooList(self.latitude, self.longitude);

            // self.test = self.latitude + ' - ' + self.longitude;
          },
          error: function() {
            self._getShooList('', '');
          }
        })
      });
    },

    initTimer: function () {
      var self = this;

      window.setInterval(function () {
        self.second += 5;

        self.$http.post(self.commonIp + '/visit/modifyVisit.do?', {
          visitId: self.visitId,
          visitDuration: self.second,

        }, {emulateJSON: true}).then(function (res) {}, function () {
          // window.alert('server error: modifyVisit');
        });
      }, 5000);

      /*
      window.addEventListener('beforeunload', function (e) {
        (e || window.event).returnValue = self.wclose(this.second);
      });
      */
    },

    wclose: function(second) {
      var query = this.query;

      var dataArgs = {
        shopId: this.currentShop.shopId,
        dealerCode: query.rybh || '',
        dealerType: query.rylx || '',
        dealerName: query.ryxm || '',
        visitDuration: second,
      };

      this.$http.post(this.commonIp + '/visit/addVisit.do?', dataArgs, {emulateJSON: true}).then(function (res) {}, function () {
        window.alert('server error: addVisit');
      });
    },

    changeShop: function (shop) {
      this.currentShop = shop;
      this.$refs.close.click();
    },

    serviceClick: function(serveId, jumpUrl) {
      var query = this.query;

      var dataArgs = {
        serveId: serveId,
        shopId: this.currentShop.shopId,
        dealerCode: query.rybh || '',
        dealerType: query.rylx || '',
        dealerName: query.ryxm || '',
      };

      this.$http.post('http://www.walmart2019.com:8080/activity-server/serveVisit/addServeVisit.do?', dataArgs, {emulateJSON: true}).then(function (res) {
        window.location.href = this._urlFilter(jumpUrl);
      }, function () {
        // window.alert('server error: addServeVisit');
        window.location.href = this._urlFilter(jumpUrl);
      });
    },

    // 获取门店列表
    _getShooList: function(lat, lng) {
      var self = this;
      var query = this._urlParse();

      var dataArgs = {
        pageNum: 1,
        pageSize: 1000,
        longitude: lng,
        latitude: lat,
		    shopCode: query.mdhm || '',
      };

      this.$http.post(this.commonIp + '/shop/getShopListByLocation.do?', dataArgs, {emulateJSON: true}).then(function (res) {
        // ...
        console.log('shopList', res);

        this.showChange = parseInt(res.body.code);

        self.shopList = res.body.result;
        self.currentShop = this.shopList.length && this.shopList[0];

        self.shopList.map(function(shop) {
          if (!self.shopData[shop.city]) {
            self.shopData[shop.city] = [];
          }

          self.shopData[shop.city].push(shop);
        });

        for (var key in this.shopData) {
          self.citys.push(key);
        }

        // 获取visitId，用以计时
        self.$http.post('http://www.walmart2019.com:8080/activity-server/visit/addVisit.do?', {
          shopId: this.currentShop.shopId,
          dealerCode: query.rybh || '',
          dealerType: query.rylx || '',
          dealerName: query.ryxm || '',
          visitDuration: self.second,

        }, {emulateJSON: true}).then(function (res) {
          this.visitId = res.body.result.visitId;

        }, function () {
          window.alert('server error: addVisit');
        });

      }, function () {
        window.alert('server error: getShopListByLocation');
      });
    },

    _swiperInit: function() {
      var swiper = new Swiper('.swiper-container', {
        pagination: {
          el: '.swiper-pagination',
        },
      })
    },

    _urlParse: function() {
      var url = window.location.search;
      var obj = {};
      var reg = /[?&][^?&]+=[^?&]+/g;
      var arr = url.match(reg);
      // ['?id=123456', '&a=b']
      if (arr) {
        arr.forEach(function(item) {
          var tempArr = item.substr(1).split('=');
          var key = decodeURIComponent(tempArr[0]);
          var val = decodeURIComponent(tempArr[1]);
          obj[key] = val;
        });
      }
      return obj;
    },

    _urlFilter: function(val) {
      var query = vm._urlParse();

      val = val.replace('{ryxm}', query.ryxm || '');
      val = val.replace('{mdhm}', query.mdhm || this.currentShop.shopCode || '');
      val = val.replace('{rylx}', query.rylx || '');
      val = val.replace('{ryhm}', query.rybh || '');

      return val;
    },

    _isWx: function() {
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.indexOf('micromessenger') > -1;
    }
  },

  filters: {
    urlFilter: function(val) {
      var query = vm._urlParse();

      val = val.replace('{ryxm}', query.ryxm || '');
      val = val.replace('{mdhm}', query.mdhm || vm.currentShop.shopCode || '');
      val = val.replace('{rylx}', query.rylx || '');
      val = val.replace('{ryhm}', query.rybh || '');

      return val;
    }
  },

  watch: {
    city: function(newCity) {
      this.shopList = this.shopData[newCity];
    }
  }
});
