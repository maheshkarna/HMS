$(document).ready(() => {
  app.database.createDB();

  app.index.loadTask();
  $("#btnAddTask").click(function () {
    app.index.addTaskMultiple("test");
  });

  $("#btnShowVideoStream").click(function () {
    $.ajax({
      url: "http://localhost:8686/video",
      type: "GET",
      cache: false,
      //   dataType: "json", // added data type
      success: function (res) {
        console.log(res);
        setTimeout(() => {
          var player = videojs("hls-example", {}, function onPlayerReady() {
            this.src({
              type: "application/x-mpegURL",
              src: "http://localhost:8686//temp/output.m3u8",
            });
            this.play();
          });
          console.log(player);
        }, 15000);
      },
    });
  });

  $("#btnCaptureImage").click(function () {
    $.ajax({
      url: "http://localhost:8686/getimage",
      type: "GET",
      cache: false,
      //   dataType: "json", // added data type
      success: function (res) {
        console.log(res);
        setTimeout(() => {
          $("#imgVideoFile").attr(
            "src",
            "http://localhost:8686//temp/frame.png"
          );
        }, 5000);
      },
    });
  });
});
app.index = {
  addTaskMultiple: () => {
    let dataArray = [];
    let data = {};
    data.taskName = "Task name";
    dataArray.push(data);
    $.when(app.database.tables.task.saveMultiple(dataArray)).done(function () {
      app.index.loadTask();
    });
  },
  addTask: () => {
    let data = {};
    data.taskName = "Task name";
    app.database.tables.task.save(data.taskName);
    $.when(app.database.tables.task.save(data.taskName)).done(function () {
      app.index.loadTask();
    });
  },
  loadTask: () => {
    $.when(app.database.tables.task.getTaskList()).done(function (result) {
      app.log(result);
      app.index.bindTask(result);
    });
  },
  bindTask: (result) => {
    $("#divRowList").empty();
    for (let i = 0; i < result.length; i++) {
      $("#divRowList").append(
        "<div class='col-12' taskId=" +
          result[i].ID +
          ">" +
          result[i].TASKNAME +
          " " +
          result[i].ID +
          "   <a onclick='app.index.deleteTask(this);'>Delete</a></div>"
      );
    }
  },
  deleteTask: (eleObj) => {
    // app.log($(eleObj).parent().attr("taskId"));
    let taskId = $(eleObj).parent().attr("taskId");
    app.database.tables.task.deleteTaskById(taskId);
    $(eleObj).parent().remove();
  },
};
