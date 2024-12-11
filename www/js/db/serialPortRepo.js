app.database.tables.serialPosrt  = {

    insertData: function (weighbridge,port,boadrate,currentDate) {
      
          return $.Deferred(function (deferred) {
  
            let sql =`INSERT INTO SerialPortData (WEIGHBRIDGE, PORTNO, BOADRATE, CREATEDAT) VALUES 
            ('${weighbridge}', '${port}', '${boadrate}','${currentDate}')`;
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
      
  
        updatePortData :function(weighbridge,port,boadrate,currentDate){
          return $.Deferred(function (deferred) {
            var sql =
            "UPDATE SerialPortData SET " +
            "PORTNO = '" + port + "', " +
            "BOADRATE = '" + boadrate + "', " +
            "UPDATEDAT = '" + currentDate + "' " +
            "WHERE WEIGHBRIDGE = '" + weighbridge + "'; ";
            var params = [];
            //console.log(sql);
            app.database.commands.executeNonQuery(
              sql,
              params,
              function () {
                app.log("Task saved successfully.");
                deferred.resolve();
              },
              function () {
                app.log("Task save error.");
                deferred.reject();
              }
            );
          }).promise();
  
        },
  
  
        CheckData : function(value){
          return $.Deferred(function (deferred) {
            var sql = "SELECT * FROM SerialPortData where WEIGHBRIDGE ='"+value+"'";
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
  
        // FetchAll : function(){
        //   return $.Deferred(function (deferred) {
        //     var sql = "SELECT * FROM FeildsMasterSettings";
        //     var params = [];
        //     app.database.commands.executeReader(
        //       sql,
        //       params,
        //       function (ex, data) {
        //         app.log("Data Select Successful");
        //         if (data.rows.length > 0) {
        //           deferred.resolve(data.rows);
        //         } else {
        //           deferred.resolve(null);
        //         }
        //       },
        //       function () {
        //         app.log("Data Select Failed");
        //         deferred.reject();
        //       }
        //     );
        //   }).promise();
        // }
    };