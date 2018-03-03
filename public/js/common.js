function com_intIpt(ipt, min, max) {
    ipt.addEventListener("keydown", function (evt) {
        var isCtrlOn = evt.ctrlKey;
        var isBack = (evt.key == "Backspace");
        var isDel = (evt.key == "Delete");
        var isNum = ("0123456789".indexOf(evt.key) >= 0);

        var isUp = (evt.key == "ArrowUp");
        var isDown = (evt.key == "ArrowDown");
        var isMinus = (evt.key == "Minus");

        console.log("com_intIpt", evt.key);

        if (evt.key == "Tab" || evt.key == "ArrowLeft" || evt.key == "ArrowRight") return;
        else if (isCtrlOn) evt.preventDefault();
        else if (isUp || isDown) {
            var nVal = parseInt(ipt.value);
            if (isNaN(nVal)) nVal = 0;
            nVal = (isUp) ? nVal + 1 : nVal - 1;

            if (!isNaN(min) && nVal < min) return;
            else if (!isNaN(max) && nVal > max) return;
            ipt.value = nVal;
        }else if (isBack || isDel || isNum) {

            evt.preventDefault();

            var sVal = ipt.value;
            var start = ipt.selectionStart;
            var end = ipt.selectionEnd;

            var sPrev = sVal.substring(0, start);
            while (sPrev.indexOf("0") == 0) sPrev = sPrev.substring(1);

            var sNext = sVal.substring(end);
            if (start == end) {
                if (isBack && sPrev.length > 0) sPrev = sPrev.substring(0, sPrev.length - 1);
                else if (isDel && sNext.length > 0) sNext = sNext.substring(1);
            }
            var sAdd = (isNum) ? evt.key : "";

            var nVal = parseInt(sPrev + sAdd + sNext);
            if (isNaN(nVal)) return;
            else if (!isNaN(min) && nVal < min) return;
            else if (!isNaN(max) && nVal > max) return;


            ipt.value = nVal;

        } else {
            evt.preventDefault();
        }
    }, true);
}

function com_yyyymmdd(ipt) {
    var fnc = function (sPrev, sAdd, sNext) {
        var nFst = sPrev.length + sAdd.length;
        var nSnd = sNext.length;
        if (nFst + nSnd > 8) return;

        var commaAddedNum = 0;
        if (nFst >= 6) commaAddedNum = 2;
        else if (nFst >= 4) commaAddedNum = 1;


        var nCur = nFst + commaAddedNum;
        var newVal = sPrev + sAdd + sNext;
        if (newVal.length >= 6) {
            newVal = newVal.substring(0, 4) + "-" + newVal.substring(4, 6) + "-" + newVal.substring(6);
        } else if (newVal.length >= 4) {
            newVal = newVal.substring(0, 4) + "-" + newVal.substring(4);
        }

        if (newVal == "0") ipt.value = "";
        else {
            ipt.value = newVal;
            ipt.setSelectionRange(nCur, nCur);
        }
    };

    ipt.addEventListener("paste", function (evt) {
        evt.preventDefault();

        var sVal = ipt.value;
        var start = ipt.selectionStart;
        var end = ipt.selectionEnd;

        var sPrev = sVal.substring(0, start).replace(/-/g, "");
        while (sPrev.indexOf("0") == 0) sPrev = sPrev.substring(1);
        var sNext = sVal.substring(end).replace(/\-/g, "");

        var clipboardData = evt.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('Text');

        pastedData = pastedData.replace(/\-/g, "");
        if (/^([0-9]*)$/.test(pastedData)) {
            fnc(sPrev, pastedData, sNext);
        }
    }, true);
    ipt.addEventListener("cut", function (evt) {
        evt.preventDefault();
        var sVal = ipt.value;
        var start = ipt.selectionStart;
        var end = ipt.selectionEnd;

        var sPrev = sVal.substring(0, start).replace(/\-/g, "");
        while (sPrev.indexOf("0") == 0) sPrev = sPrev.substring(1);

        var sNext = sVal.substring(end).replace(/\-/g, "");

        fnc(sPrev, "", sNext);
    }, true);
    ipt.addEventListener("keydown", function (evt) {
        var isCtrlOn = evt.ctrlKey;
        var isCtrl = (evt.key == "Control");
        var isBack = (evt.key == "Backspace");
        var isDel = (evt.key == "Delete");
        var isNum = ("0123456789".indexOf(evt.key) >= 0);

        if (isCtrlOn || evt.key == "Tab" || evt.key.indexOf("Arrow") == 0) return;
        else if (isBack || isDel || isNum) {

            evt.preventDefault();

            var sVal = ipt.value;
            var start = ipt.selectionStart;
            var end = ipt.selectionEnd;

            var sPrev = sVal.substring(0, start).replace(/\-/g, "");
            while (sPrev.indexOf("0") == 0) sPrev = sPrev.substring(1);

            var sNext = sVal.substring(end).replace(/\-/g, "");
            if (start == end) {
                if (isBack && sPrev.length > 0) sPrev = sPrev.substring(0, sPrev.length - 1);
                else if (isDel && sNext.length > 0) sNext = sNext.substring(1);
            }
            var sAdd = (isNum) ? evt.key : "";

            fnc(sPrev, sAdd, sNext);
        } else {
            evt.preventDefault();
        }
    }, true);

}

function com_currencyInput(ipt) {
    var fnc = function (sPrev, sAdd, sNext) {
        var nFst = sPrev.length + sAdd.length;
        var nSnd = sNext.length;
        var nChk = nFst - ((nSnd % 3) == 0 ? 0 : 3 - (nSnd % 3));
        var commaAddedNum = Math.ceil(nChk / 3);

        var nCur = nFst + commaAddedNum;

        var newVal = com_numberWithCommas(sPrev + sAdd + sNext);
        if (newVal == "0") ipt.value = "";
        else {
            ipt.value = newVal;
            ipt.setSelectionRange(nCur, nCur);
        }
    };

    ipt.addEventListener("paste", function (evt) {
        evt.preventDefault();

        var sVal = ipt.value;
        var start = ipt.selectionStart;
        var end = ipt.selectionEnd;

        var sPrev = sVal.substring(0, start).replace(/,/g, "");
        while (sPrev.indexOf("0") == 0) sPrev = sPrev.substring(1);
        var sNext = sVal.substring(end).replace(/,/g, "");

        var clipboardData = evt.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('Text');

        pastedData = pastedData.replace(/,/g, "");
        if (/^([0-9]*)$/.test(pastedData)) {
            fnc(sPrev, pastedData, sNext);
        }
    }, true);
    ipt.addEventListener("cut", function (evt) {
        evt.preventDefault();
        var sVal = ipt.value;
        var start = ipt.selectionStart;
        var end = ipt.selectionEnd;

        var sPrev = sVal.substring(0, start).replace(/,/g, "");
        while (sPrev.indexOf("0") == 0) sPrev = sPrev.substring(1);

        var sNext = sVal.substring(end).replace(/,/g, "");

        fnc(sPrev, "", sNext);
    }, true);
    ipt.addEventListener("keydown", function (evt) {
        var isCtrlOn = evt.ctrlKey;
        var isCtrl = (evt.key == "Control");
        var isBack = (evt.key == "Backspace");
        var isDel = (evt.key == "Delete");
        var isNum = ("0123456789".indexOf(evt.key) >= 0);

        if (isCtrlOn || evt.key == "Tab" || evt.key.indexOf("Arrow") == 0) return;
        else if (isBack || isDel || isNum) {

            evt.preventDefault();

            var sVal = ipt.value;
            var start = ipt.selectionStart;
            var end = ipt.selectionEnd;

            var sPrev = sVal.substring(0, start).replace(/,/g, "");
            while (sPrev.indexOf("0") == 0) sPrev = sPrev.substring(1);
            
            var sNext = sVal.substring(end).replace(/,/g, "");
            if (start == end) {
                if (isBack && sPrev.length > 0) sPrev = sPrev.substring(0, sPrev.length - 1);
                else if (isDel && sNext.length > 0) sNext = sNext.substring(1);
            }
            var sAdd = (isNum) ? evt.key : "";

            fnc(sPrev, sAdd, sNext);
        } else {
            evt.preventDefault();
        }
    }, true);
}

function com_chkIsDate(str) {
    if (!str) return false;
    str = str.trim();
    var arr = str.split("-");
    if (arr.length != 3) return false;

    var cYear = (new Date()).getFullYear();
    var year = parseInt(arr[0]);
    var month = parseInt(arr[1]);
    var day = parseInt(arr[2]);
    if (isNaN(year) || year < 1980 || year > cYear) return false;
    if (isNaN(month) || month < 1 || month > 12) return false;
    if (isNaN(day) || day < 1 || day > 31) return false;
    return true;
}

function com_numberWithCommas(x) {
    return (x)?x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):"0";
}

function com_currencyToInt(x, def) {
    x = x.replace(/,/g, "").trim();
    if (x == "") return def;
    else if (!com_isInt(x)) return def;
    else return parseInt(x);
}
function com_isInt(x) {
    return /^(0|[1-9][0-9]*)$/.test(x);
}
function com_dateToStr(s) {
    var d = Date.parse(s);
    if (isNaN(d)) return "";
    var date = new Date(d);
	var yyyy = date.getFullYear();
	var mm = date.getMonth() + 1;
	var date = date.getDate();
	if(mm<10) mm = '0' + mm;
	if(date<10) date = '0' + date;
	return yyyy + "-" + mm + "-" + date;
}