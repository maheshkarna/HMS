let app = {};
let _db = null;
app.database = {
  //version: "1.0.0", //update this while pushing a new version of DB and use this for comparision
  version: "",
  databaseName: "localDB",
  description: "localDB description",
  databaesObj: null,
  tables: {},
  createDB: () => {
    app.database.databaesObj = openDatabase(
      app.database.databaseName,
      app.database.version,
      app.database.description,
      4 * 1024 * 1024,
      (dbObj) => {
        console.log(dbObj);
        _db = dbObj;
        //app.database.setDBVersion();
        app.database.createDBTables();
      }
    );
    _db = app.database.databaesObj;
    console.log(_db);
  },
  setDBVersion: () => {
    _db.version = app.database.version;
    console.log(_db);
  },
  
  createDBTables: () => {

    _db.transaction(
      (tx) => {
        tx.executeSql(todolist);
        tx.executeSql(expenses);
        tx.executeSql(students);
        tx.executeSql(fee_details);
        tx.executeSql(room_allocations);
        tx.executeSql(rooms);
        tx.executeSql(logins);
        tx.executeSql(payments);
        tx.executeSql(expCategory);
        tx.executeSql(expSubcategory);
        
        app.log("table creattion done");
      },
      (error) => {

        console.log(error);
      }
    );
  },

  commands: {
    executeNonQuery: function (sql, params, onSuccess, onError) {
      _db.transaction(function (tx) {
        tx.executeSql(sql, params, onSuccess, function (tx, ex) {
          app.database.handlers.onErrorHandler(tx, ex);
          if (onError) {
            app.executeFunction(onError, tx, ex);
          }
        });
      });
    },
    executeReader: function (sql, params, onSuccess, onError) {
      if (!_db) {
        onError();
        return;
      }
      _db.transaction(function (tx) {
        tx.executeSql(sql, params, onSuccess, function (tx, ex) {
          app.database.handlers.onErrorHandler(tx, ex);
          if (onError) {
            app.executeFunction(onError, tx, ex);
          }
        });
      });
    },
    executeNonQueryMultiple: function (
      sql,
      data,
      params,
      properties,
      customParams,
      onSuccess,
      onError
    ) {
      if (data && data.length > 0) {
        _db.transaction(
          function (tx) {
            var args = [];
            console.log(properties);
            for (var l = 0; l < properties.length; l++) {
              args.push(String.format('item["{0}"]', properties[l]));
            }

            var strParams = String.format("[{0}]", args.join(","));
            for (var i = 0, item = null; i < data.length; i++) {
              console.log(data);
              item = data[i];
              console.log(strParams);
              var sqlParams = eval(strParams);
              sqlParams = (params || []).concat(sqlParams);

              var _customParams = [];
              for (var n = 0; n < (customParams || []).length; n++) {
                _customParams.push(eval(customParams[n]));
              }

              sqlParams = sqlParams.concat(_customParams);

              tx.executeSql(
                sql,
                sqlParams,
                function () {},
                function (tx, ex) {
                  app.database.handlers.onErrorHandler(tx, ex);
                  if (onError) {
                    app.executeFunction(onError, tx, ex);
                  }
                }
              );
            }
          },
          function (tx, ex) {
            app.database.handlers.onErrorHandler(tx, ex);
            if (onError) {
              app.executeFunction(onError, tx, ex);
            }
          },
          function () {
            app.executeFunction(onSuccess);
          }
        );
      } else {
        app.executeFunction(onSuccess);
      }
    },
  },
  handlers: {
    onErrorHandler: function onError(tx, ex, onErrorCallback) {
      app.log("DbError: " + ex.message + " (Code: " + ex.code + ")");
      app.executeFunction(onErrorCallback, tx, ex);
    },
  },
};

app.executeFunction = function (func, a, b, c, d, e) {
  if (typeof func == "function") {
    func(a, b, c, d, e);
  }
};
