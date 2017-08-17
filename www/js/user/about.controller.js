/**
 * Created by frank on 2016/11/23.
 */
(function () {
    'use strict';

    angular
        .module('about.controller', [])
        .controller('AboutCtrl', AboutCtrl);
    AboutCtrl.$inject = ['$scope','$yikeUtils','$state','$ionicHistory','$ionicModal','localStorageService','$ionicPopup','$ionicSlideBoxDelegate','$ionicLoading','$sce'];
    /* @ngInject */
    function AboutCtrl($scope,$yikeUtils,$state,$ionicHistory,$ionicModal,localStorageService,$ionicPopup,$ionicSlideBoxDelegate,$ionicLoading,$sce){
        var token=localStorageService.get('token');
        $scope.copy=copy;
        $scope.wxcopy=wxcopy;
        $scope.download=download;
        init();
        function init() {
            loadingHideShow('加载中...',3000);
            yikePcdd.platform({token:token})
                .then(function (data) {
                    $scope.platform=data.info;
                    $scope.$digest();
                })
        }
        //复制链接
        function copy(content) {
            try{
                cordova.plugins.clipboard.copy(content);
                $yikeUtils.toast('复制成功');
            }catch (err){
                $yikeUtils.toast('复制失败');
            }

        }
        //微信复制
        function wxcopy(content) {
            if(iosis && PLATFORM == 'wap'){
                $yikeUtils.toast('ios暂不支持复制');
                return;
            }
            var save = function(e){
                e.clipboardData.setData('text/plain', content);
                e.preventDefault();
            };
            document.addEventListener('copy', save);
            document.execCommand('copy');
            document.removeEventListener('copy',save);
            $yikeUtils.toast('复制成功');
        }
        //下载二维码
        function download(photoPath) {
            loadingShow('加载中...');
            //下载成功
            var success = function (msg) {
                loadingHide();
               $yikeUtils.toast('已保存到手机相册');
            };
            //下载失败
            var error = function (err) {
                loadingHide();
                $yikeUtils.toast('下载失败');
            };
            saveImageToPhone(photoPath, success, error);
        }
        //保存到手机相册
        function saveImageToPhone(url, success, error) {
            var canvas, context, imageDataUrl, imageData;
            var img = new Image();
            img.onload = function () {
                canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);
                try {
                    imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
                    imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
                    cordova.exec(
                        success,
                        error,
                        'Canvas2ImagePlugin',
                        'saveImageDataToLibrary',
                        [imageData]
                    );
                }
                catch (e) {
                    error(e.message);
                }
            };
            try {
                img.src = url;
            }
            catch (e) {
                error(e.message);
            }
        }
    }
})();
