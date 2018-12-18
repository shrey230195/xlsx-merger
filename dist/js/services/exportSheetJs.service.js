'use strict';

angular.module('app')
.service("exportSheetJs", function() {
		var JSONToCSVConvertor = function(JSONData, ReportTitle, ShowLabel,delimiter) {
		   //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
		   var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
		   var date = new Date();
		   var CSV = '';
		   //This condition will generate the Label/Header
		   if (ShowLabel) {
		     var row = "";

		     //This loop will extract the label from 1st index of on array
		     for (var index in arrData[0]) {
		         //Now convert each value to string and comma-seprated
		         row += index + delimiter;
		     }

		     row = row.slice(0, -1);

		     //append Label row with line break
		     CSV += row + '\r\n';
		   }

		   //1st loop is to extract each row
		   for (var i = 0; i < arrData.length; i++) {
		     var row = "";
		     //2nd loop will extract each column and convert it in string comma-seprated
		     for (var index in arrData[i]) {
		         row += arrData[i][index] + delimiter;
		     }
		     row.slice(0, row.length - 1);
		     //add a line break after each row
		     CSV += row + '\r\n';
		   }

		   if (CSV == '') {
		     alert("Invalid data");
		     return;
		   }

		   //Generate a file name
		   var fileName = '';
		   //this will remove the blank-spaces from the title and replace it with an underscore
		   fileName += ReportTitle.replace(/ /g, "_");

		   //Initialize file format you want csv or xls
		   var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

		   // Now the little tricky part.
		   // you can use either>> window.open(uri);
		   // but this will not work in some browsers
		   // or you will not get the correct file extension

		   //this trick will generate a temp <a /> tag
		   var link = document.createElement("a");
		   link.href = uri;

		   //set the visibility hidden so it will not effect on your web-layout
		   link.style = "visibility:hidden";
		   link.download = fileName;

		   //this part will append the anchor tag and remove it after automatic click
		   document.body.appendChild(link);
		   link.click();
		   document.body.removeChild(link);
		};

		this.downloadTxt = function(JSONData, ReportTitle, ShowLabel,delimiter){
		   JSONToCSVConvertor(JSONData,  ReportTitle, ShowLabel, delimiter)
		}
	
		this.downloadXlsx = function(data,fileName,sheetName) {
			var ws = XLSX.utils.json_to_sheet(data);

			/* add to workbook */
			var wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, sheetName);

			/* write workbook and force a download */
			return XLSX.writeFile(wb, fileName);
		}		


});