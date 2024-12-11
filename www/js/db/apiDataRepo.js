app.database.tables.apiData = {

getWeighmentData : (maxId)=>{
 

    return $.Deferred(function (deferred) {
      var sql = "";

      
if(typeof maxId === 'string' && maxId.length === 10){
  sql = "SELECT * FROM Weighments where CREATED_DATE >= '"+maxId+"';";
}else{
    if(maxId == 0){
    sql = "SELECT * FROM Weighments";
    }else{
    sql = "SELECT * FROM Weighments where ID > '"+maxId+"';";
    }
}     
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


  updateMaxId :function(data){
      return $.Deferred(function (deferred) {
        var sql =  "UPDATE Registration SET UPLOAD_MAXID = '"+data+"' WHERE ID = '1';";
        var params = [];
        app.database.commands.executeNonQuery(
          sql,
          params,
          function () {
            app.log("task Updated successfully.");
            deferred.resolve();
          },
          function () {
            app.log("task Updated error.");
            deferred.reject();
          }
        );
      }).promise();
  },

  getData : function(){
    return $.Deferred(function (deferred) {
      var sql = "SELECT * FROM Registration ";
      var params = [];
      app.database.commands.executeReader(
        sql,
        params,
        function (ex, data) {
          console.log("data select successful");
          if (data.rows.length > 0) {
          
            deferred.resolve(data.rows);
          } else {
            deferred.resolve(null);
          }
        },
        function () {
          console.log("data select failed");
          deferred.reject();
        }
      );
    }).promise();
  },


}