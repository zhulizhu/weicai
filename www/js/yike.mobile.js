
//------------------------------------------彩票基础方法--------------------------
//彩票基础方法
var lottery_fnc = {
    sync_time: null,
    records: {
        lottery_id: "0",
        issue: "0000000",
        options: null
    },
    /**
     * 计算投注金额
     * @param count 注数
     * @param lottery_id 彩票ID
     * @param model 圆角分模式（0圆,1角，2分,3厘）
     * @param bet_money 投注金额（适配赔率型投注）
     * return  元
     */
    return_bet_money: function (count, model, bet_money) {
        var unit = 1;
        for (var i = 0; i < model; i++)
            unit = unit / 10;
        return bet_money ? bet_money : (unit * count * 2).toFixed(model < 2 ? 2 : model);

    },
    return_win_money: function () {

    },
    /**
     * 投注数统计
     * @param num_arr 投注号码（check）
     * @param method_id 玩法ID(check)
     * @param value_len 任选和值选择的位数长度
     * 备注:check是必须带参数,value_len为任选玩法需要待的参数
     * num_arr传参数形式[[],[],[],[]],例如我投重庆时时彩前三直选复式万位投0,1,2，千位3,4，百位传1,9，则num_arr为[[0,1,2],[3,4],[1,9]]
     *                                          投重庆时时彩定位但万位投0,1,2，千位""，百位传1,9，则num_arr为[[0,1,2],[],[1,9],[],[]]
     * 输入型投注num_arr传参形式['123','345'] 其中'123'，'345'为一组投注号码；
     */
    return_bet_count: function (num_arr, method_id, value_len) {
        var calculate_data = method_calculate_fnc[method_id];
        var count = 0;
        switch (calculate_data['method']) {
            case 'formula_num_multiply' :
                count = calculate.formula_num_multiply(num_arr);
                break;
            case 'formula_value_add' :
                count = calculate.formula_value_add(num_arr, NUM_VALUE[calculate_data['value']]);
                break;
            case 'formula_num_count' :
                count = calculate.formula_num_count(num_arr);
                break;
            case 'formula_zx_fs' :
                count = calculate.formula_zx_fs(num_arr, calculate_data['base_len']);
                break;
            case 'formula_num_fold' :
                count = calculate.formula_num_fold(num_arr, calculate_data['base_len']);
                break;
            case 'formula_zx_one_more' :
                count = calculate.formula_zx_one_more(num_arr, calculate_data['oneRow'], calculate_data['moreRow'], calculate_data['base_len']);
                break;
            case 'formula_count_fold' :
                count = calculate.formula_count_fold(num_arr, calculate_data['bet']);
                break;
            case 'formula_group' :
                count = calculate.formula_group(num_arr, num_arr.length);
                break;
            case 'formula_rx_zhi_fs' :
                count = calculate.formula_rx_zhi_fs(num_arr, calculate_data['base_len']);
                break;
            case 'formula_rx_value_add' :
                count = calculate.formula_rx_value_add(num_arr, NUM_VALUE[calculate_data['value']], calculate_data['base_len'], value_len);
                break;
            case 'formula_rx_zu_fs' :
                count = calculate.formula_rx_zu_fs(num_arr, calculate_data['base_len'], value_len);
                break;
            case 'formula_rx_zs_fs' :
                count = calculate.formula_num_fold(num_arr, calculate_data['num_len']);
                count *= calculate.formula_multiply_divide(value_len, calculate_data['base_len']);
                break;
            case 'formula_rx_zx' :
                count = calculate.formula_zx_one_more(num_arr, calculate_data['oneRow'], calculate_data['moreRow'], calculate_data['num_len']);
                count *= calculate.formula_multiply_divide(value_len, calculate_data['base_len']);
                break;
            case 'formula_rx_zl' :
                count = calculate.formula_zx_fs(num_arr, calculate_data['num_len']);
                count *= calculate.formula_multiply_divide(value_len, calculate_data['base_len']);
                break;
            case 'formula_count_no_repeat' :
                count = calculate.formula_count_no_repeat(num_arr);
                if (count < 0) {
                    //"温馨提示", "选择的号码数量不能超过40个！"
                    count = 0;
                }
                break;
            case 'formula_dt' :
                count = calculate.formula_dt(num_arr, calculate_data['limit_row'], calculate_data['base_len']);
                break;
            case 'fixed_one' :
                count = calculate.formula_num_count(num_arr);
                if (count > 0) count = 1;
                break;
            default:
                count = calculate.get_input_num_bet_counts(num_arr, calculate_data, value_len);
                break;
        }
        return count;
    }
};

var calculate = {
    //注数算法:各位数的数量相乘
    formula_num_multiply: function (num_arr) {
        var count = 1;
        for (var key in  num_arr) {
            count *= num_arr[key].length;
        }
        return count;
    },
    //注数算法：选中号码的数量
    formula_num_count: function (num_arr) {
        var count = 0;
        for (var key in num_arr) {
            count += num_arr[key].length;
        }
        return count;
    },
    //注数算法：选中号码的数量*倍数
    formula_count_fold: function (num_arr, fold) {
        var count = calculate.formula_num_count(num_arr);
        return count * fold;
    },
    //注数算法：选中号码的数量按倍数相加,参数为每选中一个号码增加的倍数
    formula_num_fold: function (num_arr, fold) {
        var count = 0;
        for (var key in num_arr) {
            for (var i = 0; i < num_arr[key].length; i++) {
                count += i * fold;
            }
        }
        return count;
    },
    //注数算法：选中号码的值相加
    formula_value_add: function (num_arr, val) {
        var count = 0;
        for (var key in num_arr) {
            for (var i = 0; i < num_arr[key].length; i++) {
                var text = num_arr[key][i];
                if (/[0][0-9]/.test(text) && text.length < 3) text = text.charAt(1);
                count += val[text];
            }
        }
        return count;
    },
    //组合算法
    formula_group: function (num_arr, num_count) {
        for (var key in num_arr) {
            num_count *= num_arr[key].length;
        }
        return num_count;
    },
    //组选120、24算法
    formula_zx_fs: function (num_arr, base_len) {
        var num_count = 0;
        for (var key in num_arr) {
            num_count += num_arr[key].length;
        }
        if (num_count < base_len)
            return 0;
        return calculate.formula_multiply_divide(num_count, base_len);
    },
    //组选
    formula_zx_one_more: function (num_arr, one_row, more_row, base_len) {
        if (num_arr[one_row].length < 1 || num_arr[more_row].length < base_len) {
            return 0;
        }
        var count = 0;
        var one_arr = num_arr[one_row];
        var more_arr = num_arr[more_row];
        for (var i = 0; i < one_arr.length; i++) {
            var one_val = one_arr[i];
            var more_len = more_arr.length;
            for (var j = 0; j < more_arr.length; j++) {
                if (one_val == more_arr[j]) {
                    more_len--;
                }
            }
            if (more_len < base_len) continue;
            count += calculate.formula_multiply_divide(more_len, base_len);
        }
        return count;
    },
    //任选和值
    formula_rx_value_add: function (num_arr, val, base_len, num_len) {
        if (num_len < base_len) return 0;
        var count = calculate.formula_value_add(num_arr, val);
        return count * calculate.formula_multiply_divide(num_len, base_len);
    },
    //任选-组选复式
    formula_rx_zu_fs: function (num_arr, base_len, num_len) {
        var count = calculate.formula_zx_fs(num_arr, base_len);
        return count * calculate.formula_multiply_divide(num_len, base_len);
    },
    //c num_len/base_len(c7/2,c5/2等)
    formula_multiply_divide: function (numLen, baseLen) {
        var count = 1;
        for (var i = 0; i < baseLen; i++) {
            count *= (numLen--);
        }
        for (; baseLen > 1; baseLen--) {
            count /= baseLen;
        }
        return count;
    },
    //任选-直选复式
    formula_rx_zhi_fs: function (num_arr, len) {
        var sum = 0;
        var arr = new Array();
        for (var key in num_arr) {
            if (num_arr[key].length > 0)
                arr[arr.length] = num_arr[key].length;
        }
        if (arr.length < len)
            return sum;
        var index = new Array();
        for (var i = 0; i < len; i++) {
            index[i] = i;
        }
        var m = 1;
        for (var i = 0; i < index.length; ++i) {
            m *= arr[index[i]];
        }
        sum += m;
        var _index = index;
        while (true) {
            var i;
            for (i = _index.length - 1; i >= 0; --i) {
                if (index[i] != i + arr.length - len) {
                    break;
                }
            }
            if (i < 0) {
                return sum;
            }
            index[i] += 1;
            for (var j = i + 1; j < len; ++j)
                index[j] = index[j - 1] + 1;
            var m = 1;
            for (var i = 0; i < index.length; ++i)
                m *= arr[index[i]];
            sum += m;
        }
        return sum;
    },
    //每个位数的号码之间不允许重复
    formula_count_no_repeat: function (num_arr) {
        var num = {};
        var count = 0;
        var num_count = 0;
        for (var key in num_arr) {
            for (var i = 0; i < num_arr[key].length; i++) {
                if (num[num_arr[key][i]] == null) num_count++;
                num[num_arr[key][i]] = 1;
                count++;
            }
        }
        if (num_arr.length > num_count) {
            return 0;
        }
        if (count > 40) {
            return -1;
        }
        return calculate.recursion_no_repeat(num_arr, 0, new Array(), 0);
    },
    //递归去重复数
    recursion_no_repeat: function (num_arr, index, arr, count) {
        var ns = num_arr[index];
        if (index < num_arr.length - 1) {
            for (var i = 0; i < ns.length; i++) {
                var flag = false;
                for (var j = 0; j < index; j++) {
                    flag = arr[j] == ns[i];
                    if (flag) {
                        break;
                    }
                }
                if (flag) {
                    continue;
                }
                arr[index] = ns[i];
                count = calculate.recursion_no_repeat(num_arr, index + 1, arr, count);
            }
        }
        else {
            for (var i = 0; i < ns.length; i++) {
                var flag = false;
                for (var j = 0; j < arr.length; j++) {
                    flag = ns[i] == arr[j];
                    if (flag) {
                        break;
                    }
                }
                if (!flag) {
                    count++;
                }
            }
        }
        return count;
    },
    formula_dt: function (num_arr, limit_row, base_len) {
        var count = 0;
        var limit_arr = num_arr[limit_row];
        if (limit_arr.length == 0 || limit_arr.length > base_len) return count;
        var arr = new Array();
        for (var i = 0; i < num_arr.length; i++) {
            if (i != limit_row) arr[arr.length] = num_arr[i];
        }
        if (limit_arr.length != 0 && limit_arr.length <= base_len) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].length == 0) {
                    return 0;
                }
                else {
                    count += arr[i].length;
                }
            }
        }
        return calculate.formula_multiply_divide(count, base_len - limit_arr.length + 1);
    },
    get_input_num_bet_counts: function (num_arr, calculate_data, value_len) {
        if (calculate_data['num_location'] != null && calculate_data['num_location'] == 'checkbox') {
            return num_arr.length * calculate.formula_multiply_divide(value_len, calculate_data['base_len'])
        }
        return num_arr.length;
    }
};

var method_calculate_fnc = {
    150001: {method: 'formula_num_multiply'},
    150030: {base_len: 5, check_type: 0},
    150031: {method: 'formula_group'},
    150041: {method: 'formula_zx_fs', base_len: 5},
    150042: {method: 'formula_zx_one_more', oneRow: 0, moreRow: 1, base_len: 3},
    150043: {method: 'formula_zx_one_more', oneRow: 1, moreRow: 0, base_len: 2},
    150044: {method: 'formula_zx_one_more', oneRow: 0, moreRow: 1, base_len: 2},
    150045: {method: 'formula_zx_one_more', oneRow: 0, moreRow: 1, base_len: 1},
    150046: {method: 'formula_zx_one_more', oneRow: 0, moreRow: 1, base_len: 1},
    150061: {method: 'formula_num_count'},
    150062: {method: 'formula_num_count'},
    150063: {method: 'formula_num_count'},
    150064: {method: 'formula_num_count'},
    150060: {method: 'formula_num_count'},
    140401: {base_len: 4, check_type: 0},
    140402: {method: 'formula_num_multiply'},
    140431: {method: 'formula_group'},
    141502: {method: 'formula_num_multiply'},
    141501: {base_len: 4, check_type: 0},
    141531: {method: 'formula_group'},
    140441: {method: 'formula_zx_fs', base_len: 4},
    140442: {method: 'formula_zx_one_more', oneRow: 0, moreRow: 1, base_len: 2},
    140443: {method: 'formula_zx_fs', base_len: 2},
    140444: {method: 'formula_zx_one_more', oneRow: 0, moreRow: 1, base_len: 1},
    141541: {method: 'formula_zx_fs', base_len: 4},
    141542: {method: 'formula_zx_one_more', oneRow: 0, moreRow: 1, base_len: 2},
    141543: {method: 'formula_zx_fs', base_len: 2},
    141544: {method: 'formula_zx_one_more', oneRow: 0, moreRow: 1, base_len: 1},
    17: {method: 'formula_num_multiply'},
    18: {'base_len': 3, 'check_type': 0},
    130331: {'method': 'formula_group'},
    130308: {'method': 'formula_value_add', 'value': 'zhi_san', num_separator: '$'},
    130332: {'method': 'formula_value_add', 'value': 'kd_san', num_separator: ','},
    20: {'method': 'formula_num_fold', 'base_len': 2},
    21: {'base_len': 3, 'check_type': 4},
    22: {'method': 'formula_zx_fs', 'base_len': 3},
    23: {'base_len': 3, 'check_type': 1},
    130307: {'base_len': 3, 'check_type': 3},
    130339: {'method': 'formula_value_add', 'value': 'zu_san', num_separator: '$'},
    130333: {'method': 'formula_count_fold', 'bet': '54', num_separator: '$'},
    'qs_hz_ws': {'method': 'formula_num_multiply'},
    'qs_ts': {'method': 'formula_num_multiply'},
    131402: {'method': 'formula_num_multiply'},
    131401: {'base_len': 3, 'check_type': 0},
    132531: {'method': 'formula_group'},
    150065: {'base_len': 3, 'check_type': 3},
    131408: {'method': 'formula_value_add', 'value': 'zhi_san', num_separator: '$'},
    131404: {'method': 'formula_num_fold', 'base_len': 2},
    131403: {'base_len': 3, 'check_type': 4},
    131406: {'method': 'formula_zx_fs', 'base_len': 3},
    131405: {'base_len': 3, 'check_type': 1},
    131439: {'method': 'formula_value_add', 'value': 'zu_san', num_separator: '$'},
    131433: {'method': 'formula_count_fold', 'bet': '54', num_separator: '$'},
    131431: {'method': 'formula_group'},
    131432: {'method': 'formula_value_add', 'value': 'kd_san', num_separator: ','},
    2: {'method': 'formula_num_multiply'},
    3: {'base_len': 3, 'check_type': 0},
    132531: {'method': 'formula_group'},
    8: {'method': 'formula_value_add', 'value': 'zhi_san', num_separator: '$'},
    132532: {'method': 'formula_value_add', 'value': 'kd_san', num_separator: ','},
    4: {'method': 'formula_num_fold', 'base_len': 2},
    5: {'base_len': 3, 'check_type': 4},
    6: {'method': 'formula_zx_fs', 'base_len': 3},
    7: {'base_len': 3, 'check_type': 1},
    132407: {'base_len': 3, 'check_type': 3},
    132539: {'method': 'formula_value_add', 'value': 'zu_san', num_separator: '$'},
    132533: {'method': 'formula_count_fold', 'bet': '54', num_separator: '$'},
    'hs_hz_ws': {'method': 'formula_num_multiply'},
    'hs_ts': {'method': 'formula_num_multiply'},
    10: {'method': 'formula_num_multiply'},
    11: {'base_len': 2, 'check_type': 0},
    120238: {'method': 'formula_value_add', 'value': 'zhi_er', num_separator: '$'},
    120232: {'method': 'formula_value_add', 'value': 'kd_er', num_separator: ','},
    120204: {'method': 'formula_zx_fs', 'base_len': 2},
    120203: {'base_len': 2, 'check_type': 1},
    120239: {'method': 'formula_value_add', 'value': 'zu_er', num_separator: '$'},
    120233: {'method': 'formula_count_fold', 'bet': 9, num_separator: '$'},
    12: {'method': 'formula_num_multiply'},
    13: {'base_len': 2, 'check_type': 0},
    123538: {'method': 'formula_value_add', 'value': 'zhi_er', num_separator: '$'},
    123532: {'method': 'formula_value_add', 'value': 'kd_er', num_separator: ','},
    14: {'method': 'formula_zx_fs', 'base_len': 2},
    15: {'base_len': 2, 'check_type': 1},
    123539: {'method': 'formula_value_add', 'value': 'zu_er', num_separator: '$'},
    123533: {'method': 'formula_count_fold', 'bet': 9, num_separator: '$'},
    9: {'method': 'formula_num_count'},
    1: {'method': 'formula_num_count'},
    19: {'method': 'formula_num_count'},
    131409: {'method': 'formula_num_count'},
    132552: {'method': 'formula_zx_fs', 'base_len': 2},
    131452: {'method': 'formula_zx_fs', 'base_len': 2},
    130352: {'method': 'formula_zx_fs', 'base_len': 2},
    141551: {'method': 'formula_num_count'},
    141552: {'method': 'formula_zx_fs', 'base_len': 2},
    150052: {'method': 'formula_zx_fs', 'base_len': 2},
    150053: {'method': 'formula_zx_fs', 'base_len': 3},
    120205: {'method': 'formula_num_multiply'},
    16: {'method': 'formula_num_multiply'},
    130337: {'method': 'formula_num_multiply'},
    132537: {'method': 'formula_num_multiply'},
    120002: {'method': 'formula_rx_zhi_fs', 'base_len': 2},
    120001: {'base_len': 2, 'check_type': 0, location: 'zx', 'num_location': 'checkbox'},
    120038: {'method': 'formula_rx_value_add', 'base_len': 2, 'value': 'zhi_er', num_separator: '$', location: 'zx'},
    120004: {'method': 'formula_rx_zu_fs', 'base_len': 2, location: 'zx'},
    120003: {'base_len': 2, 'check_type': 1, location: 'zx', 'num_location': 'checkbox'},
    120039: {'method': 'formula_rx_value_add', 'value': 'zu_er', 'base_len': 2, num_separator: '$', location: 'zx'},
    130002: {'method': 'formula_rx_zhi_fs', 'base_len': 3},
    130001: {'base_len': 3, 'check_type': 0, location: 'zx', 'num_location': 'checkbox'},
    130038: {'method': 'formula_rx_value_add', 'value': 'zhi_san', 'base_len': 3, num_separator: '$', location: 'zx'},
    130042: {'method': 'formula_rx_zs_fs', 'num_len': 2, 'base_len': 3, location: 'zx'},
    130041: {'base_len': 3, 'check_type': 2, location: 'zx', 'num_location': 'checkbox'},
    130044: {'method': 'formula_rx_zu_fs', 'base_len': 3, location: 'zx'},
    130043: {'base_len': 3, 'check_type': 1, location: 'zx', 'num_location': 'checkbox'},
    130030: {'base_len': 3, 'check_type': 3, location: 'zx', 'num_location': 'checkbox'},
    130039: {'method': 'formula_rx_value_add', 'value': 'zu_san', 'base_len': 3, num_separator: '$', location: 'zx'},
    140002: {'method': 'formula_rx_zhi_fs', 'base_len': 4},
    140001: {'base_len': 4, 'check_type': 0, location: 'zx', 'num_location': 'checkbox'},
    140041: {'method': 'formula_rx_zu_fs', 'base_len': 4, location: 'zx'},
    140042: {'method': 'formula_rx_zx', 'oneRow': 0, 'moreRow': 1, 'num_len': 2, 'base_len': 4, location: 'zx'},
    140043: {'method': 'formula_rx_zl', 'num_len': 2, 'base_len': 4, location: 'zx'},
    140044: {'method': 'formula_rx_zx', 'oneRow': 0, 'moreRow': 1, 'num_len': 1, 'base_len': 4, location: 'zx'},
    24: {method: 'formula_num_multiply'},
    25: {base_len: 3, check_type: 0},
    37: {'method': 'formula_value_add', 'value': 'zhi_san', num_separator: '$'},
    26: {method: 'formula_num_fold', 'base_len': 2},
    27: {base_len: 3, check_type: 2},
    28: {'method': 'formula_zx_fs', base_len: 3},
    29: {base_len: 3, check_type: 1},
    230007: {base_len: 3, check_type: 3},
    230008: {'method': 'formula_value_add', 'value': 'zu_san', num_separator: '$'},
    230031: {'method': 'formula_value_add', 'value': 'fc_spice_012', num_separator: '$', group: 'all_num'},
    230032: {'method': 'formula_count_fold', 'bet': 125, num_separator: '$', group: 'all_num'},
    230033: {'method': 'formula_count_fold', 'bet': 125, num_separator: '$', group: 'all_num'},
    230034: {'method': 'formula_count_fold', 'bet': 125, num_separator: '$', group: 'all_num'},
    31: {'method': 'formula_num_multiply'},
    32: {'base_len': 2, 'check_type': 0},
    35: {'method': 'formula_num_multiply'},
    36: {'base_len': 2, 'check_type': 0},
    220203: {'method': 'formula_zx_fs', 'base_len': 2},
    220204: {'base_len': 2, 'check_type': 1},
    221303: {'method': 'formula_zx_fs', 'base_len': 2},
    221304: {'base_len': 2, 'check_type': 1},
    33: {'method': 'formula_num_count'},
    220205: {'method': 'formula_num_multiply'},
    221305: {'method': 'formula_num_multiply'},
    30: {'method': 'formula_num_count'},
    34: {'method': 'formula_num_count'},
    44: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    45: {base_len: 3, check_type: 1, num_separator: ' '},
    46: {method: 'formula_zx_fs', base_len: 3, num_separator: ',', row_separator: '-'},
    330301: {base_len: 3, check_type: 1, num_separator: ' '},
    47: {
        method: 'formula_dt',
        base_len: 2,
        num_separator: ',',
        row_separator: '-',
        limit_row: 0,
        limit_rule: 'no_repeat'
    },
    39: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    320202: {base_len: 2, check_type: 1, num_separator: ' '},
    40: {method: 'formula_zx_fs', base_len: 2, num_separator: ',', row_separator: '-'},
    320201: {base_len: 2, check_type: 1, num_separator: ' '},
    41: {
        method: 'formula_dt',
        base_len: 1,
        num_separator: ',',
        row_separator: '-',
        limit_row: 0,
        limit_rule: 'no_repeat'
    },
    38: {method: 'formula_num_count', num_separator: ',', row_separator: '-'},
    330303: {method: 'formula_num_count', num_separator: ',', row_separator: '-'},
    330304: {method: 'formula_num_count', num_separator: ',', row_separator: '-'},
    350008: {'method': 'formula_num_count', num_separator: ','},
    350009: {method: 'formula_num_count', num_separator: '$'},
    310005: {method: 'formula_zx_fs', base_len: 1, num_separator: ',', row_separator: '-'},
    42: {method: 'formula_zx_fs', base_len: 2, num_separator: ',', row_separator: '-'},
    48: {method: 'formula_zx_fs', base_len: 3, num_separator: ',', row_separator: '-'},
    50: {method: 'formula_zx_fs', base_len: 4, num_separator: ',', row_separator: '-'},
    52: {method: 'formula_zx_fs', base_len: 5, num_separator: ',', row_separator: '-'},
    55: {method: 'formula_zx_fs', base_len: 6, num_separator: ',', row_separator: '-'},
    57: {method: 'formula_zx_fs', base_len: 7, num_separator: ',', row_separator: '-'},
    59: {method: 'formula_zx_fs', base_len: 8, num_separator: ',', row_separator: '-'},
    310006: {base_len: 1, check_type: 0, num_separator: ' '},
    320006: {base_len: 2, check_type: 1, num_separator: ' '},
    330006: {base_len: 3, check_type: 1, num_separator: ' '},
    340006: {'base_len': 4, check_type: 1, num_separator: ' '},
    350006: {base_len: 5, check_type: 1, num_separator: ' '},
    360006: {base_len: 6, check_type: 1, num_separator: ' '},
    370006: {base_len: 7, check_type: 1, num_separator: ' '},
    380006: {base_len: 8, check_type: 1, num_separator: ' '},
    43: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 1,
        num_separator: ',',
        row_separator: '-'
    },
    49: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 2,
        num_separator: ',',
        row_separator: '-'
    },
    51: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 3,
        num_separator: ',',
        row_separator: '-'
    },
    53: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 4,
        num_separator: ',',
        row_separator: '-'
    },
    56: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 5,
        num_separator: ',',
        row_separator: '-'
    },
    58: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 6,
        num_separator: ',',
        row_separator: '-'
    },
    60: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 7,
        num_separator: ',',
        row_separator: '-'
    },
    61: {method: 'formula_num_count', num_separator: ',', row_separator: '-'},
    62: {method: 'formula_num_count', num_separator: ',', row_separator: '-'},
    63: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    64: {method: 'formula_zx_fs', base_len: 2, num_separator: ',', row_separator: '-'},
    65: {method: 'formula_zx_fs', base_len: 2, num_separator: ',', row_separator: '-'},
    66: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    67: {method: 'formula_zx_fs', base_len: 3, num_separator: ',', row_separator: '-'},
    68: {method: 'formula_zx_fs', base_len: 3, num_separator: ',', row_separator: '-'},
    69: {method: 'formula_zx_fs', base_len: 4, num_separator: ',', row_separator: '-'},
    70: {method: 'formula_zx_fs', base_len: 5, num_separator: ',', row_separator: '-'},
    81: {method: 'formula_num_count', num_separator: ','},
    82: {method: 'formula_num_count', num_separator: ','},
    83: {method: 'formula_num_count', num_separator: ','},
    84: {method: 'formula_zx_fs', base_len: 4, num_separator: ','},
    85: {method: 'formula_num_count', num_separator: ','},
    86: {method: 'formula_num_count', num_separator: ','},
    87: {method: 'formula_zx_fs', base_len: 6, num_separator: ','},
    88: {method: 'formula_zx_fs', base_len: 5, num_separator: ','},
    89: {method: 'formula_zx_fs', base_len: 3, num_separator: ','},
    90: {method: 'formula_zx_fs', base_len: 2, num_separator: ','},
    91: {method: 'formula_zx_fs', base_len: 3, num_separator: ','},
    92: {method: 'formula_num_count', num_separator: ','},
    93: {method: 'formula_num_count', num_separator: ','},
    500001: {method: 'formula_zx_fs', base_len: 2, num_separator: ','},
    500002: {base_len: 2, check_type: 1, to_value: 'insert_comma'},
    500003: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 1,
        num_separator: ',',
        row_separator: '-'
    },
    500004: {
        method: 'formula_num_multiply',
        limit_row: 0,
        limit_rule: 'no_repeat',
        num_separator: ',',
        row_separator: '-'
    },
    500005: {base_len: 3, check_type: 2, to_value: 'insert_comma', row_separator: '-'},
    500006: {method: 'formula_num_count', num_separator: ','},
    500007: {method: 'formula_zx_fs', base_len: 3, num_separator: ','},
    500008: {base_len: 3, check_type: 1, to_value: 'insert_comma'},
    500009: {
        method: 'formula_dt',
        limit_row: 0,
        limit_rule: 'no_repeat',
        base_len: 2,
        num_separator: ',',
        row_separator: '-'
    },
    500010: {method: 'formula_value_add', value: 'ks_sbt', num_separator: '$'},
    500011: {method: 'formula_num_count', num_separator: ','},
    500012: {method: 'fixed_one', limit_rule: 'for_all', value: '', num_separator: ','},
    500013: {method: 'fixed_one', limit_rule: 'for_all', value: '', num_separator: ','},
    500014: {method: 'formula_num_count', num_separator: '$'},
    400001: {method: 'formula_num_count', num_separator: ','},
    400021: {base_len: 1, check_type: 0, num_separator: '~'},
    400002: {method: 'formula_num_count', num_separator: ','},
    400022: {base_len: 1, check_type: 0, num_separator: '~'},
    400012: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400032: {base_len: 2, check_type: 0, num_separator: ' '},
    400003: {method: 'formula_num_count', num_separator: ','},
    400023: {base_len: 1, check_type: 0, num_separator: '~'},
    400013: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400033: {base_len: 3, check_type: 0, num_separator: ' '},
    400004: {method: 'formula_num_count', num_separator: ','},
    400024: {base_len: 1, check_type: 0, num_separator: '~'},
    400014: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400034: {base_len: 4, check_type: 0, num_separator: ' '},
    400005: {method: 'formula_num_count', num_separator: ','},
    400025: {base_len: 1, check_type: 0, num_separator: '~'},
    400015: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400035: {base_len: 5, check_type: 0, num_separator: ' '},
    400006: {method: 'formula_num_count', num_separator: ','},
    400026: {base_len: 1, check_type: 0, num_separator: '~'},
    400016: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400036: {base_len: 6, check_type: 0, num_separator: ' '},
    400007: {method: 'formula_num_count', num_separator: ','},
    400027: {base_len: 1, check_type: 0, num_separator: '~'},
    400017: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400037: {base_len: 7, check_type: 0, num_separator: ' '},
    400008: {method: 'formula_num_count', num_separator: ','},
    400028: {base_len: 1, check_type: 0, num_separator: '~'},
    400018: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400038: {base_len: 8, check_type: 0, num_separator: ' '},
    400009: {method: 'formula_num_count', num_separator: ','},
    400029: {base_len: 1, check_type: 0, num_separator: '~'},
    400019: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400039: {base_len: 9, check_type: 0, num_separator: ' '},
    400010: {method: 'formula_num_count', num_separator: ','},
    400030: {base_len: 1, check_type: 0, num_separator: '~'},
    400020: {method: 'formula_count_no_repeat', num_separator: ',', row_separator: '-'},
    400040: {base_len: 10, check_type: 0, num_separator: ' '},
    400041: {method: 'formula_num_count', num_separator: ',', row_separator: '-'},
    400051: {'method': 'formula_num_multiply'},
    400052: {'method': 'formula_num_multiply'},
    400053: {'method': 'formula_num_multiply'},
    400054:{'method': 'formula_num_count', num_separator: ','},
    400055:{'method': 'formula_num_count', num_separator: ','},
    400056: {'method': 'formula_num_count','value': 'pk_lhd',num_separator: ',',group: 'all_num'}
};
var NUM_VALUE = {
    zhi_san: {
        "0": 1,
        "1": 3,
        "2": 6,
        "3": 10,
        "4": 15,
        "5": 21,
        "6": 28,
        "7": 36,
        "8": 45,
        "9": 55,
        "10": 63,
        "11": 69,
        "12": 73,
        "13": 75,
        "14": 75,
        "15": 73,
        "16": 69,
        "17": 63,
        "18": 55,
        "19": 45,
        "20": 36,
        "21": 28,
        "22": 21,
        "23": 15,
        "24": 10,
        "25": 6,
        "26": 3,
        "27": 1
    },
    kd_san: {
        "0": 10,
        "1": 54,
        "2": 96,
        "3": 126,
        "4": 144,
        "5": 150,
        "6": 144,
        "7": 126,
        "8": 96,
        "9": 54
    },
    zu_san: {
        "1": 1,
        "2": 2,
        "3": 2,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 8,
        "8": 10,
        "9": 11,
        "10": 13,
        "11": 14,
        "12": 14,
        "13": 15,
        "14": 15,
        "15": 14,
        "16": 14,
        "17": 13,
        "18": 11,
        "19": 10,
        "20": 8,
        "21": 6,
        "22": 5,
        "23": 4,
        "24": 2,
        "25": 2,
        "26": 1
    },
    "zhi_er": {
        "0": 1,
        "1": 2,
        "2": 3,
        "3": 4,
        "4": 5,
        "5": 6,
        "6": 7,
        "7": 8,
        "8": 9,
        "9": 10,
        "10": 9,
        "11": 8,
        "12": 7,
        "13": 6,
        "14": 5,
        "15": 4,
        "16": 3,
        "17": 2,
        "18": 1
    },
    "kd_er": {
        "0": 10,
        "1": 18,
        "2": 16,
        "3": 14,
        "4": 12,
        "5": 10,
        "6": 8,
        "7": 6,
        "8": 4,
        "9": 2
    },
    "zu_er": {
        "1": 1,
        "2": 1,
        "3": 2,
        "4": 2,
        "5": 3,
        "6": 3,
        "7": 4,
        "8": 4,
        "9": 5,
        "10": 4,
        "11": 4,
        "12": 3,
        "13": 3,
        "14": 2,
        "15": 2,
        "16": 1,
        "17": 1
    },
    "fc_spice_012": {
        "000": 64,
        "001": 48,
        "002": 48,
        "010": 48,
        "011": 36,
        "012": 36,
        "020": 48,
        "021": 36,
        "022": 36,
        "100": 48,
        "101": 36,
        "102": 36,
        "110": 36,
        "111": 27,
        "112": 27,
        "120": 27,
        "121": 36,
        "122": 27,
        "200": 48,
        "201": 36,
        "202": 36,
        "210": 36,
        "211": 27,
        "212": 27,
        "220": 36,
        "221": 27,
        "222": 27
    },
    "ks_sbt": {
        "6": 1,
        "7": 1,
        "8": 2,
        "9": 3,
        "10": 3,
        "11": 3,
        "12": 3,
        "13": 2,
        "14": 1,
        "15": 1
    },
    pk_lhd: {
        0: {
            num_cls: 'nb',
            row_num_count: 2,
            num: {
                '龙': 0,
                '虎': 1
            },
            sort: ['龙', '虎']
        },
        1: {
            num_cls: 'nb',
            row_num_count: 2,
            num: {
                '龙': 2,
                '虎': 3
            },
            sort: ['龙', '虎']
        },
        2: {
            num_cls: 'nb',
            row_num_count: 2,
            num: {
                '龙': 4,
                '虎': 5
            },
            sort: ['龙', '虎']
        },
        3: {
            num_cls: 'nb',
            row_num_count: 2,
            num: {
                '龙': 6,
                '虎': 7
            },
            sort: ['龙', '虎']
        },
        4: {
            num_cls: 'nb',
            row_num_count: 2,
            num: {
                '龙': 8,
                '虎': 9
            },
            sort: ['龙', '虎']
        }
    },
    pk_lhd_num: {
        num: {
            '一VS十-龙': '0',
            '一VS十-虎': '1',
            '二VS九-龙': '2',
            '二VS九-虎': '3',
            '三VS八-龙': '4',
            '三VS八-虎': '5',
            '四VS七-龙': '6',
            '四VS七-虎': '7',
            '五VS六-龙': '8',
            '五VS六-虎': '9'
        }
    }
};
//彩种
var LOTTERY = {
    "1": "重庆时时彩",
    "2": "江西时时彩",
    "3": "天津时时彩",
    "4": "福彩3D",
    "5": "排列三",
    "6": "江西11选5",
    "7": "新疆时时彩",
    "8": "重庆11选5",
    "9": "广东11选5",
    "10": "山东11选5",
    "11": "天津快乐十分",
    "12": "广东快乐十分",
    "13": "湖南快乐十分",
    "14": "上海时时乐",
    "15": "北京快乐8",
    "16": "香港六合彩",
    "17": "排列五",
    "18": "足球竞猜",
    "19": "百家乐",
    "20": "安徽11选5",
    "21": "重庆幸运农场",
    "22": "上海11选5",
    "23": "江苏快3",
    "24": "安徽快3",
    "25": "湖北快3",
    "26": "吉林快3",
    "27": "PK拾",
    "28": "秒秒彩",
    "29": "分分彩",
    "30": "五分彩",
    "32": "幸运28",
    "46": "北京五分彩",
    "47": "韩国1.5分彩",
    "48": "加拿大1.5分彩",
    "49": "台湾5分彩"
};
//彩票类型
var LOTTERY_TYPE = {
    '1': '时时彩',
    '2': '福彩',
    '3': '11选5',
    '4': '快乐十分',
    '5': '快乐8',
    '6': '香港六合彩',
    '7': '足球竞猜',
    '8': '百家乐',
    '9': '快三',
    '10': 'pk10',
    '11': '幸运28',
    '14': '幸运农场'
};
//彩种分类
var LOTTERY_METHOD = {
    '1': '1',
    '2': '1',
    '3': '1',
    '4': '2',
    '5': '2',
    '6': '3',
    '7': '1',
    '8': '3',
    '9': '3',
    '10': '3',
    '11': '4',
    '12': '4',
    '13': '4',
    '14': '2',
    '15': '5',
    '16': '6',
    '17': '1',
    '18': '7',
    '19': '8',
    '20': '3',
    '21': '14',
    '22': '3',
    '23': '9',
    '24': '9',
    '25': '9',
    '26': '9',
    '27': '10',
    '28': '1',
    '29': '1',
    '30': '1',
    '32': '13',
    "46": "1",
    "47": "1",
    "48": "1",
    "49": "1"
};
