app.database.tables.user={
        
  createLogins: function (formdata) {
    
        return $.Deferred(function (deferred) {
          
          var sql = "INSERT INTO logins (USERNAME,PASSWORD) VALUES (?,?)";
          var params = ['admin','123456'];
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

      getMaxId : function(){
        return $.Deferred(function (deferred) {
          var sql = "SELECT MAX(ID) as maxId FROM Users";
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
      
      checkLogin:function(User,pass){
        return $.Deferred(function (deferred) {
          var sql = "SELECT * FROM logins where USERNAME = '"+User+"' and PASSWORD = '"+pass+"'";
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

      
      checkData:function(){
        return $.Deferred(function (deferred) {
          var sql = "SELECT * FROM logins ";
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


      


      updateStatus:function(status,id){
        return $.Deferred(function (deferred) {
          let sql = "update Users set  STATUS = '"+status+"' where ID = '"+id+"'";
          let params = [];
          app.database.commands.executeNonQuery(
            sql,
            params,
            function () { 
              app.log("Update successfully ");
              deferred.resolve();
            },
            function () {
              app.log("Data Not Update");
              deferred.reject();
            }
          );
        }).promise();
      },

      updateUserById: function (data) {
        return $.Deferred(function (deferred) {
          let sql = "update Users set USERNAME = '"+data.username+"' , PASSWORD = '"+data.password+"' where ID = '"+data.id+"'";
          let params = [];
          app.database.commands.executeNonQuery(
            sql,
            params,
            function () {
              app.log("Update successfully ");
              deferred.resolve();
            },
            function () {
              app.log("Data Not Update");
              deferred.reject();
            }
          );
        }).promise();
      },


      getAdminLog : function(){
        return $.Deferred(function (deferred) {
          var sql = "SELECT * FROM Registration";
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
      

      changePassword: function (newPassword,id) {
          return $.Deferred(function (deferred) {
          let sql = "update Registration set ADMPASSWORD = '"+newPassword+"' where ID = '"+id+"'";
          let params = [];
          app.database.commands.executeNonQuery(
            sql,
            params,
            function () {
              app.log("Update successfully ");
              deferred.resolve();
            },
            function () {
              app.log("Data Not Update");
              deferred.reject();
            }
          );
        }).promise();
      },
      
}