app.database.tables.task = {
  saveMultiple: (data) => {
    console.log(data);
    return $.Deferred(function (deferred) {
      var sql = "INSERT INTO todolist (TASKNAME) VALUES (?)";
      var params = [];
      var properties = ["taskName"];
      app.database.commands.executeNonQueryMultiple(
        sql,
        data,
        params,
        properties,
        [],
        function (result, info) {
          app.log(result);
          app.log(info);
          app.log("task saved successful.");
          deferred.resolve();
        },
        function () {
          app.log("task save error.");
          deferred.reject();
        }
      );
    }).promise();
  },
  save: function (taskName) {
    return $.Deferred(function (deferred) {
      var sql =
        "INSERT INTO todolist \
                    ( \
                        TASKNAME \
                    ) \
                    VALUES (?)";
      var params = [taskName];
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
  getTaskList: function () {
    return $.Deferred(function (deferred) {
      var sql = "SELECT * FROM todolist ";
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
  deleteTaskById: function (id) {
    return $.Deferred(function (deferred) {
      let sql = "DELETE FROM todolist WHERE ID = ?";
      let params = [id];
      app.database.commands.executeNonQuery(
        sql,
        params,
        function () {
          app.log("task have been successfully deleted");
          deferred.resolve();
        },
        function () {
          app.log("task have NOT been deleted");
          deferred.reject();
        }
      );
    }).promise();
  },
};

app.database.tables.creatLogins = {
  save: function (password, username) {
    return $.Deferred(function (deferred) {
      var sql =
        "INSERT INTO logins \
                    ( \
                        USERNAME, \
                        PASSWORD \
                    ) \
                    VALUES (?,?)";
      var params = [username, password];
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

  update: function (password, username, loginId) {
    return $.Deferred(function (deferred) {
      var sql =
        "update logins \
        set \
            USERNAME = ?, \
            PASSWORD = ? \
        where \
            ID = ?";
      var params = [username, password, loginId];
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

  getLoginsList: function () {
    return $.Deferred(function (deferred) {
      var sql = "SELECT * FROM logins";
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

  getLoginById: function (id) {
    return $.Deferred(function (deferred) {
      var sql = "SELECT * FROM logins WHERE ID = ?";
      var params = [id];
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

  deleteLoginById: function (id) {
    return $.Deferred(function (deferred) {
      let sql = "DELETE FROM logins WHERE ID = ?";

      let params = [id];
      app.database.commands.executeNonQuery(
        sql,
        params,
        function () {
          app.log("task have been successfully deleted");
          deferred.resolve();
        },
        function () {
          app.log("task have NOT been deleted");
          deferred.reject();
        }
      );
    }).promise();
  },

  checking: function (username, password) {
    return $.Deferred(function (deferred) {
      var sql =
        "SELECT * FROM Users WHERE USERNAME ='" +
        username +
        "'and PASSWORD ='" +
        password +
        "' and STATUS ='1'";
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
        function (error) {
          console.log(error);
          console.log("data select failed");
          deferred.reject();
        }
      );
    }).promise();
  },
  
  checkingAdm: function (username, password) {
    return $.Deferred(function (deferred) {
      var sql =
        "SELECT * FROM Registration WHERE ADMUSERNAME ='" +username+"'and ADMPASSWORD ='"+password+"'";
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
        function (error) {
          console.log(error);
          console.log("data select failed");
          deferred.reject();
        }
      );
    }).promise();
  },

};
