

	function initOnScan(){
		var prop;
	var array;
	var suffixKeyCodes = [];
	var prefixKeyCodes = [];


		//if (document.getElementById("iEndChar").value){
		let iEndCharData = "9,13"
	array = iEndCharData.split(",");
	for (prop in array)
	suffixKeyCodes.push(parseInt(array[prop]));
	   //			suffixKeyCodes.push(parseInt(prop));
		//}
		/*if (document.getElementById("iStartChar").value){
		array = document.getElementById("iStartChar").value.split(",")
			for (prop in document.getElementById("iStartChar").value.split(","))
	prefixKeyCodes.push(parseInt(array[prop]));
		}*/

	let timeBeforeScanTestData =100;
	let avgTimeByCharData= 30;
	let minLengthData =4;
	let iScanButtonLongPressThresholdData = 500;
	let stopPropagationData = false;
	let iPreventDefaultData = false;
	let reactToPasteData = true;
	let reactToKeyDownData = true;
	let singleScanQtyData = 1;

	var options = {
		timeBeforeScanTest: timeBeforeScanTestData,
	avgTimeByChar: avgTimeByCharData,
	minLength:minLengthData,
	suffixKeyCodes: suffixKeyCodes,
	prefixKeyCodes: prefixKeyCodes,
	scanButtonLongPressTime: iScanButtonLongPressThresholdData,
	stopPropagation: stopPropagationData,
	preventDefault: iPreventDefaultData,
	reactToPaste: reactToPasteData,
	reactToKeyDown: reactToKeyDownData,
	singleScanQty:singleScanQtyData,
		}

	// Events / Callbacks

	let iOnCompleteData = true; // onScan Callback after successful scan.
	let iOnErrorData = false;// onScanError
	let iOnKeyProcessedData = false;
	let iOnKeyDetectData = false;
	let iIgnoreIfFocusOnData = false;
	let iIgnoreIfFocusOnSelectorData ="";
	let iScanButtonKeyCodeData = false;
	let iOnScanButtonLongPressedData = false;
	let iOnPasteData = false;
	let iCompleteHandlerData = false;
	let ikeyCodeMapperData = false;
	if (iOnCompleteData){
		options.onScan = function (barcode, qty) {
			//console.log("[onScan]: Code: " + barcode + " Quantity: " + qty);
			if (barcode == null || barcode == "") return;
			//alert(barcode);
			QrCheck(barcode);
		};
		} else {
		options.onScan = function () { };
		}

	if (iOnErrorData){
		options.onScanError = function (err) {
			var sFormatedErrorString = "Error Details: {\n";
			for (var i in err) {
				sFormatedErrorString += '    ' + i + ': ' + err[i] + ",\n";
			}
			sFormatedErrorString = sFormatedErrorString.trim().replace(/,$/, '') + "\n}";
			console.log("[onScanError]: " + sFormatedErrorString);
		}; 	
		} else {
		options.onScanError = function () { };
		}


	if (iOnKeyProcessedData){
		options.onKeyProcess = function (sChar, oEvent) {
			console.log('[onKeyProcess]: Processed character "' + sChar + '"');
		};
		} else {
		options.onKeyProcess = function () { };
		}


	if (iOnKeyDetectData){
		options.onKeyDetect = function (iKey, oEvent) {
			var oEventProps = ''
				+ 'key:"' + oEvent.key + '", '
				+ 'ctrlKey:' + oEvent.ctrlKey + ', '
				+ 'altKey:' + oEvent.altKey + ', '
				+ 'shiftKey:' + oEvent.shiftKey + ', '
				+ 'metaKey:' + oEvent.metaKey + ', '
				+ 'keyCode:' + oEvent.keyCode + ', '
				+ 'charCode:' + oEvent.charCode + ', ';
			console.log('[onKeyDetect]: Detected key code "' + iKey + '". Event dump: ' + oEventProps);
		};
		} else {
		options.onKeyDetect = function () { };
		}

	if (iIgnoreIfFocusOnData){
		//document.getElementById("iIgnoreIfFocusOnSelector").removeAttribute("disabled");
		options.ignoreIfFocusOn = iIgnoreIfFocusOnSelectorData;
		} else {
		options.ignoreIfFocusOn = false;
			//document.getElementById("iIgnoreIfFocusOnSelector").disabled = "disabled";
		}

	if (iScanButtonKeyCodeData){
		options.scanButtonKeyCode = iScanButtonKeyCode;
		} else {
		options.scanButtonKeyCode = false;
		}

	if (iOnScanButtonLongPressedData){
		options.onScanButtonLongPress = function () {
			console.log("[onScanButtonLongPress]: ScanButton has been long-pressed");
		};
		} else {
		options.onScanButtonLongPress = function () { };
		}

	if (iOnPasteData){
		options.onPaste = function (sPasteString) {
			console.log("[onPaste]: Data has been pasted: " + sPasteString);
		}
	} else {
		options.onPaste = function () { };
		}

	if (iCompleteHandlerData){
		document.addEventListener('scan', scanHandler);
		} else {
		document.removeEventListener('scan', scanHandler);
		}

	if (iCompleteHandlerData){
		document.addEventListener('scanError', scanErrorHandler);
		} else {
		document.removeEventListener('scanError', scanErrorHandler);
		}

	if (ikeyCodeMapperData){
		options.keyCodeMapper = function (e) {
			var iKeyCode = e.which;
			var sChar = onScan.decodeKeyEvent(e);
			console.log('[keyCodeMapper]: Decoding key code "' + iKeyCode + '" to "' + sChar + '"')
			return sChar;
		}
	}

	try {
		onScan.attachTo(document, options);
	//console.log("onScan Started!");
		} catch(e) {
		onScan.setOptions(document, options);
	//console.log("onScansettings changed!");
		}
		

	}

	function destroyOnScan(){
		console.log("onScan destroyed!");
	onScan.detachFrom(document);	
	}

	/*function clearTextArea(){
		document.getElementById('consoleTextField').value = "";
	}*/

	function scanHandler(e){
		console.log("[scanHandler]: Code: " + e.detail.code);
	}

	function scanErrorHandler(e){
		var sFormatedErrorString = "Error Details: {\n";
	for (var i in e.detail){
		sFormatedErrorString += '    ' + i + ': ' + e.detail[i] + ",\n";
		}
		sFormatedErrorString = sFormatedErrorString.trim().replace(/,$/, '') + "\n}";
	console.log("[scanErrorHandler]: " + sFormatedErrorString);
	}

	function getonScanSettings(){
		var sFormatedErrorString = "Scanner Settings: \n";
	var aJSONArray = JSON.stringify(onScan.getOptions(document)).split(",");
	for (prop = 0; prop < aJSONArray.length - 1; prop++){
					if (aJSONArray[prop+1][0] == '\"'){
		sFormatedErrorString += aJSONArray[prop] + "," + "\n";
					} else {
		sFormatedErrorString += aJSONArray[prop] + ",";
					}
				}
	sFormatedErrorString += aJSONArray[aJSONArray.length - 1];

	console.log(sFormatedErrorString);
		
		
	}

	/*function fireTestInput(){
		var sInput = (document.getElementById("iTestInput").value || '').trim();
	if (sInput.startsWith('[') && sInput.endsWith(']')) {
		onScan.simulate(document, JSON.parse(sInput));
		} else {
		onScan.simulate(document, sInput);
		}
	}*/

	(function(){
		initOnScan();
		/*document.querySelectorAll("#playground input").forEach(function(oInput){
			if (oInput.type == 'button' || oInput.readonly) {
				return;
			}

	oInput.addEventListener('change', function(){
		console.log('onScan configuration updated');
	onScan.detachFrom(document);
	initOnScan();
			});
		});*/
	})();
