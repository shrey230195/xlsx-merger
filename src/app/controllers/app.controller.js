(function(){
'use strict';

/* Controllers */
angular.module('app')
.controller('AppController', AppController);

	AppController.$inject = ['$scope', '$filter', '$timeout', 'exportSheetJs'];

	function AppController ($scope, $filter, $timeout, exportSheetJs) {
		$scope.toggleSelection = toggleSelection;
		$scope.buildFinalHeaders = buildFinalHeaders;
		$scope.hoverColumn = hoverColumn;
		$scope.download = download;
		$scope.querySearch = querySearch;

		$scope.viewType = 'addFile';
		$scope.fileType = 'xlsx';	
		$scope.delimiter = {};		
		$scope.delimiter.value = '|';		
		$scope.arrayOfFiles = [];

		buildFinalHeaders();

		function toggleSelection(selectedHeaders,header) {			
			if(selectedHeaders.indexOf(header)>-1){				
				var index = selectedHeaders.indexOf(header);
				selectedHeaders.splice(index,1)
			}
			else {				
				selectedHeaders.push(header)
			}
			buildFinalHeaders()
		}

		function buildFinalHeaders() {
			$scope.finalHeaders = $scope.arrayOfFiles.map(function(x){
				var selectedHeaders = x.selectedHeaders.map(function(y){
					var obj = {};
					obj.sheet = 'File ' + x.fileIndex;
					obj.fileIndex = x.fileIndex;
					obj.header = y
					return obj
				})
				return selectedHeaders
			}).reduce(function(a,b){
				return a.concat(b)
			},[])
		}

		function hoverColumn(hoverHeader,index,enter) {			
			hoverHeader[index] = enter;
		}	

		function querySearch(search,headers,selectedHeaders) {
			var arrayToSearch = headers.filter(function(x) { 
				return !selectedHeaders.includes(x);
			});			
			return $filter('filter')(arrayToSearch, {
			   $: search
			});
		}

		function download() {			
			$scope.downloadLoading = true;			
			var arrayOfFiles = $scope.arrayOfFiles;
			var upperLimit = Math.max(...arrayOfFiles.map(function(x) {return x.data.length}))						
			var finalHeaders = $scope.finalHeaders.map(function(header,index){
				header.order = index; // to pertain the order
				header.data = arrayOfFiles.filter(function(file){					
					return file.fileIndex === header.fileIndex
				})[0].data;
				header.data = header.data.map(function(x){
					var obj = {}
					obj[header.header] = x[header.header]
					return obj;
				});
				header.data = fillNa(header.data,upperLimit,'-');
				return header;
			});															
			var finalData = finalHeaders.map(function(x){return x.data})
			var mergedArrays = mergeArrays(finalData);	
			$timeout(function() {
				$scope.downloadLoading = false;
				if($scope.fileType == 'txt') {
					console.log($scope.delimiter.value)
					exportSheetJs.downloadTxt(mergedArrays,'mergedSheet.'+$scope.fileType,'sheet1',$scope.delimiter.value)					
				}
				else{
					exportSheetJs.downloadXlsx(mergedArrays,'mergedSheet.'+$scope.fileType,'sheet1')						
				}
			}, 900);
		}

		function fillNa(array,length,filler) {			
			var keys = Object.keys(array[0]);			
			var diff = Math.abs(length - array.length);
			var arrayToConcat = [];
			if(diff){
				var remainingLength = Array.from(Array(diff).keys());
				arrayToConcat = remainingLength.map(function(obj) {
					var obj = {};
					keys.map(function(key) {
						obj[key] = filler;
					});
					return obj;
				})
			}			
			return array.concat(arrayToConcat);
		}

		function mergeArrays(arrays) {
			var range = Array.from(Array(arrays[0].length).keys());
			return range.map(function(i){
				var row = arrays.map(function(array){
					return array[i]
				})				
				.reduce(function(a,b){
					return angular.extend(a,b)
				},{})				
				return row
			})			
		}
		
	};
}());