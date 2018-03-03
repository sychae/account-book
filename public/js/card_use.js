var my_o = {};
(function(){	
	var _cards = [];

	my_o.setCards = function (cards) {
		_cards = cards;
	}
	my_o.doSearch = function() {
		var f = document.f;
		var cardID = f.card.value;
		if (cardID == "") {
			alert("card 선택");
			f.card.focus();
			return;
		}
		var startDay = -1;
		for (var i = 0; i < _cards.length; i++) {
			if (_cards[i]._id == cardID) {
				var card = _cards[i];
				startDay = card.startDay;
				f.startDay.value = card.startDay;
				break;
			}
		}
		var yyyy = parseInt(f.yyyy.value);
		var mm = parseInt(f.mm.value);

		var tbl_body = document.getElementById("tbl_body");

		$.get(
			"use_search.do"
			, $(f).serialize()
			, function (datas) {
				var shtml = "";

				var fsthtml = "";  // 할부
				var sndhtml = "";  // 할부아님
				var fstcnt = 1;
				var sndcnt = 1;
				var fstTotal = 0;
				var fstTotal_R = 0;
				var sndTotal = 0;
				var sndTotal_R = 0;
				if (datas.length > 0) {

					for (var i = 0; i < datas.length; i++) {
						var inout = datas[i];
						var out = inout.out;

						var rebate = inout.in;

						var installment = inout.installment;
						var iDate = new Date(Date.parse(inout.issueDate));
						
						/*입금일 - 사용일 계산*/
						var dmonth = (yyyy - iDate.getFullYear())*12 +  mm - (iDate.getMonth() + 1);

						if(iDate.getDate()>=startDay) dmonth = dmonth - 1;
						var curPay = out;
						var pom = out;

						var curPay_in = rebate;
						var pom_in = rebate;

						if (installment > 1) {							
							if(inout.payType=="card") {
								pom = Math.floor(out/(installment * 100)) * 100;

								pom_in = Math.floor(rebate/(installment * 100)) * 100;
							}else{
								pom = Math.floor(out/installment);
								pom_in = Math.floor(rebate/installment);
							}

							if(dmonth==1){
								curPay = out - pom * (installment-1);
								curPay_in = rebate - pom_in * (installment-1);
							}else{
								curPay = pom;
								curPay_in = pom_in;
							}
						}
						
						var remain = pom * (installment-dmonth);
						var remain_in = pom_in * (installment-dmonth);
						//console.log(iDate.getDate(), iDate.toISOString());


						var cnt = 1;
						
						if(installment>1){
							cnt = fstcnt;
							fstTotal = fstTotal + curPay - curPay_in;
							fstTotal_R = fstTotal_R + remain - remain_in;
						}else{
							cnt = sndcnt;
							sndTotal = sndTotal + curPay - curPay_in;
							sndTotal_R = sndTotal_R + remain - remain_in;
						}
						if (rebate > 0) {
							shtml = '<tr>'
									+ '<td class="count">' +cnt + '</td>'
									+ '<td class="issueDate">' + iDate.toISOString().substring(0, 10)+ '</td>'
									+ '<td class="name">' + inout.name+ '</td>'
									+ '<td class="out">' + com_numberWithCommas(out)  + '<br/>-'+ com_numberWithCommas(rebate) +  '</td>'
									+ '<td class="installment">' + (inout.payType=="card"?"(무)":"")+ dmonth + '/' + installment + '</td>'
									+ '<td class="curOut">' + com_numberWithCommas(curPay) + '<br/>-'+ com_numberWithCommas(curPay_in) +  '</td>'
									+ '<td class="balance">' + com_numberWithCommas(remain) + '<br/>-'+ com_numberWithCommas(remain_in) +  '</td>'
									+ '</tr>';
						} else {
							shtml = '<tr>'
									+ '<td class="count">' +cnt + '</td>'
									+ '<td class="issueDate">' + iDate.toISOString().substring(0, 10)+ '</td>'
									+ '<td class="name">' + inout.name+  '</td>'
									+ '<td class="out">' + com_numberWithCommas(out) + '</td>'
									+ '<td class="installment">' + (inout.payType=="card"?"(무)":"")+ dmonth + '/' + installment + '</td>'
									+ '<td class="curOut">' + com_numberWithCommas(curPay) + '</td>'
									+ '<td class="balance">' + com_numberWithCommas(remain) + '</td>'
									+ '</tr>';
						}

						if(installment>1){
							fsthtml = fsthtml + shtml;
							fstcnt++;
						}else{
							sndhtml = sndhtml + shtml;
							sndcnt++;
						}

					}
				}
				shtml = fsthtml 
						+ '<tr class="brd_bold">'
						+ '<td colspan="5">할부 합계</td>'
						+ '<td class="curOut">' + com_numberWithCommas(fstTotal) + '</td>'
						+ '<td class="balance">' + com_numberWithCommas(fstTotal_R) + '</td>'
						+ '</tr>'
						+ sndhtml
						+ '<tr class="brd_bold">'
						+ '<td colspan="5">일시불 합계</td>'
						+ '<td class="curOut">' + com_numberWithCommas(sndTotal) + '</td>'
						+ '<td class="balance">' + com_numberWithCommas(sndTotal_R) + '</td>'
						+ '</tr>'
						+ '<tr class="">'
						+ '<td colspan="5">총 합계</td>'
						+ '<td class="curOut">' + com_numberWithCommas(fstTotal + sndTotal) + '</td>'
						+ '<td class="balance">' + com_numberWithCommas(fstTotal_R + sndTotal_R) + '</td>'
						+ '</tr>';

				tbl_body.innerHTML = shtml;
				console.log(datas);
			}
			, "json"
		);
		/*
		tbl_body.innerHTML = '<tr>'
					+ '<td class="name">내용1</td>'
					+ '<td class="out">금액</td>'
					+ '<td class="installment">할부</td>'
					+ '<td class="curOut">이달금액</td>'
					+ '<td class="balance">잔여금액</td>'
					+ '</tr>';
				<tr>
					<td class="name">내용</td>
					<td class="out">금액</td>
					<td class="installment">할부</td>
					<td class="curOut">이달금액</td>
					<td class="balance">잔여금액</td>
				</tr>


		*/
	}



})();