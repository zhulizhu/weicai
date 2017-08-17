// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',  'LocalStorageModule', 'ngCordova', 'yike', 'oc.lazyLoad'])
    .run(function ($ionicPlatform, $yikeUtils, localStorageService,$location,$ionicHistory,$rootScope,$ionicLoading,$ionicPopup,$timeout,$cordovaToast,$state) {
        //单点登录
        function checkConnect(){
            $rootScope.checkWs = new WebSocket("ws://"+webSocketLink);
            $rootScope.checkWs.onopen = onopen;
            $rootScope.checkWs.onmessage = onmessage;
            $rootScope.checkWs.onclose = function(){
                checkConnect();
            };
            $rootScope.checkWs.onerror = function(){
                console.log("出错了");
            }
        }
        checkConnect();
        /*连接状态下的websocket*/
        function onopen(){
            $rootScope.checkWs.send(JSON.stringify({
                type:'login',
                room_id:1,
                client_name:1,
                isson:1
            }));
        }
        // 服务端发来消息时
        function onmessage(e)
        {
            var data=JSON.parse(e.data);
            switch(data.type){
                // 服务端ping客户端
                case 'check':
                    if(data.uid == localStorageService.get('uid') && data.token != localStorageService.get('token')){
                        $yikeUtils.toast('您的账号已在别处登陆');
                        if(PLATFORM != 'wechat')
                        $state.go('login');
                    }
                    break;
                case 'member':
                    //账号禁用
                    if(data.uid == localStorageService.get('uid')){
                        $state.go('disable-user');
                    }
            }
        }
        //loading
        //显示loading
        window.loadingHideShow=function (content,t) {
            $rootScope.loading_content=content;
            $rootScope.is_loading=true;
            $timeout(function () {
                $rootScope.is_loading=false;
            },t);
        };
        //显示loading
        window.loadingShow=function (content) {
            $rootScope.loading_content=content;
            $rootScope.is_loading=true;
        };
        //隐藏loading
        window.loadingHide=function () {
             $rootScope.is_loading=false;
            $rootScope.$apply() || $rootScope.$digest();
         };
        //获取微信token
        if(PLATFORM == 'wechat'){
            localStorageService.set('token',window.location.search.substr(1).split('=')[1]);
        }
        $rootScope.PLATFORM=PLATFORM;
        //是否显示客服
        if(localStorageService.get('serve_show') == null){
            localStorageService.set('serve_show',true);
        }
        $rootScope.is_serve_show=localStorageService.get('serve_show');
        //投注后显示
        if(localStorageService.get('bet_back') == null){
            localStorageService.set('bet_back','聊天室');
        }
        $rootScope.betType=localStorageService.get('bet_back');
        //客服拖拽
        var ox,oy,
            totalHeight=window.screen.availHeight,
            totalWidth=window.screen.availWidth;
        //按下
        $rootScope.onTouch = function($event){
            ox = $event.target.offsetLeft;
            oy = $event.target.offsetTop;
        };
        //拖拽
        $rootScope.onDrag = function($event){
            var el = $event.target,
                dx = $event.gesture.deltaX,
                dy = $event.gesture.deltaY;
            el.style.left = ox + dx + "px";
            el.style.top = oy + dy + "px";
        };
        //松开
        $rootScope.onRelease = function($event) {
            var el = $event.target;
            if (el.offsetTop < el.offsetHeight) {
                el.style.top = '10px';
            } else if (el.offsetTop > totalHeight - el.offsetHeight) {
                el.style.top = totalHeight - el.offsetHeight - 10 + "px";
            }
            if (el.offsetLeft < el.offsetHeight) {
                el.style.left = "10px";
            } else if (el.offsetLeft > totalWidth - el.offsetWidth) {
                el.style.left = totalWidth - el.offsetWidth - 10 + "px";
            }
        };
        //tab页缓存
        $rootScope.tabCache={
            banner:[],
            notice:[],
            lottery:[],
            news:[],
            recharge:[],
            history:[],
            account:''
        };
        //判断是否连接网络
        document.addEventListener("offline", onOffline, false);
        function onOffline() {
            $yikeUtils.toast('未连接网络');
        }
        //连接超时
        window.connectionTimeout = function () {
            $yikeUtils.toast('请求超时');
        };
        // 热更新
        var app = {

            // Application Constructor
            initialize: function() {
                this.bindEvents();
            },

            // Bind any events that are required.
            // Usually you should subscribe on 'deviceready' event to know, when you can start calling cordova modules
            bindEvents: function() {
                document.addEventListener('deviceready', this.onDeviceReady, false);
            },

            // deviceready Event Handler
            onDeviceReady: function() {
                // change plugin options
                app.configurePlugin();
            },

            configurePlugin: function() {
                var options = {
                    'config-file': 'http://wc.yike1908.com/www/chcp.json'
                };

                chcp.configure(options, app.configureCallback);
            },

            configureCallback: function(error) {
                if (error) {
                    console.log('config文件配置失败');
                    console.log(error.description);
                } else {
                    console.log('config文件配置成功');
                    app.checkForUpdate();
                }
            },

            checkForUpdate: function() {
                chcp.fetchUpdate(app.fetchUpdateCallback);
            },

            fetchUpdateCallback: function(error, data) {
                if (error) {
                    console.log('下载更新失败 ' + error.code);
                    console.log(error.description);
                    return;
                }
                console.log('下载更新成功，准备更新');
                var confirmPopup = $ionicPopup.confirm({
                    template: '是否更新',
                    cssClass: 'popup',
                    cancelText:'取消',
                    okText:'更新'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        chcp.installUpdate(app.installationCallback);
                    }});
            },

            installationCallback: function(error) {
                if (error) {
                    console.log('更新失败 ' + error.code);
                    console.log(error.description);
                    $yikeUtils.toast("更新失败");
                } else {
                    console.log('热更新成功');
                    return 1;
                }
            }
        };
        app.initialize();
        //双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {
            var path = $location.path();
            //判断处于哪个页面时双击退出
            if (path == '/tab/home' || path == '/tab/account' || path == '/tab/dynamic' || path == '/tab/recharge' || path == '/login') {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.show('再按一次退出系统',1000,'bottom');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }else{
                $rootScope.$ionicGoBack();
            }
            // }else{
            //     $rootScope.backButtonPressedOnceToExit = true;
            //     $cordovaToast.show('再按一次退出系统',1000,'bottom');
            //     setTimeout(function () {
            //         $rootScope.backButtonPressedOnceToExit = false;
            //     }, 2000);
            // }
            e.preventDefault();
            return false;
        }, 101);
        window.toast = $yikeUtils.toast;
        window.popup = $ionicPopup;
        $ionicPlatform.ready(function () {
            if($state.params.token){
                localStorageService.set('token',$state.params.token);
            }
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 1000);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.templates.maxPrefetch(0);
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.views.maxCache(1);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.scrolling.jsScrolling(true);
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.views.transition('none');
        // $ionicConfigProvider.views.transition('android');
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
        // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: tepPre+'tabs.html',
                controller: 'TabCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/tabs/tab.controller.js')
                    }]
                },
                cache: false
            })
            // Each tab has its own nav history stack:
            //首页
            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: tepPre+'tab-home.html',
                        controller: 'HomeCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/tabs/home.controller.js')
                    }]
                },
                cache: false
            })
            //充值
            .state('tab.recharge', {
                url: '/recharge',
                views: {
                    'tab-recharge': {
                        templateUrl: tepPre+'tab-recharge.html',
                        controller: 'RechargeCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/tabs/recharge.controller.js')
                    }]
                },
                cache: false
            })
            //  动态
            .state('tab.dynamic', {
                url: '/dynamic',
                views: {
                    'tab-dynamic': {
                        templateUrl: tepPre+'tab-dynamic.html',
                        controller: 'DynamicCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/tabs/dynamic.controller.js')
                    }]
                },
                cache: false
            })
            //个人中心
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: tepPre+'tab-account.html',
                        controller: 'AccountCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/tabs/account.controller.js')
                    }]
                },
                cache: false
            })
            //钱包
            .state('wallet', {
                url: '/wallet',
                templateUrl: tepPre+'user/wallet.html',
                controller: 'UserWalletCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/user.wallet.controller.js')
                    }]
                },
                cache: false

            })
            //我的回水
            .state('ascent', {
                url: '/ascent',
                templateUrl: tepPre+'user/ascent.html',
                controller:'acsentCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/acsent.controller.js')
                    }]
                },
                cache: false
            })
            //账变记录
            .state('debt-record', {
                url: '/debt-record',
                templateUrl: tepPre+'user/debt-record.html',
                controller: 'DebtRecordCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/debt.record.controller.js')
                    }]
                },
                cache: false
            })
            //游戏记录
            .state('game-record', {
                url: '/game-record/:id',
                templateUrl: tepPre+'user/game-record.html',
                controller: 'GameRecordCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/game.record.controller.js')
                    }]
                },
                // cache: false
            })
            //游戏规则
            .state('play-regulation', {
                url: '/play-regulation/:id',
                templateUrl: tepPre+'user/play-regulation.html',
                controller: 'playRegulationCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/play.regulation.controller.js')
                    }]
                },
                // cache: false
            })
            //双面长龙排行
            .state('db-list', {
                url: '/db-list/:id',
                templateUrl: tepPre+'user/db-list.html',
                controller: 'dbListCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/db.list.controller.js')
                    }]
                },
            })
            //会员列表
            .state('member-list', {
                url: '/member-list',
                templateUrl: tepPre+'user/member-list.html',
                controller: 'MemberListCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/member.list.controller.js')
                    }]
                },
                cache: false
            })
            //新增会员
            .state('add-member', {
                url: '/add-member',
                templateUrl: tepPre+'user/add-member.html',
                controller: 'AddMemberCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/add.member.controller.js')
                    }]
                },
                cache: false
            })
            //推广链接获取
            .state('referral-links', {
                url: '/referral-links',
                templateUrl: tepPre+'user/referral-links.html',
                controller: 'ReferralLinksCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/referral.links.controller.js')
                    }]
                },
                cache: false
            })
            //新增推广链接
            .state('add-referral-links', {
                url: '/add-referral-links',
                templateUrl: tepPre+'user/add-referral-links.html',
                controller: 'AddReferralLinksCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/add.referral.links.controller.js')
                    }]
                },
                cache: false
            })
            //团队统计
            .state('team-statistics', {
                url: '/team-statistics',
                templateUrl: tepPre+'user/team-statistics.html',
                controller: 'TeamStatisticsCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/team.statistics.controller.js')
                    }]
                },
                cache: false
            })
            //下级资金流水
            .state('lower-money', {
                url: '/lower-money',
                templateUrl: tepPre+'user/lower-money.html',
                controller: 'LowerMoneyCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/lower.money.controller.js')
                    }]
                },
                cache: false
            })
            //下级投注
            .state('lower-bet', {
                url: '/lower-bet',
                templateUrl: tepPre+'user/lower-bet.html',
                controller: 'LowerBetCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/lower.bet.controller.js')
                    }]
                },
                cache: false
            })
            //投注详情
            .state('bet-detail', {
                url: '/bet-detail/:id',
                templateUrl: tepPre+'user/bet-detail.html',
                controller: 'betDetailCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/bet.detail.controller.js')
                    }]
                },
                cache: false
            })
            //提现记录
          .state('deposit-record', {
            url: '/deposit-record',
            templateUrl: tepPre+'user/deposit-record.html',
            controller: 'DepositRecordCtrl',
              resolve: {
                  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                      return $ocLazyLoad.load('js/user/deposit.record.controller.js')
                  }]
              },
              cache: false
          })
          //
          .state('user-code', {
            url: '/user-code',
            templateUrl: tepPre+'user/user-code.html',
            controller: 'UserCodeCtrl',
              resolve: {
                  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                      return $ocLazyLoad.load('js/user/user.code.controller.js')
                  }]
              },
              cache: false
          })
            //修改资料
            .state('modified-data', {
                url: '/modified-data',
                templateUrl: tepPre+'user/modified-data.html',
                controller: 'ModifiedDataCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/modified.data.controller.js')
                    }]
                },
                cache: false
            })
            //用户银行卡列表
            .state('bank-card-list', {
                url: '/bank-card-list',
                templateUrl: tepPre+'user/bank-card-list.html',
                controller: 'UserBankListCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/user.bank.list.controller.js')
                    }]
                },
                cache: false
            })
            //充值
            .state('recharge', {
                url: '/recharge',
                templateUrl: tepPre+'user/recharge.html',
                controller:'RechargeCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/tabs/recharge.controller.js')
                    }]
                },
                cache: false
            })
            //客服
            .state('customer-service', {
                url: '/customer-service',
                templateUrl: tepPre+'user/customer-service.html',
                controller:'CustomerServiceCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/customer.service.controller.js')
                    }]
                },
                cache: false
            })
            //查看转账记录
            .state('transfer-accounts', {
                url: '/transfer-accounts',
                templateUrl: tepPre+'user/transfer-accounts.html',
                controller:'TransferaccountsCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/transfer.accounts.controller.js')
                    }]
                },
                cache:false
            })
            //选择支付宝账号
            .state('choice-alipay', {
                url: '/choice-alipay/:id',
                templateUrl: tepPre+'user/choice-alipay.html',
                controller: 'choiceiCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/choice.alipay.controller.js')
                    }]
                },
                cache:false
            })
            //支付宝转账
            .state('alipay-transfer', {
                url: '/alipay-transfer/:id',
                templateUrl: tepPre+'user/alipay-transfer.html',
                controller: 'AlipayTransferCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/alipay.transfer.controller.js')
                    }]
                },
                cache:false
            })
            //选择银行账号
            .state('choice-bank', {
                url: '/choice-bank',
                templateUrl: tepPre+'user/choice-bank.html',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/choice.bank.controller.js')
                    }]
                },
                cache: false
            })
            //填写存款信息
            .state('deposit-information', {
                url: '/deposit-information',
                templateUrl: tepPre+'user/deposit-information.html',
                cache: false
            })
            //微信充值
            .state('wechat-recharge', {
                url: '/wechat-recharge',
                templateUrl: tepPre+'user/wechat-recharge.html',
                cache: false
            })

            //登录
            .state('login', {
                url: '/login',
                templateUrl: tepPre+'user/login.html',
                controller: 'LoginCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/login.controller.js')
                    }]
                },
                cache: false
            })
            //注册
            .state('register', {
                url: '/register',
                templateUrl: tepPre+'user/register.html',
                controller: 'RegisterCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/register.controller.js')
                    }]
                },
                cache: false
            })
            //找回密码
            .state('retrieve-password', {
                url: '/retrieve-password',
                templateUrl: tepPre+'user/retrieve-password.html',
                controller:'RetrievePasswordCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/retrieve.password.controller.js')
                    }]
                },
                cache:false
            })
            //关于
            .state('about', {
                url: '/about',
                templateUrl: tepPre+'user/about.html',
                controller: 'AboutCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/about.controller.js')
                    }]
                },
                cache: false
            })
            //设置
            .state('set', {
                url: '/set',
                templateUrl: tepPre+'user/set.html',
                controller: 'SetCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/set.controller.js')
                    }]
                },
                cache: false
            })
            //提现密码
            .state('withdraw-deposit-password', {
                url: '/withdraw-deposit-password',
                templateUrl: tepPre+'user/withdraw-deposit-password.html',
                controller: 'WithdrawDepositPasswordCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/withdraw.deposit.password.controller.js')
                    }]
                },
                cache: false
            })
            //修改登录密码
            .state('change-login-password', {
                url: '/change-login-password',
                templateUrl: tepPre+'user/change-login-password.html',
                controller: 'ChangeLoginCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/change.login.password.controller.js')
                    }]
                },
                cache: false
            })
            //银行卡
            .state('bank-card', {
                url: '/bank-card',
                templateUrl: tepPre+'user/bank-card.html',
                controller: 'BankCardCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/bank.card.controller.js')
                    }]
                },
                cache: false
            })
            //提现
            .state('withdraw-deposit', {
                url: '/withdraw-deposit',
                templateUrl: tepPre+'user/withdraw-deposit.html',
                controller: 'WithdrawDepositCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/withdraw.deposit.controller.js')
                    }]
                },
                cache: false

            })
            //修改提现密码
            .state('change-tx-password', {
                url: '/change-tx-password',
                templateUrl: tepPre+'user/change-tx-password.html',
                controller: 'ChangeTxPasswordCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/change.tx.password.controller.js')
                    }]
                },
                cache: false
            })

          //消息详情
            .state('message-details', {
                url: '/message-details/:id/:type',
                templateUrl: tepPre+'user/message-details.html',
                controller: 'MessageDetailsCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/message.details.controller.js')
                    }]
                },
                cache: false
            })
            //往期收益
          .state('earnings-ruler', {
            url: '/earnings-ruler',
            templateUrl: tepPre+'user/earnings-ruler.html',
            controller: 'EarningsRulerCtrl',
              resolve: {
                  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                      return $ocLazyLoad.load('js/user/earnings.ruler.controller.js')
                  }]
              },
              cache: false
          })
          //分享规则
          .state('earnings-rulers', {
            url: '/earnings-rulers',
            templateUrl: tepPre+'user/earnings-rulers.html',
            controller: 'EarningsRulersCtrl',
              resolve: {
                  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                      return $ocLazyLoad.load('js/user/earnings.rulers.controller.js')
                  }]
              },
            cache:false
          })
            //我的消息
            .state('my-msg', {
                url: '/my-msg',
                templateUrl: tepPre+'user/my-msg.html',
                controller: 'MyMesCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/my.msg.controller.js')
                    }]
                },
                cache:false
            })
          //消息公告
          .state('message-advertisement', {
            url: '/message-advertisement/:type',
            templateUrl:tepPre+'user/message-advertisement.html',
            controller: 'MessageAdvertisementCtrl',
              resolve: {
                  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                      return $ocLazyLoad.load('js/user/message.advertisement.controller.js')
                  }]
              },
              cache: false
          })
            //快三
            /*快三新房间*/
          .state('fast-room-new',{
            url:'/fast-room-new/:id/:name',
            templateUrl:tepPre+'fast-three/fast-room-new.html',
            controller:'FastRoomNewController',
              resolve: {
                  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                      return $ocLazyLoad.load('js/fast-three/fast.room.new.controller.js')
                  }]
              },
              cache:false
          })
            //注册协议
            .state('registration-protocol', {
                url: '/registration-protocol',
                templateUrl: tepPre+'user/registration-protocol.html',
                controller: 'RegistrationProtocolCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/registration.protocol.controller.js')
                    }]
                },
                cache: false
            })
            //过渡页
            .state('transition-page', {
                url: '/transition-page',
                templateUrl: tepPre+'transition-page.html',
                // controller: 'AgentYingkuiCtrl',
                cache: false
            })
            //自定义客服
            .state('zdy-customer-service', {
                url: '/zdy-customer-service',
                templateUrl: tepPre+'user/zdy-customer-service.html',
                controller: 'ZdyCustomerServiceCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/zdy.customer.service.controller.js')
                    }]
                },
                cache: false
            })
            //pk10历史开奖
            .state('pk-history-lottery', {
                url: '/pk-history-lottery/:id',
                templateUrl: tepPre+'fast-three/pk-history-lottery.html',
                controller: 'PkHistoryLotteryCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/fast-three/pk.history.lottery.controller.js')
                    }]
                },
                cache: false
            })
            //重庆时时彩历史开奖
            .state('ssc-history-lottery', {
                url: '/ssc-history-lottery/:id',
                templateUrl: tepPre+'fast-three/ssc-history-lottery.html',
                controller: 'SscHistoryLotteryCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/fast-three/ssc.history.lottery.controller.js')
                    }]
                },
                cache: false
            })
            //江苏快三历史开奖
            .state('fast-history-lottery', {
                url: '/fast-history-lottery/:id',
                templateUrl: tepPre+'fast-three/fast-history-lottery.html',
                controller: 'FastHistoryLotteryCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/fast-three/fast.history.lottery.controller.js')
                    }]
                },
                cache: false
            })
            //香港彩
            .state('mark-six-history-lottery', {
                url: '/mark-six-history-lottery/:id',
                templateUrl: tepPre+'fast-three/mark-six-history-lottery.html',
                controller: 'MarkSixHistoryLotteryCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/fast-three/mark.six.history.lottery.controller.js')
                    }]
                },
                cache: false
            })
            //加拿大28
            .state('canada-history-lottery', {
                url: '/canada-history-lottery/:id',
                templateUrl: tepPre+'fast-three/canada-history-lottery.html',
                controller: 'CanadaHistoryLotteryCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/fast-three/canada.history.lottery.controller.js')
                    }]
                },
                cache: false
            })
            //幸运28历史开奖
            .state('lucky-history-lottery', {
                url: '/lucky-history-lottery/:id',
                templateUrl: tepPre+'fast-three/lucky-history-lottery.html',
                controller: 'LuckHistoryLotteryCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/fast-three/luck.history.lottery.controller.js')
                    }]
                },
                cache: false
            })
            //常见问题
            .state('common-problems', {
                url: '/common-problems',
                templateUrl: tepPre+'user/common-problems.html',
                 controller: 'commonProblemsCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/common.problems.controller.js')
                    }]
                },
                cache: false
            })
            //客服开关
            .state('serve-on-off', {
                url: '/serve-on-off',
                templateUrl: tepPre+'user/serve-on-off.html',
                controller: 'ServeOnOffCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/serve.on.off.controller.js')
                    }]
                },
                cache: false
            })
            //优惠活动
            .state('favorable-activity', {
                url: '/favorable-activity',
                templateUrl: tepPre+'user/favorable-activity.html',
                controller: 'favorableActivityCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/favorable.activity.controller.js')
                    }]
                },
                cache: false
            })
            //高级设置
            .state('advanced-setup', {
                url: '/advanced-setup',
                templateUrl: tepPre+'user/advanced-setup.html',
                controller: 'AdvancedSetupCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/advanced.setup.controller.js')
                    }]
                },
                cache: false
            })
            //首存送礼
            .state('day-keep', {
                url: '/day-keep/:id',
                templateUrl: tepPre+'activity/day-keep.html',
                controller: 'dayKeepCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/activity/day.keep.controller.js')
                    }]
                },
                cache: false
            })
            //注册就送
            .state('register-send', {
                url: '/register-send/:id',
                templateUrl: tepPre+'activity/register-send.html',
                controller: 'registerSendCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/activity/register.send.controller.js')
                    }]
                },
                cache: false
            })
            //消费签到
            .state('pay-sign', {
                url: '/pay-sign/:id',
                templateUrl: tepPre+'activity/pay-sign.html',
                controller: 'paySignCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/activity/pay.sign.controller.js')
                    }]
                },
                cache: false
            })
            //微信绑定注册
            .state('more-register', {
                url: '/more-register',
                templateUrl: tepPre+'user/more-register.html',
                controller: 'moreRegisterCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/more.register.controller.js')
                    }]
                },
                cache: false
            })
            //绑定已有账户
            .state('binding-account', {
                url: '/binding-account',
                templateUrl: tepPre+'user/binding-account.html',
                controller: 'bindingAccountCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/binding.account.controller.js')
                    }]
                },
                cache: false
            })
            //禁用账号
            .state('disable-user', {
                url: '/disable-user',
                templateUrl: tepPre+'user/disable-user.html',
                controller: 'DisableUserCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/user/disable.user.controller.js')
                    }]
                },
                cache: false
            })
            //分分彩历史走势
            .state('ffc-history-lottery', {
                url: '/ffc-history-lottery/:id',
                templateUrl: tepPre+'fast-three/ffc-history-lottery.html',
                controller: 'FfcHistoryLotteryCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/fast-three/ffc.history.lottery.controller.js')
                    }]
                },
                cache: false
            })
            //重庆幸运农场历史走势
            .state('cqxync-history-lottery', {
                url: '/cqxync-history-lottery/:id',
                templateUrl: tepPre+'fast-three/cqxync-history-lottery.html',
                controller: 'CqxyncHistoryLotteryCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                        return $ocLazyLoad.load('js/fast-three/cqxync.history.lottery.controller.js')
                    }]
                },
                cache: false
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/home');

    });
