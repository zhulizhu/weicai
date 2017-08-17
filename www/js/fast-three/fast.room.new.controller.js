/**
 * Created by frank on 2016/11/11.
 */
(function () {
  'use strict';

  angular
    .module('fast.room.new.controller', [])
    .controller('FastRoomNewController', FastRoomNewController);

  FastRoomNewController.$inject = ['$scope','$yikeUtils','$state','$location','$ionicModal','$rootScope','localStorageService','$ionicScrollDelegate','$filter'];
  /* @ngInject */
  function FastRoomNewController($scope,$yikeUtils,$state,$location,$ionicModal,$rootScope,localStorageService,$ionicScrollDelegate,$filter) {
    $scope.roomId = $state.params.id;//彩种id
    $scope.name = $state.params.name;//彩种名
    $scope.status={
        id:''
    };
      //开奖球的数量
      var lotteryLen={
          '64':3,
          '65':7,
          '66':5,
          '67':10,
          '68':3,
          '69':5,
          '70':8
      };
      //重庆农场变量初始化
      $scope.cqnc={
          ncImgs:{
              '1':'img/game/xigua.png',
              '2':'img/game/yezi.png',
              '3':'img/game/liulian.png',
              '4':'img/game/youzi.png',
              '5':'img/game/boluo.png',
              '6':'img/game/putao.png',
              '7':'img/game/lizhi.png',
              '8':'img/game/yingtao.png',
              '9':'img/game/caomei.png',
              '10':'img/game/fanqie.png',
              '11':'img/game/lizi.png',
              '12':'img/game/pingguo.png',
              '13':'img/game/taozi.png',
              '14':'img/game/ganju.png',
              '15':'img/game/donggua.png',
              '16':'img/game/luobo.png',
              '17':'img/game/nangua.png',
              '18':'img/game/qiezi.png',
              '19':'img/game/jiaquan.png',
              '20':'img/game/nainiu.png'
          },
          ncPlayNames:{
              '1':'西瓜',
              '2':'椰子',
              '3':'榴莲',
              '4':'柚子',
              '5':'菠萝',
              '6':'葡萄',
              '7':'荔枝',
              '8':'樱桃',
              '9':'草莓',
              '10':'番茄',
              '11':'梨子',
              '12':'苹果',
              '13':'桃子',
              '14':'柑橘',
              '15':'冬瓜',
              '16':'萝卜',
              '17':'南瓜',
              '18':'茄子',
              '19':'家犬',
              '20':'奶牛'
          },
          playGroup:{
              '61':61,
              '63':63,
              '65':65,
              '67':67,
              '69':69,
              '71':71,
              '73':73,
              '75':75,
          }
      };
      /*出当前路由地址的时候，让isson为noson*/
    $scope.$on('$ionicView.beforeLeave', function () {
      clearInterval(djsTime.ctime);
      isson= 'noson';
        document.removeEventListener('webkitvisibilitychange',visibilitychangePeriods,false);
        pushMessage({type:'close'});
        $scope.closePlay();
        $scope.closeAffirm();
        AV._.each(betswiper,function (b) {
            b.destroy();//退出时销毁swiper
        })
    });
    $scope.bottomPours={
      multiple:1
    };
    var token=localStorageService.get('token');
     $scope.menu=false;
     $scope.bet=false;
      $scope.isRotaryHeader=false;/*是否封盘，初始化为未封盘*/
     /*具体玩法内容存储的变量*/
     $scope.userinfo=userinfo;
    $scope.roomClass=roomClass;
    $scope.sendChat=sendChat;
    $scope.user_level_show=user_level_show;
    $scope.touzhuShow=touzhuShow;
    $scope.select=select;
    $scope.sscNextPeriods=sscNextPeriods;
    $scope.chosePlay=chosePlay;
    $scope.listShow=listShow;
    $scope.quickBetList = quickBetList;//快捷下注列表
    $scope.choseBetMenu = choseBetMenu;//选择快捷下注注单
    $scope.oneBetting = oneBetting;  //下注
    $scope.changeBet =changeBet; //计算总金额
      $scope.goPage=goPage; //跳转页面
      $scope.betzs=betzs; //跳转页面
      $scope.is_betzs=true; //
    var ws={};
      $scope.betBox=[];
    $scope.bottomPourRecord=[];
    $scope.chatRecord=[];
    $scope.message={
      content:'',
      bear:''
    };
    $scope.state={
          id:1,
        name:''
    };
    $scope.playBeishu={
        allBeishu:1 //确认订单快速倍数
    };
    $scope.quickList=[];

    var flag=true;
     init();
    function init(){
     userinfo();
        sscNextPeriods();
        lotteryBunko();
        //玩法组列表
        loadingHideShow('加载中...',3000);
        yikePcdd.playList({token:token,id:$scope.roomId})
            .then(function (data) {
                $scope.categorys=data.info;
                chosePlay($scope.categorys[0]);
                $scope.$digest();
            });
     document.addEventListener("webkitvisibilitychange", visibilitychangePeriods, false);
     }
     function visibilitychangePeriods(e) {
         if($location.path().substring(0,14) == '/fast-room-new'){
             if(document.hidden){
                 clearInterval(djsTime.ctime);
             }else{
                 sscNextPeriods();
             }
         }
         e.preventDefault();
     }
      var swiper;
      /*出当前路由地址的时候，让isson为noson*/
      $scope.$on('$ionicView.beforeLeave', function () {
          $scope.closeNav();
          $scope.closeAffirm();
          $scope.closePlay();
      });
      /*菜单选项*/
      $ionicModal.fromTemplateUrl(tepPre+'model/fast-room-menu.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.Nav = modal;
      });
      $scope.openNav = function() {
          $scope.Nav.show();
      };
      $scope.closeNav = function() {
          $scope.Nav.hide();
      };
      //跳转页面
      function goPage(type) {
          $scope.closeNav();
          if(type == 'record'){
              $state.go('game-record',{id:$scope.roomId});
          }else if(type == 'introduce'){
              $state.go('play-regulation',{id:$scope.roomId});
          }
          else if(type == 'db_list'){
              $state.go('db-list',{id:$scope.roomId});
          }
          else{
              $scope.pageGo();
          }
      }
    /*确认注单*/
    $ionicModal.fromTemplateUrl(tepPre+'model/fast-affirm-bet.html', {
     scope: $scope,
     animation: 'slide-in-up'
     }).then(function(modal) {
     $scope.affirm = modal;
     });
     $scope.openAffirm = function(type) {
     $scope.affirm.show();
         swiper = new Swiper('.swiper-affirm', {
             scrollbar: '.swiper-affirm-scrollbar',
             direction: 'vertical',
             slidesPerView: 'auto',
             mousewheelControl: true,
             freeMode: true
         });
     };
     $scope.closeAffirm = function() {
        $scope.affirm.hide();
         $scope.emptySelect();
     };
      /*玩法选择*/
      var is_play=false;
      $ionicModal.fromTemplateUrl(tepPre+'model/fast-play.html', {
          scope: $scope,
          animation: 'slide-in-down'
      }).then(function(modal) {
          $scope.play = modal;
      });
      $scope.openPlay= function() {
          $scope.play.show();
      };
      $scope.closePlay = function() {
          try{$scope.play.hide();}catch (err){}
      };
      /*投注显示隐藏*/
      var betswiper;
      var is_betswiper=true;
      function  touzhuShow(){
          if($scope.bet){
              $scope.bet=false
          }else{
              $scope.bet=true;
          }
          var sub_p=$('.sub-periods').get(0).offsetHeight,
              chose=$('.chose').get(0).offsetHeight,
              bar=$('ion-header-bar h1').get(0).offsetHeight;
          if(is_betswiper){
              setTimeout(function () {
                  var height=$('ion-nav-view').get(0).offsetHeight-(sub_p+chose+88);
                  $('.bet-chose').css('height',height+'px');
                  $('.bet-chose-con').css('height',height+'px');
                  betswiper = new Swiper('.bet-chose-con', {
                      scrollbar: '.swiper-scrollbar',
                      direction: 'vertical',
                      slidesPerView: 'auto',
                      mousewheelControl: true,
                      freeMode: true,
                      observer:true,
                      observeParents:true
                  });
                  is_betswiper=false;
              },50);
          }
      }
    //投注聊天展开收缩
      function betzs() {
            var ion=$('ion-content'),
                sub_b=$('.bet-sub'),
                sub_c=$('.bet-chose'),
                chose=$('.chose').get(0).offsetHeight,
                sub_p=$('.sub-periods').get(0).offsetHeight;
                if($scope.is_betzs){
                    sub_b.css('height',(sub_p+sub_b.get(0).offsetHeight)+'px');
                    sub_c.css('height',(sub_b.get(0).offsetHeight-chose)+'px');
                    $('.bet-chose-con').css('height',(sub_b.get(0).offsetHeight-chose)+'px');
                    sub_b.removeClass('bet-sub-yc');
                    sub_b.addClass('bet-sub-zk');
                    $scope.is_betzs=false;
                }else{
                    setTimeout(function () {
                        sub_b.css('height',(sub_b.get(0).offsetHeight-sub_p)+'px');
                        sub_c.css('height',(sub_b.get(0).offsetHeight-chose)+'px');
                        $('.bet-chose-con').css('height',(sub_b.get(0).offsetHeight-chose)+'px');
                    },300);
                    sub_b.removeClass('bet-sub-zk');
                    sub_b.addClass('bet-sub-yc');
                    $scope.is_betzs=true;
                }
      }
    //用户信息
    function userinfo() {
     yikePcdd.userinfo({token:token})
     .then(function (data) {
     $scope.userInfo=data.info;
     if($scope.userInfo.nickname !=null && $scope.userInfo.nickname != ''){
       $scope.userInfo.username=$scope.userInfo.nickname;
     }
     if(flag){
         if(localStorageService.get('chatting-records'+$scope.roomId)){
             $scope.chatRecord=localStorageService.get('chatting-records'+$scope.roomId);
             $scope.bottomPourRecord=localStorageService.get('chatting-records'+$scope.roomId);
         }
         connect();
     }
     flag=false;
     $scope.$digest();
     });
     }
     /*游戏初始化*/
    $scope.guess={
      guess:[],
        money:0
    };
    function connect(){
      ws = new WebSocket("ws://"+webSocketLink);
      ws.onopen = onopen;
      ws.onmessage = onmessage;
      ws.onclose = function(){
          if($location.path().substring(0,14) == '/fast-room-new'){
              connect();
          }
      };
      ws.onerror = function(){
        console.log("出错了");
      }
    }

    /*连接状态下的websocket*/
    function onopen(){
        pushMessage({
            type:'login',
            client_name:$scope.userInfo.username,
            room_id:$scope.roomId,
            isson:isson,
            level_img:$scope.userInfo.levelImg,
        });
    }

    // 服务端发来消息时
    function onmessage(e)
    {
      var data=JSON.parse(e.data);
        switch(data.type){
        // 服务端ping客户端
        case 'login':
          if(data.isson == "son"){
            if($scope.bottomPourRecord.length > 500){
              $scope.bottomPourRecord.splice(0,1);
            }
            $scope.bottomPourRecord.push(data);
            $scope.$digest();
              $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
          }
          break;
        case 'bet':
            if($scope.bottomPourRecord.length > 500){
            $scope.bottomPourRecord.splice(0,1);
          }
            if($scope.chatRecord.length > 20){
                $scope.chatRecord.splice(0,1);
            }
          $scope.bottomPourRecord.push(data);
          $scope.chatRecord.push(data);
            localStorageService.set('chatting-records'+$scope.roomId,$scope.chatRecord);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
          $scope.$digest();
          break;
        case 'say':
            if($scope.bottomPourRecord.length > 500){
            $scope.bottomPourRecord.splice(0,1);
          }
          $scope.bottomPourRecord.push(data);
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
          $scope.$digest();
          break;
        case 'jinyan':
            $scope.messag.jinyan=data.status;
            $scope.$digest();
            break;
      }
    }
    //发言
    function sendChat(e) {
      if($scope.messag.jinyan == 1){
        $yikeUtils.toast('已经禁言');
      } else if($scope.message.content == '' || $scope.message.content == null){
        $yikeUtils.toast('请先填写内容');
      }else{
          pushMessage({
              type:'say',
              content:$scope.message.content,
              id:$scope.userInfo.uid,
              img:$scope.userInfo.avatar,
              client_name:$scope.userInfo.username,
              to_client_id:'all',
              level_img:$scope.userInfo.levelImg2,
              levels_id:$scope.userInfo.levels_id,
          });
        $scope.message.content = '';
      }
      if(e){
        e.preventDefault();
      }
    }

    //房间页面展示class
    function roomClass(bottomPour) {
        if(bottomPour.id == $scope.userInfo.uid && bottomPour.type=='bet'){
            return 'bottom-pour-list-r';
        }else if(bottomPour.type=='fengpan'){
            return 'bottom-pour-close';
        }else if(bottomPour.type=='result'){
            return 'bottom-pour-results';
        }else if(bottomPour.id != $scope.userInfo.uid && bottomPour.type=='say'){
            return 'bottom-pour-speak';
        }else if(bottomPour.id == $scope.userInfo.uid && bottomPour.type=='say'){
            return 'bottom-pour-speak-r';
        }else if(bottomPour.type=='login'){
            return 'bottom-pour-greet';
        }
    }
      //  用户等级展示
      function user_level_show(bottomPour) {
          if(bottomPour.levels_id ==1 || bottomPour.levels_id == 2 || bottomPour.levels_id == 3 ){
              if($scope.userInfo.uid != bottomPour.id){
                  return 'fl';
              }else{
                  return 'fr';
              }
          }else{
              if($scope.userInfo.uid != bottomPour.id){
                  return 'grade-max fl';
              }else{
                  return 'grade-max fr';
              }
          }
      }
    /*用户跟投*/
      /*确认的模态框*/
    $ionicModal.fromTemplateUrl(tepPre+'model/fast-three-vote.html', {
      scope: $scope,
      animation: 'none'
    }).then(function (modal) {
      $scope.VoteSameModal = modal;
    });
    $scope.userMessage = {};
    $scope.openVoteSameModal = function (bottomPour) {
      if($scope.isRotaryHeader){
        $yikeUtils.toast('封盘中不能下注');
        return;
      }else if(Number($scope.userinfo.coin) < Number(bottomPour.money)){
        $yikeUtils.toast('余额不足');
        return;
      }
        $scope.guess.money=bottomPour.money;
        $scope.guess.bonus=bottomPour.bonus;
        $scope.guess.profit=bottomPour.profit;
        $scope.guess.guess=JSON.parse(bottomPour.guess);
      $scope.VoteSameModal.show();
        new Swiper('.swiper-follow', {
            scrollbar: '.swiper-follow-scrollbar',
            direction: 'vertical',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true
        });
    };
    $scope.closeVoteSameModal = function () {
      $scope.VoteSameModal.hide();
    };
    //键盘显示
    window.addEventListener('native.keyboardshow',function (e) {
      if($('.footer1')){
        $('.footer1').css({'display':'none'});
      }
        e.preventDefault();
    });
    //键盘隐藏
    window.addEventListener('native.keyboardhide', function (e) {
        if($('.footer1')){
            $('.footer1').css({'display':'block'});
        }
        e.preventDefault();
    });
      //获取下一期期数
      function sscNextPeriods(){
          if(token){
              var options={
                  token:token,
                  id:$scope.roomId
              };
              yikePcdd.playGame(options)
                  .then(function (data) {
                      $scope.messag=data.info;
                      if($scope.messag.jinyan ==1){
                          $scope.messag.bear='已经禁言';
                      }
                      if(!$scope.messag.kjHao){
                          createLotteryBall($scope.messag.type);
                      }
                      $scope.lastTime=data.info.lastNo.actionTime*1000;
                      $scope.kptime=data.info.diffTime-data.info.kjdTime;
                      sscClosingTime(data.info.diffTime,data.info.kjHao,$scope.kptime);
                      $scope.$digest();
                  },function () {
                      clearInterval(djsTime.ctime);
                  })
          }
      }
      //获取彩种今日输赢
      function lotteryBunko() {
          yikePcdd.lotteryBunko({
              token:token,
              type:$scope.roomId})
              .then(function (data) {
                  $scope.lotteryBunko=data.info;
                  $scope.$digest();
              })
      }
      //选择投注方式
      function select(i){
          $scope.state.id=i;
          $scope.betBox=[];
          AV._.each($scope.quickList,function(q){
              AV._.each(q.group,function(g){
                   g.value ='';
                  g.checked =false;
              })
          });
      }
      //选择玩法
      function chosePlay(choseId){
          $scope.state.name=choseId.groupName;
          $scope.status.id = choseId.id;
          quickBetList($scope.status.id);
          $scope.closePlay();
      }
      //获取下一期倒计时
      var t=3;
      function sscClosingTime(intDiff,kjHao,kpdtime){
          clearInterval(djsTime.ctime);
          djsTime.ctime=setInterval(function(){
              //下期倒计时
              $scope.hour = Math.floor(intDiff / (60 * 60));
              $scope.minute= Math.floor((intDiff / 60) % 60);
              $scope.second = Math.floor(intDiff % 60);
              if ($scope.second <= 9) $scope.second = '0' + $scope.second;
              if ($scope.hour <= 9) $scope.hour = '0' + $scope.hour;
              if ($scope.minute <= 9) $scope.minute = '0' + $scope.minute;
              if(kjHao[0] == '?' || !kjHao || kjHao == null || typeof(kjHao) == 'undefined'){
                t--;
                if(t==0){
                    t=3;
                    sscNextPeriods();
                }
              }else{
                  if(localStorageService.get('period') != $scope.messag.lastNo.actionNo){
                      if($scope.bottomPourRecord.length > 500){
                          $scope.bottomPourRecord.splice(0,1);
                      }
                      if($scope.roomId == 64 || $scope.roomId == 68){
                          $scope.bottomPourRecord.push({
                              period:$scope.messag.lastNo.actionNo,
                              kjHao:kjHao,
                              he:Number(kjHao[0])+Number(kjHao[1])+Number(kjHao[2]),
                              time:$scope.messag.time,
                              type:'result'
                          });
                      }else {
                          $scope.bottomPourRecord.push({
                              period:$scope.messag.lastNo.actionNo,
                              kjHao:kjHao,
                              time:$scope.messag.time,
                              type:'result'
                          });
                      }
                      localStorageService.set('period',$scope.messag.lastNo.actionNo);
                      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
                      $scope.$digest();
                  }
              }
              //封盘倒计时
              if(kpdtime > 0){
                  $scope.hour1 = Math.floor(kpdtime / (60 * 60));
                  $scope.minute1= Math.floor((kpdtime / 60) % 60);
                  $scope.second1 = Math.floor(kpdtime % 60);
                  if ($scope.second1 <= 9) $scope.second1 = '0' + $scope.second1;
                  if ($scope.hour1 <= 9) $scope.hour1 = '0' + $scope.hour1;
                  if ($scope.minute1 <= 9) $scope.minute1 = '0' + $scope.minute1;
                  if($scope.isRotaryHeader){
                      AV._.each($scope.quickList,function(q){
                          AV._.each(q.group,function(g){
                              g.value ='';
                              g.checked =false;
                              g.is_disabled =false;
                          })
                      });
                  }
                  $scope.isRotaryHeader=false;
              } else if(kpdtime <= 0 && intDiff > 0){
                  //开奖倒计时
                  $scope.second1 = '00';
                  $scope.minute1 = '00';
                  $scope.hour1 = '00';
                  if(!$scope.isRotaryHeader && intDiff <= (intDiff-kpdtime)){
                      if($scope.bottomPourRecord.length > 500){
                          $scope.bottomPourRecord.splice(0,1);
                      }
                      $scope.bottomPourRecord.push({
                          period:$scope.messag.actionNo.actionNo,
                          type:'fengpan'
                      });
                      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
                      $scope.$digest();
                  }
                  $scope.isRotaryHeader=true;
                  AV._.each($scope.quickList,function(q){
                      AV._.each(q.group,function(g){
                          g.value ='封盘中';
                          g.checked =false;
                          g.is_disabled =true;
                      })
                  })
              }else{
                  sscNextPeriods();
              }
              $scope.$digest();
              intDiff--;
              kpdtime--;
          }, 1000);
      }

      //快捷下注列表
      function quickBetList(id) {
          var options={
              token:token,
              id:$scope.roomId,
              cate:id
          };
          yikePcdd.quickBetList(options)
                  .then(function (data) {
                      $scope.quickList=data.info;
                      for(var i=0;i<$scope.quickList.length;i++){
                          $scope.quickList[i].mxShow=true;
                          for(var j=0;j<$scope.quickList[i].group.length;j++){
                              $scope.quickList[i].group[j].checked=false;
                              $scope.quickList[i].group[j].value='';
                              $scope.quickList[i].group[j].is_disabled=false;
                          }
                      }
                      setTimeout(function () {
                          AV._.each(betswiper,function (b) {
                              b.update(true);
                          })
                      },50);
                      $scope.$digest();
                  })
      }
      //展开隐藏下注列表
      function  listShow(item){
          if(item.mxShow){
              item.mxShow=false;
          }else{
              item.mxShow=true;
          }
          setTimeout(function () {
              AV._.each(betswiper,function (b) {
                  b.update(true);
              })
          },50);

      }
      //选择快捷下注注单
      function choseBetMenu(groups){
          if($scope.isRotaryHeader){
              $yikeUtils.toast('封盘中不能投注');
              return;
          }
          if(groups.checked==false){
              groups.checked=true;
          }else if(groups.checked==true){
              groups.checked=false;
          }
      }
      //计算总金额
      function changeBet(){
          $scope.guess.guess=[];//投注内容
          $scope.guess.guessMax=[];//最大奖金
          $scope.guess.money=0;
          $scope.guess.bonus=0;
          var playName;
          //投注内容
          AV._.each($scope.quickList,function(q){
              $scope.guess.guessSelect=[];
              AV._.each(q.group,function(g){
                  if((g.value !=null && g.value !='') || g.checked==true ){
                      playName=q.groupName+' @'+g.name;
                      if($scope.roomId == 70 && q.id == $scope.cqnc.playGroup[q.id]){
                          playName=q.groupName+' @'+$scope.cqnc.ncPlayNames[g.name];
                      }
                      if($scope.state.id== 1){
                          $scope.guess.guess.push({id:g.id, beiShu:g.value,playName:playName,odds:g.odds});
                          $scope.guess.guessSelect.push({id:g.id,beiShu:g.value,odds:g.odds,bonus:g.value*g.odds});
                          $scope.guess.money+=Number(g.value);
                      }else{
                          $scope.guess.guess.push({id:g.id, beiShu:1,playName:playName,odds:g.odds});
                          $scope.guess.guessSelect.push({id:g.id,beiShu:1,odds:g.odds,bonus:g.odds});
                          $scope.guess.money+=1;
                      }
                  }
              });
              $scope.guess.guessMax.push($scope.guess.guessSelect);
          });
          AV._.each($scope.guess.guessMax,function (max) {
              if(max.length > 0)
              $scope.guess.bonus+=Number(return_max(max).bonus);
          });
          $scope.guess.money=retain_two_decimals($scope.guess.money);
          $scope.guess.bonus=retain_two_decimals($scope.guess.bonus);
          $scope.guess.profit=retain_two_decimals($scope.guess.bonus-$scope.guess.money);
      }
      //返回数组最大值
      function return_max(list) {
          return AV._.max(list,function (l) {return Number(l.bonus)});
      }
      //下注
     function oneBetting(){
         changeBet();
         if($scope.isRotaryHeader){
             $yikeUtils.toast('封盘中不能投注');
             return;
         } else if($scope.guess.guess.length==0){
             $yikeUtils.toast('请先投注');
             return;
         }else if(Number($scope.userInfo.coin) < Number($scope.guess.money)){
             $yikeUtils.toast('余额不足');
             return;
         }
         $scope.openAffirm();
     }
      //快捷输入倍数
      $scope.fastBs=function(type,con){
          $scope.guess.money=0;
          $scope.guess.bonus=0;
          AV._.each($scope.guess.guess,function(g){
              if(type == 'all'){
                  g.beiShu=$scope.playBeishu.allBeishu;
              }
              $scope.guess.money+=Number(g.beiShu);
          });
          AV._.each($scope.guess.guessMax,function(max){
              AV._.each(max,function (m) {
                  if(type == 'all'){
                      m.beiShu=$scope.playBeishu.allBeishu;
                  }else{
                      if(con.id == m.id){
                          m.beiShu=con.beiShu;
                      }
                  }
                  m.bonus=m.beiShu*m.odds;
              });
              if(max.length > 0)
              $scope.guess.bonus+=Number(return_max(max).bonus);
          });
          $scope.guess.money=retain_two_decimals($scope.guess.money);
          $scope.guess.bonus=retain_two_decimals($scope.guess.bonus);
          $scope.guess.profit=retain_two_decimals($scope.guess.bonus-$scope.guess.money);
      };
        //删除订单
      $scope.deleteOrder=function (index,con) {
          $scope.guess.guess.splice(index,1);
          $scope.guess.money=0;
          $scope.guess.bonus=0;
          AV._.each($scope.guess.guess,function(g){
              $scope.guess.money+=Number(g.beiShu);
          });
          AV._.each($scope.guess.guessMax,function(max){
              AV._.each(max,function (m,i) {
                  if(con.id == m.id){
                      max.splice(i,1);
                  }
              });
              if(max.length > 0)
                  $scope.guess.bonus+=Number(return_max(max).bonus);
          });
          $scope.guess.money=retain_two_decimals($scope.guess.money);
          $scope.guess.bonus=retain_two_decimals($scope.guess.bonus);
          $scope.guess.profit=retain_two_decimals($scope.guess.bonus-$scope.guess.money);
          setTimeout(function () {
              swiper.update(true);
          },50);
      };
      //保留三位小数
      function retain_two_decimals(number) {
        return number.toFixed(3);
      }
    // 取消投注
      $scope.cancelBet=function () {
          $scope.closeAffirm();
          $scope.closeVoteSameModal();
          $scope.emptySelect();
          $scope.guess.guess=[];
          $scope.guess.guessMax=[];
          $scope.guess.money='0.000';
          $scope.guess.bonus='0.000';
          $scope.guess.profit='0.000';
          $scope.playBeishu.allBeishu=1;
      };
    // 清空选项
      $scope.emptySelect=function () {
          AV._.each($scope.quickList,function(q){
              AV._.each(q.group,function(g){
                  g.value ='';
                  g.checked =false;
              })
          });
      };

      //确认投注
      $scope.affirmBet=function () {
          var beishu=false;
          AV._.each($scope.guess.guess,function (g) {
              if(g.beiShu == '' || g.beiShu == null || Number(g.beiShu) < 1){
                  beishu=true;
                  return;
              }
          });
          if($scope.isRotaryHeader){
              $yikeUtils.toast('封盘中不能投注');
              return;
          }else if(beishu){
              $yikeUtils.toast('投注倍数至少为1');
              return;
          } else if($scope.guess.guess.length==0){
              $yikeUtils.toast('请先投注');
              return;
          }else if($scope.guess.money=='' || $scope.guess.money==0 || $scope.guess.money == null){
              $yikeUtils.toast('投注金额需大于0');
              return;
          }else if(Number($scope.userInfo.coin) < Number($scope.guess.money)){
              $yikeUtils.toast('余额不足');
              return;
          }
          var options={
              token:token,
              type:$scope.roomId,
              groupId:$scope.status.id,
              orderId:(new Date())-2147483647*623,
              order:$scope.guess.guess,
              actionNo:$scope.messag.actionNo.actionNo
          };
          loadingShow('加载中...');
        yikePcdd.affirmBet(options)
            .then(function (data) {
                $yikeUtils.toast(data.msg);
                pushMessage({
                    type:'bet',
                    id:$scope.userInfo.uid,
                    img:$scope.userInfo.avatar,
                    client_name:$scope.userInfo.username,
                    to_client_id:'all',
                    money:$scope.guess.money,
                    bonus:$scope.guess.bonus,
                    profit:$scope.guess.profit,
                    guess:JSON.stringify($scope.guess.guess),
                    period:$scope.messag.actionNo.actionNo,
                    groupId:$scope.status.id,
                    lotteryId:$scope.roomId,
                    time:$filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss"),
                    level_img:$scope.userInfo.levelImg2,
                    levels_id:$scope.userInfo.levels_id,
                });
                $scope.guess.guess=[];
                $scope.guess.guessMax=[];
                $scope.guess.money='0.000';
                $scope.guess.bonus='0.000';
                $scope.guess.profit='0.000';
                $scope.playBeishu.allBeishu=1;
                if($rootScope.betType == '聊天室'){
                    $scope.bet=false;
                }
                $scope.emptySelect();
                userinfo();
                lotteryBunko();
                $scope.closeAffirm();
                $scope.closeVoteSameModal();
                $scope.$digest();
            })
      };
      //生成开奖球
      function createLotteryBall(type) {
          $scope.messag.kjHao=[];
          for(var i=0;i<lotteryLen[type];i++){
              $scope.messag.kjHao.push('?');
          }
      }
      //农场玩法样式
      $scope.ncPlayStyle=function (playId,type) {
          if(playId == $scope.cqnc.playGroup[playId]){
              return {
                  'background':'url('+$scope.cqnc.ncImgs[type]+') 5px center no-repeat',
                  'background-size':'20px 20px',
                  'padding-left':'26px'
              }
          }
      };
      //跳转历史开奖
      $scope.pageGo=function () {
          var url='';
          if($scope.name == 'pcdd'){
              url='lucky-history-lottery';
          }else if($scope.name == 'jnd28-odds'){
              url='canada-history-lottery';
          } else if($scope.name == 'lhc-odds'){
              url='mark-six-history-lottery';
          } else if($scope.name == 'bjpk10-odds'){
              url='pk-history-lottery';
          } else if($scope.name == 'cqssc-odds'){
              url='ssc-history-lottery';
          }else if($scope.name == 'ffc-odds'){
              url='ffc-history-lottery';
          }
          $state.go(url,{id:$scope.roomId});
      };
    //推送信息
      function pushMessage(msg) {
          try{
              ws.send(JSON.stringify(msg));
          }catch (err){}
      }
  }
})();
