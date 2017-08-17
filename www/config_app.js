/**
 * Created by frank on 2017/7/18.
 */
var tepPre = 'templates/';
var isson='son';
var djsTime={indexTime:'', ctime:''};
var indexFlag=false;
var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var iosis=!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var kf='http://www.baidu.com';
var WX_ID = 1;
 //var WX_API_URL = "http://pcdd.real1902.com/index.php";//开发
   var WX_API_URL = "http://wc.yike1908.com/index.php";//微彩测试
// var WX_API_URL = "http://www.zo54.cn/index.php";//微彩正式
// var webSocketLink = '103.84.108.82:8282';//开发
  var webSocketLink = '103.84.108.82:9292';//微彩测试
// var webSocketLink = '103.84.108.82:7272';//微彩正式
//var wholeLink = 'http://pcdd.real1902.com/index.php?s=/home/sendMsg/changAvatar';//上传头像路径 开发
   var wholeLink = 'http://wc.yike1908.com/index.php?s=/home/sendMsg/changAvatar';//上传头像路径 微彩测试
// var wholeLink = 'http://www.zo54.cn/index.php?s=/home/sendMsg/changAvatar';//上传头像路径 微彩正式
//缓存文件版本控制，年+月+日+当日更新次数
var CACHE_FILE = {
    mobiscroll1:'lib/mobiscroll/dev/js/mobiscroll.core-2.5.2.js',
    mobiscroll2:'lib/mobiscroll/dev/js/mobiscroll.core-2.5.2-zh.js',
    mobiscroll3:'lib/mobiscroll/dev/js/mobiscroll.datetime-2.5.1.js',
    mobiscroll4:'lib/mobiscroll/dev/js/mobiscroll.datetime-2.5.1-zh.js',
    ngFileUpload:'lib/ng-file-upload/ng-file-upload.min.js',
    ngFileUploadShim:'lib/ng-file-upload/ng-file-upload-shim.min.js',
    qrcode:'lib/jquery/jquery.qrcode.min.js',
    mobiscrollcss1:'lib/mobiscroll/dev/css/mobiscroll.core-2.5.2.css',
    mobiscrollcss2:'lib/mobiscroll/dev/css/mobiscroll.animation-2.5.2.css',
    mobiscrollcss3:'lib/mobiscroll/dev/css/mobiscroll.sense-ui-2.5.1.css',
    moment:'lib/moment/moment.min.js'
};