/**
 * Created by HL on 2017/2/15.
 */
(function(){
  'use strict';

  angular
    .module('user.code.controller',[])
    .controller('UserCodeCtrl',UserCodeCtrl);

   /*$inject*/
    UserCodeCtrl.$inject=['$scope','$yikeUtils','$state','Upload','$ionicLoading','localStorageService','$ionicPopup','$cordovaImagePicker'];
    function UserCodeCtrl($scope,$yikeUtils,$state,Upload,$ionicLoading,localStorageService,$ionicPopup,$cordovaImagePicker){
    var token=localStorageService.get('token');
    init();
    function init(){
      yikePcdd.codelink(token)
        .then(function (data) {
            $scope.images=data.result.result.pay_img;
           $scope.$digest();
         });
       }
        //微信二维码提现上传
        $scope.upload = function (file) {
            Upload.upload({
                url: wholeLink,
                data: {imgs: file,token:token,type:'pay'}
            }).then(function (resp) {
                if(resp.data.status ==1){
                    $scope.images=resp.data.result.image;
                    $yikeUtils.toast('上传成功');
                }else {
                    $yikeUtils.toast('上传失败,请重试');
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
        //上传头像
        $scope.pickImage=function() {
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
          var url=imageUri.split('?')[0];
          $scope.images=url;
          uploadImg(url);
        }, function cameraError(error) {
          // console.debug("Unable to obtain picture: " + error, "app");
        }, {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum: true,
          targetWidth:500,
          targetHeight:500
        });
      };
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
        params.type = 'pay';
        option.params = params;
        var ft = new FileTransfer();
        ft.upload(fileURL, url, onSuccess, onError, option);
        function onSuccess() {
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
