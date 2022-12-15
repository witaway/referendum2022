function getObj(objId) {
	if (document.getElementById) return document.getElementById(objId);
	else if (document.all) return document.all[objId];
}

// функция для контроля вводимых данных
function Control(form, n) {
	//очистка цвета полей при проверке формул в предыдущий раз
	//чтобы формулы не накладывались друг на друга
	for (i = 1; i < 4; i++) getObj('pole' + i).className = 'okColor';
	form.pole3_1.className = 'okColor';
	form.pole3_2.className = 'okColor';
	form.pole3_3.className = 'okColor';
	for (i = 8; i < 12; i++) getObj('pole' + i).className = 'okColor';
	for (i = 0; i < n; i++) getObj('CRE' + i).className = 'okColor';

	//проверка на наличие информации в полях и, что в полях введены цифры
	//поле, на котором нашлась первая ошибка окрашивается в красный цвет

	errorCount = 0;
	errorObject = 0;
	$VoiceCands = 0;

	for (i = 1; i <= 11; i++)
		if (i != 4 && i != 5 && i != 6 && i != 7) checkPole(getObj('pole' + i));
		else if (i == 4) {
			checkPole(form.pole3_1);
			checkPole(form.pole3_2);
			checkPole(form.pole3_3);
			for (j = 0; j < n; j++) {
				$VoiceCands += checkPole(getObj('CRE' + j));
			}
		}

	if (errorCount > 0) {
		if (isEmpty(errorObject)) alert('Необходимо заполнить все поля');
		else alert('Необходимо ввести числовые данные');
		errorObject.focus();
		return false;
	}

	//проверка п2<=п1
	//иначе они окрашиваются в красный цвет
	if (parseInt(form.pole2.value) > parseInt(form.pole1.value)) {
		alert(
			'Одно или несколько полей содержит неверные данные.\nПроверьте значения в выделенных полях.',
		);
		form.pole1.className = 'errorColor';
		form.pole2.className = 'errorColor';
		form.pole1.focus();
		return false;
	}

	//проверка п3<=п2
	//иначе они окрашиваются в красный цвет
	if (parseInt(form.pole3.value) > parseInt(form.pole2.value)) {
		alert(
			'Одно или несколько полей содержит неверные данные.\nПроверьте значения в выделенных полях.',
		);
		form.pole2.className = 'errorColor';
		form.pole3.className = 'errorColor';
		form.pole2.focus();
		return false;
	}

	//проверка п3=п3.1+п3.2+п3.3
	//иначе они окрашиваются в красный цвет
	if (
		parseInt(form.pole3.value) !=
		parseInt(form.pole3_1.value) +
			parseInt(form.pole3_2.value) +
			parseInt(form.pole3_3.value)
	) {
		alert(
			'Одно или несколько полей содержит неверные данные.\nДолжно п.3 = п.3.1 + п.3.2 + п.3.3\nПроверьте значения в выделенных полях.',
		);
		form.pole3.className = 'errorColor';
		form.pole3_1.className = 'errorColor';
		form.pole3_2.className = 'errorColor';
		form.pole3_3.className = 'errorColor';
		form.pole3.focus();
		return false;
	}

	//проверка п5=п2+п6+п7
	//иначе они окрашиваются в красный цвет
	if (
		parseInt(form.pole9.value) !=
		parseInt(form.pole2.value) +
			parseInt(form.pole10.value) +
			parseInt(form.pole11.value)
	) {
		alert(
			'Одно или несколько полей содержит неверные данные.\nДолжно п.5 = п.2 + п.6 + п.7\nПроверьте значения в выделенных полях.',
		);
		form.pole9.className = 'errorColor';
		form.pole2.className = 'errorColor';
		form.pole10.className = 'errorColor';
		form.pole11.className = 'errorColor';
		form.pole9.focus();
		return false;
	}

	//проверка п3=п4+п8
	//иначе они окрашиваются в красный цвет
	if (parseInt(form.pole3.value) != $VoiceCands + parseInt(form.pole8.value)) {
		alert(
			'Одно или несколько полей содержит неверные данные.\nДолжно п.3 = ∑п.4.i\nПроверьте значения в выделенных полях.',
		);
		form.pole3.className = 'errorColor';
		form.pole8.className = 'errorColor';
		for (i = 0; i < n; i++) getObj('CRE' + i).className = 'errorColor';
		getObj('CRE0').focus();
		return false;
	}

	alert('Данные введены корректно');
	return true;
}

function checkPole(pole) {
	value = 0;
	if (isEmpty(pole) || !isNumber(pole)) {
		pole.className = 'errorColor';
		errorCount++;
		if (errorCount == 1) errorObject = pole;
	} else value = parseInt(pole.value);
	return value;
}

//проверка на пустые строки
function isEmpty(elem) {
	var str = elem.value;
	if (str == null || str.length == 0) {
		//alert('Заполните все выделенные поля');
		return true;
	}
	return false;
}

//проверка на ввод нечисловых данных
function isNumber(elem) {
	var str = elem.value;
	var re = /^\d+$/;
	str = str.toString();
	if (!str.match(re)) {
		//alert('Заполните правильно поля с числовыми данными');
		return false;
	}
	return true;
}

var isDataChange = false;
errorCount = 0;
errorObject = 0;

function OnChangeText(pole) {
	isDataChange = true;
	getObj('SaveButton').disabled = false;
	getObj('SaveButton2').disabled = false;

	pole.className = 'fillColor';

	checkPole(pole);
	/*
    if (pole.value == null || pole.value.length == 0)
        pole.className="emptyColor";
    else
        pole.className="fillColor";
*/
}

function GoTo(url) {
	if (isDataChange)
		if (confirm('Содержание протокола было изменено.\nСохранить изменения?')) {
			getObj('SaveButton').click();
			return false;
		}
	location.href = url;
	return true;
}

//*/
