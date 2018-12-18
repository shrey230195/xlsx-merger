(function(){
  'use strict';

  angular.module('app')
  .directive("importSheetJs", [SheetJSImportDirective])  

  function SheetJSImportDirective() {
    return {
      scope: { 
        opts: '=' ,                
        arrayOfFiles : '=',
        viewType : '='              
      },
      link: function ($scope, $elm) {
        $elm.on('change', function (changeEvent) {
          var reader = new FileReader();

          reader.onload = function (e) {                       
            /* read workbook */
            var bstr = e.target.result;
            var workbook = XLSX.read(bstr, {type:'binary'});            
            /* DO SOMETHING WITH workbook HERE */
            var d = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);            
            $scope.$apply(function() {
              var obj = {}
              obj.headers = Object.keys(d[0]);             
              obj.data = d;
              obj.name = changeEvent.target.files[0].name; 
              obj.selectedHeaders = [];
              obj.hoverHeader = [];              
              obj.fileIndex = (parseInt($scope.arrayOfFiles.length) + 1);
              $scope.arrayOfFiles.push(obj)                                        
              $scope.viewType = obj.fileIndex;              
            })
          };

          reader.readAsBinaryString(changeEvent.target.files[0]);
        });
      }
    };
  }
}());