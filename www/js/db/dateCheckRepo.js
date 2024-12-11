app.database.tables.dateChek={
              
        getDateStatus : function(val){
          return $.Deferred(function (deferred) {
            var sql = "SELECT DATE_STATUS FROM Registration";
            var params = [];
            app.database.commands.executeReader(
              sql,
              params,
              
              function (ex, data) {
                app.log("data select successful");
                if (data.rows.length > 0) {
                  deferred.resolve(data.rows);
                } else {
                  deferred.resolve(null);
                }
              },
              function () {
                app.log("data select failed");
                deferred.reject();
              }
            );
          }).promise();
        },
  
        
        updateDateStatus:function(cDate){
          return $.Deferred(function (deferred) {  
            var sql = "UPDATE Registration SET DATE_STATUS = '"+cDate+"' WHERE ID = 1";
            var params = [];
            
              app.database.commands.executeNonQuery(
              sql,
              params,
              function () {
                app.log("task Updated successfully.");
                deferred.resolve();
              },
              function () {  
                app.log("task save error.");
                deferred.reject();
              }
            );
          }).promise();
        }, 
    }