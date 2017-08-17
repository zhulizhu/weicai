/**
 * Created by john on 2016/8/30.
 */
(function () {
    'use strict';

    angular
        .module('account.controller', [[CACHE_FILE['ngFileUpload'],CACHE_FILE['ngFileUploadShim']]])
        .controller('AccountCtrl', AccountCtrl);
    AccountCtrl.$inject = ['$scope','$yikeUtils','Upload','$ionicActionSheet','$rootScope','$ionicTabsDelegate','localStorageService','$ionicLoading'];
    /* @ngInject */
    function AccountCtrl($scope,$yikeUtils,Upload,$ionicActionSheet,$rootScope,$ionicTabsDelegate,localStorageService,$ionicLoading){
        var token=localStorageService.get('token');
        $scope.info=info;
        init();
        function init() {
            try{$rootScope.closeHomeServe.hide();}catch (err){}
            $scope.user=$rootScope.tabCache.account;
            if($rootScope.tabCache.account == ''){
                loadingHideShow('加载中...',3000);
            }
            info();
            if(isiOS && PLATFORM == 'app'){
                $("#account .account_header").css({'height':'234px','padding-top':'20px'});
            }
        }
        //个人信息
        function info(){
            var options={
                token:token
            };
            yikePcdd.userinfo(options)
                .then(function (data) {
                    $scope.user=data.info;
                    $rootScope.tabCache.account=data.info;
                    //判断图片是否加载完成
                    var userimg=$('.touxiang img');
                    // userimg.load(function () {
                    //     console.log('头像加载成功');
                    // });
                    userimg.error(function () {
                        $scope.user.avatar='img/account/user.png';
                        $scope.$digest();
                    });
                    $scope.$digest();
                })
        }
        //微信头像上传
        $scope.upload = function (file) {
            Upload.upload({
                url: wholeLink,
                data: {imgs: file,token:token}
            }).then(function (resp) {
                if(resp.data.status ==1){
                    $scope.user.avatar=resp.data.info.avatar;
                    $yikeUtils.toast('上传成功');
                }else {
                    $yikeUtils.toast('上传失败');
                }
                // console.log('Success ' + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                $yikeUtils.toast('上传失败,请重试');
                // console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $ionicLoading.show({
                    template: "已经上传：" + progressPercentage + "%"
                });
                if (progressPercentage > 99.9) {
                    $ionicLoading.hide();
                }
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };
        //头像上传
        $scope.addAttachment = function() {
            if(PLATFORM == 'wechat'){
                $scope.hideSheet=$ionicActionSheet.show({
                    buttons: [
                        { text: '相册' },
                        { text: '摄像头' }
                    ],
                    cancelText: '取消',
                    cssClass:'sheet-style',
                    cancel: function() {
                        return true;
                    },
                    buttonClicked: function(index) {
                        if(index == 0){
                            pickImagew();
                        }else {
                            photoUploadw();
                        }
                    }
                });
            }
            if(PLATFORM == 'app'){
                $scope.hideSheet=$ionicActionSheet.show({
                    buttons: [
                        { text: '相册' },
                        { text: '摄像头' }
                    ],
                    cancelText: '取消',
                    cssClass:'sheet-style',
                    cancel: function() {
                        return true;
                    },
                    buttonClicked: function(index) {
                        if(index == 0){
                            pickImage();
                        }else {
                            photoUpload();
                        }
                    }
                });
            }

        };
        //上传头像(微信相册)
        function pickImagew(){
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    var tempFilePaths = res.tempFilePaths;
                    wx.uploadFile({
                        url: 'http://wc.yike1908.com/index.php?s=home/sendMsg/chatBackground', //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData:{
                            'user': 'test'
                        },
                        success: function(res){
                            var data = res.data;
                            //do something
                        }
                    })
                }
            })
        }
        //上传头像(微信拍照)
        function photoUploadw() {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    var tempFilePaths = res.tempFilePaths;
                    wx.uploadFile({
                        url: 'http://wc.yike1908.com/index.php?s=home/sendMsg/chatBackground', //仅为示例，非真实的接口地址
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData:{
                            'user': 'test'
                        },
                        success: function(res){
                            var data = res.data;
                            //do something
                        }
                    })
                }
            })
        }

        //上传头像
        function pickImage() {
            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                var url=imageUri.split('?')[0];
                $scope.user.avatar=url;
                uploadImg(url);
            }, function cameraError(error) {
                // console.debug("Unable to obtain picture: " + error, "app");
                // $yikeUtils.toast('上传失败');
            }, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                saveToPhotoAlbum: true,
                targetWidth:200,
                targetHeight:200
            });
        }
        //拍照上传
        function photoUpload() {
            navigator.camera.getPicture(onPSuccess, onFail, { quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                targetWidth:200,
                targetHeight:200
            });
            function onPSuccess(imageURI) {
                $scope.user.avatar=imageURI;
                uploadImg(imageURI);
            }

            function onFail(message) {
                // $yikeUtils.toast('Failed because: ' + message);
            }
        }
        //上传服务器
        function uploadImg(img) {
            var fileURL = img;
            var url = encodeURI(wholeLink);
            var option = new FileUploadOptions();
            option.fileKey = "imgs";
            option.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            option.mimeType = "image/jpeg";
            var params = {};
            params.token = token;
            option.params = params;
            var ft = new FileTransfer();
            ft.upload(fileURL, url, onSuccess, onError, option);
            function onSuccess(data) {
              $scope.hideSheet();
              if(JSON.parse(data.response).status == 1){
                $yikeUtils.toast('上传成功');
              }else{
                $yikeUtils.toast("上传失败");
              }
            }
            //图片上传失败回调
            function onError(error) {
                $yikeUtils.toast("上传失败，请重试");
                // $yikeUtils.toast("错误发生了，请重试 " + error.code);
                // console.log("upload error source " + error.source);
                // console.log("upload error target " + error.target);
            }
        }
    }
})();
