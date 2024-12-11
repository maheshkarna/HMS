app.database.tables.dbOparations={
   
  execute: function (Quary) {
    return $.Deferred(function (deferred) {
var sql = Quary;
      var params = [];
      app.database.commands.executeNonQuery(
        sql,
        params,
        function () {
          app.log("task saved successfully.");
          deferred.resolve();
        },
        function () {
          app.log("task save error.");
          deferred.reject();
        }
      );
    }).promise();
  },


  getData : function(quary){
    return $.Deferred(function (deferred) {
var sql = quary;
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

/////////////////////////////////////////////////////////////////

}