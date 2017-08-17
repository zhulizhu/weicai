/**
 *
 * @param url
 * @constructor
 */

function yikePcdd(url) {
    this.url = url;// this.openid = openid;
}
yikePcdd.prototype = {
    constructor: yikePcdd,
    /**
     * 基础查询函数
     * @param data
     * @returns {AV.Promise}
     */
    query: function (data) {
        var promise = new AV.Promise();
        var url = this.url+'?s='+data.s;
        delete data.s;
        $.ajax({
            url: url,
            dataType: 'json',
            data:data,
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            success: function (data) {
                var status = data.status;
                if (status == 1) {
                    promise.resolve(data);
                }
                else if (status == -1) {
                    promise.reject(data);
                }
                else if (status == 0) {
                    try{
                        toast(data.msg);
                    }catch (err){}
                    promise.reject(data);
                } else if (status == -3) {//账号别处登陆
                    promise.reject(data);
                    try{
                        toast(data.msg);
                    }catch (err){
                        alert(data.msg);
                    }
                    if(PLATFORM != 'wechat'){
                        location.href = '#/login';
                    }
                } else if (status == -4) {//账户禁用
                    promise.reject(data);
                    location.href = '#/disable-user';
                } else if (status == -5) {//网站关闭
                    promise.reject(data);
                    popup.alert({
                        title:'公告提示',
                        template:data.msg ,
                        okText:'朕知道了'
                    });
                }
                loadingHide();
            },
            error: function (i, data) {
                connectionTimeout();
                loadingHide();
                promise.reject(data);
            }
        });
        return promise;
    },
    /**
     *获取银行列表
     * @param options
     */
    bankList: function (options) {
        options.s='/home/user/bankName';
        return this.query(options);
    },

    /**
     * pcdandan-d的心接口
     * @param options
     * @returns {*|AV.Promise}
     */
    dIndexContent: function (options) {
        options.s='/home/notice/index';
        return this.query(options);
    },
    /**
     * 绑定银行卡
     * @param options
     * @returns {*|AV.Promise}
     */
    bindBankCard: function (options) {
        options.s='/home/user/setCBAccount';
        return this.query(options);
    },
    /**
     * 轮播图
     * @returns {*|AV.Promise}
     */
    banner: function (options) {
        options.s='/home/banner/lists';
        return this.query(options);
    },
    /**
     * 游戏列表
     * @param options
     * @returns {*|AV.Promise}
     */
    gameList: function (options) {
        options.s='/home/type/lists';
        return this.query(options);
    },

    /**
     * 玩法
     * @param options
     * @returns {*|AV.Promise}
     */
    playGame: function (options) {
        options.s='/home/type/showOdds';
        return this.query(options);
    },
    /**
     * 最新新闻
     * @param options
     * @returns {*|AV.Promise}
     */
    newWin: function (options) {
        options.s='/home/banner/newWin';
        return this.query(options);
    },

    /**
     * 注册
     * @param options
     * @returns {*|AV.Promise}
     */
    register: function (options) {
        options.s='/home/user/register';
        return this.query(options);
    },
    /**
     * 注册协议
     * @returns {*|AV.Promise}
     */
    registrationProtocol: function () {
        return this.query({
            do: 'agreement'
        });
    },
    /**
     * 登陆
     * @param options
     * @returns {*|AV.Promise}
     */
    login: function (options) {
        options.s='/home/user/login';
        return this.query(options);
    },
    /**
     * 用户信息
     * @param options
     * @returns {*|AV.Promise}
     */
    userinfo:function (options) {
        options.s='/home/user/info';
        return this.query(options);
    },
    /**
     * 判断银行卡是否绑定
     * @param options
     * @returns {*|AV.Promise}
     */
    isBinding: function (options) {
        options.s='/home/user/bankList';
        return this.query(options);
    },
    /**
     * 提现记录
     * @param options
     * @returns {*|AV.Promise}
     */
    Withdraw_record: function (options) {
        options.s='/home/type/Withdraw_record';
        return this.query(options);
    },
    /**
     * 提现记录详情
     * @param options
     * @returns {*|AV.Promise}
     */
    Withdraw_veiw: function (options) {
        options.s='/home/type/Withdraw_veiw';
        return this.query(options);
    },
    /**
     * 常见问题
     * @param options
     * @returns {*|AV.Promise}
     */
    faq_lists: function (options) {
        options.s='/home/type/faq_lists';
        return this.query(options);
    },

    /**
     * 判断是否已添加提现密码
     * @param options
     * @returns {*|AV.Promise}
     */
    isCoinPwd: function (options) {
        options.s='/home/user/isCoinPwd';
        return this.query(options);
    },
    /**
     * 判断是否已绑定手机
     * @param options
     * @returns {*|AV.Promise}
     */
    isMobile: function (options) {
        options.s='/home/user/isMobile';
        return this.query(options);
    },
    /**
     * 确认投注
     * @param options
     * @returns {*|AV.Promise}
     */
    affirmBet: function (options) {
        options.s='/home/game/postCode';
        return this.query(options);
    },
    /**
     * 获取所有彩种的历史开奖
     * @param options
     * @returns {*|AV.Promise}
     */
    allHistoryLottery: function (options) {
        options.s='/home/type/lotteryTrend';
        return this.query(options);
    },
    /**
     * 玩法列表
     * @param options
     * @returns {*|AV.Promise}
     */
    playList: function (options) {
        options.s='/home/type/getPlayedGroup';
        return this.query(options);
    },
    /**
     * 获取彩种的历史开奖
     * @param options
     * @returns {*|AV.Promise}
     */
    historyLottery: function (options) {
        options.s='/home/type/lotteryType';
        return this.query(options);
    },
    /**
     *添加提现密码
     * @param options
     * @returns {*|AV.Promise}
     */
    addWithdrawPwd: function (options) {
        options.s='/home/user/setCoinPwd';
        return this.query(options);
    },
    /**
     * 修改提现密码
     * @param options
     * @returns {*|AV.Promise}
     */
    changeWithdrawPwd: function (options) {
        options.s='/home/user/updateCoinPwd';
        return this.query(options);
    },
    /**
     * 修改登录密码
     * @param options
     * @returns {*|AV.Promise}
     */
    changeLoginPwd: function (options) {
        options.s='/home/user/setPasswd';
        return this.query(options);
    },
    /**
     * 重置密码
     * @param options
     * @returns {*|AV.Promise}
     */
    resetPassword: function (options) {
        options.s='/home/user/repass';
        return this.query(options);
    },
    /**
     * 退出登录
     * @param options
     * @returns {*|AV.Promise}
     */
    logout: function (options) {
        options.s='/home/user/logout';
        return this.query(options);
    },
    /**
     * 修改个人资料
     * @param options
     * @returns {*|AV.Promise}
     */
    modificatioInformation: function (options) {
        options.s='/home/user/changeInfo';
        return this.query(options);
    },
    /**
     *账变记录
     * @param options
     * @constructor
     */
    accountChangeRecord: function (options) {
        options.s='/home/type/coin';
        return this.query(options);
    },
    /**
     *账变记录详情
     * @param options
     * @constructor
     */
    coinDetail: function (options) {
        options.s='/home/type/coinDetail';
        return this.query(options);
    },
    /**
     * 获取平台信息
     * @returns {*|AV.Promise}
     */
    platform: function (options) {
        options.s='/home/about/about';
        return this.query(options);
    },
    /**
     * 用户银行卡列表
     * @param optinos
     * @returns {*|AV.Promise}
     */
    userBankCard: function (optinos) {
        optinos.s='home/user/bank';
        return this.query(optinos);
    },
    /**
     * 解绑银行卡
     * @param options
     * @returns {*|AV.Promise}
     */
    changeUserBankCard:function (options) {
        options.s='/home/user/unbind';
        return this.query(options);
    },
    /**
     * 双面长龙排行
     * @param options
     * @returns {*|AV.Promise}
     */
    sidedRanking:function (options) {
        options.s='/home/type/sidedRanking';
        return this.query(options);
    },
    /***
     * 系统公告列表
     * @param options
     * @returns {*|AV.Promise}
     */
    announceList: function (options) {
        options.s='/home/notice/index';
        return this.query(options);
    },
    /***
     * 登陆提示公告
     * @param options
     * @returns {*|AV.Promise}
     */
    loginAnnounce: function (options) {
        options.s='/home/notice/is_popup';
        return this.query(options);
    },
    /***
     * 自动下注列表，快捷下注列表
     * @param options
     * @returns {*|AV.Promise}
     */
    quickBetList: function (options) {
        options.s='/home/type/quickBet';
        return this.query(options);
    },
    /***
     * 下注
     * @param options
     * @returns {*|AV.Promise}
     */
    oneBetting: function (options) {
        options.s='/home/type/oneBetting';
        return this.query(options);
    },
    /***
     * 确认注单列表
     * @param options
     * @returns {*|AV.Promise}
     */
    getOneBet: function (options) {
        options.s='/home/type/getOneBet';
        return this.query(options);
    },
    /**
     * 游戏记录
     * @param options
     * @returns {*|AV.Promise}
     */
    gameRecord: function (options) {
        options.s='/home/type/gameLog';
        return this.query(options);
    },
    /**
     * 游戏记录详情
     * @param options
     * @returns {*|AV.Promise}
     */
    gameRecordDetail: function (options) {
        options.s='/home/type/gameLogDetail';
        return this.query(options);
    },
    /**
     * 设置默认银行卡
     * @param options
     * @returns {*|AV.Promise}
     */
    bankDefault: function (options) {
        options.s='/home/user/changDefaultBank';
        return this.query(options);
    },
    /**
     * 提现申请
     * @param options
     * @returns {*|AV.Promise}
     */
    depositApply: function (options) {
        options.s='/home/teamCount/cashRecord';
        return this.query(options);
    },
    /**
     * 提现默认银行卡和次数
     * @param options
     * @returns {*|AV.Promise}
     */
    depositBankNum: function (options) {
        options.s='/home/teamCount/cashLists';
        return this.query(options);
    },
    /**
     * 充值方式
     * @param options
     * @returns {*|AV.Promise}
     */
    rechargeWay: function (options) {
        options.s='/home/type/rechargeModel';
        return this.query(options);
    },
    /**
     * 充值账号
     * @param options
     * @returns {*|AV.Promise}
     */
    pays: function (options) {
        options.s='/home/type/recharge_list';
        return this.query(options);
    },
    /**
     * 充值信息
     * @param options
     * @returns {*|AV.Promise}
     */
    rechargeMsg: function (options) {
        options.s='/home/type/recharge_view';
        return this.query(options);
    },
    /**
     * 充值
     * @param options
     * @returns {*|AV.Promise}
     */
    payss: function (options) {
        options.s='/home/type/recharge_add';
        return this.query(options);
    },
    /**
     * 游戏记录详情
     * @param options
     * @returns {*|AV.Promise}
     */
    jilu: function (options) {
        options.s='/home/type/gameLogDetail';
        return this.query(options);
    },
    /**
     * 会员列表
     * @param options
     * @returns {*|AV.Promise}
     */
    memberLists: function (options) {
        options.s='/home/member/lists';
        return this.query(options);
    },
    /**
     * 会员详情
     * @param options
     * @returns {*|AV.Promise}
     */
    memberDetail: function (options) {
        options.s='/home/member/memberDetail';
        return this.query(options);
    },
    /**
     * 新增会员
     * @param options
     * @returns {*|AV.Promise}
     */
    memberaddMember: function (options) {
        options.s='/home/member/addMember';
        return this.query(options);
    },
    /**
     * 推广链接获取
     * @param options
     * @returns {*|AV.Promise}
     */
    linkList: function (options) {
        options.s='/home/member/linkList';
        return this.query(options);
    },
    /**
     * 新增推广链接
     * @param options
     * @returns {*|AV.Promise}
     */
    addLink: function (options) {
        options.s='/home/member/addLink';
        return this.query(options);
    },
    /**
     * 团队统计的头部统计
     * @param options
     * @returns {*|AV.Promise}
     */
    topCount: function (options) {
        options.s='/home/teamCount/topCount';
        return this.query(options);
    },
    /**
     * 团队统计查询列表
     * @param options
     * @returns {*|AV.Promise}
     */
    teamList: function (options) {
        options.s='/home/teamCount/lists';
        return this.query(options);
    },
    /**
     * 下级资金流水
     * @param options
     * @returns {*|AV.Promise}
     */
    capitallist: function (options) {
        options.s='/home/member/capitallist';
        return this.query(options);
    },
    /**
     * 下级资金流水详情
     * @param options
     * @returns {*|AV.Promise}
     */
    capitaldetail: function (options) {
        options.s='/home/member/capitaldetail';
        return this.query(options);
    },
    /**
     * 下级投注彩种列表
     * @param options
     * @returns {*|AV.Promise}
     */
    getgame: function (options) {
        options.s='/home/member/getgame';
        return this.query(options);
    },
    /**
     * 下级投注列表
     * @param options
     * @returns {*|AV.Promise}
     */
    betslist: function (options) {
        options.s='/home/member/betslist';
        return this.query(options);
    },
    /**
     * 下级投注详情
     * @param options
     * @returns {*|AV.Promise}
     */
    betsDetail: function (options) {
        options.s='/home/member/betsDetail';
        return this.query(options);
    },
    /**
     * 充值记录
     * @param options
     * @returns {*|AV.Promise}
     */
    recharge_record: function (options) {
        options.s='/home/type/recharge_record';
        return this.query(options);
    },
    /**
     * 充值记录详情
     * @param options
     * @returns {*|AV.Promise}
     */
    recharge_record_details: function (options) {
        options.s='/home/type/recharge_record_view';
        return this.query(options);
    },
    /**
     * 用户消息
     * @param options
     * @returns {*|AV.Promise}
     */
    user_message: function (options) {
        options.s='/home/type/InMail_show';
        return this.query(options);
    },
    /**
     * 用户消息详情
     * @param options
     * @returns {*|AV.Promise}
     */
    user_message_details: function (options) {
        options.s='/home/type/InMail_view';
        return this.query(options);
    },
    /**
     * 平台公告详情
     * @param options
     * @returns {*|AV.Promise}
     */
    platform_advertisement_details: function (options) {
        options.s='/home/notice/info';
        return this.query(options);
    },
    /**
     * 是否显示客服
     * @returns {*|AV.Promise}
     */
    is_show_serve: function () {
        var options={};
        options.s='/home/banner/isOpenKeFu';
        return this.query(options);
    },
    /**
     * 删除会员链接
     * @param options
     * @returns {*|AV.Promise}
     */
    deleteLink: function (options) {
        options.s='/home/member/deleteLink';
        return this.query(options);
    },
    /**
     * 游戏规则
     * @param options
     * @returns {*|AV.Promise}
     */
    getOddsRule: function (options) {
        options.s='/home/type/getOddsRule';
        return this.query(options);
    },
    /**
     * 彩种今日输赢
     * @param options
     * @returns {*|AV.Promise}
     */
    lotteryBunko: function (options) {
        options.s='/home/type/win';
        return this.query(options);
    },
    /**
     * 客服二维码
     * @returns {*|AV.Promise}
     */
    serveCode: function () {
        var options={};
        options.s='/home/index/serviceEwm';
        return this.query(options);
    }
    ,
    /**
     * 优惠活动列表
     * @param options
     * @returns {*|AV.Promise}
     */
    activity: function (options) {
        options.s='/home/activity/lists';
        return this.query(options);
    }
    ,
    /**
     * 活动详情
     * @param options
     * @returns {*|AV.Promise}
     */
    activityDetails: function (options) {
        options.s='/home/activity/details';
        return this.query(options);
    },
    /**
     * 签到日历详情
     * @param options
     * @returns {*|AV.Promise}
     */
    daySign: function (options) {
        options.s='/home/activity/sign';
        return this.query(options);
    },
    /**
     * 领取签到奖励
     * @param options
     * @returns {*|AV.Promise}
     */
    consign: function (options) {
        options.s='/home/activity/consign';
        return this.query(options);
    },
    /**
     * 签到操作
     * @param options
     * @returns {*|AV.Promise}
     */
    signok: function (options) {
        options.s='/home/activity/signok';
        return this.query(options);
    },
    /**
     * 签到抽奖
     * @param options
     * @returns {*|AV.Promise}
     */
    signSend: function (options) {
        options.s='/home/activity/signSend';
        return this.query(options);
    },
    /**
     * 微信注册绑定
     * @param options
     * @returns {*|AV.Promise}
     */
    wechatRegister: function (options) {
        options.s='/home/user/bindNew';
        return this.query(options);
    },
    /**
     * 微信账号绑定
     * @param options
     * @returns {*|AV.Promise}
     */
    wechatAccountBind: function (options) {
        options.s='/home/user/bindExist';
        return this.query(options);
    }
};
//var openid = elocalStorage.get('openid') || '';
var yikePcdd = new yikePcdd(WX_API_URL, WX_ID);
