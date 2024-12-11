
app.log = function (msg) {
  console.trace(msg);
};

app.executeFunction = function (func, a, b, c, d, e) {
  if (typeof func == "function") {
    func(a, b, c, d, e);
  }
};


String.format = String.prototype.format = function () {
  var i = 0,
    l = 0;
  var string = typeof this == "function" && !i++ ? arguments[0] : this;
  while (i < arguments.length) {
    string = string.replaceAll("{" + l + "}", arguments[i]);
    i++;
    l++;
  }
  return string;
};

$(document).ready(function () {

  // alert('test');
  // $("#uploadButton").click(function () {
  //   var formData = new FormData();
  //   formData.append("uploadFile", $("#uploadFile")[0].files[0]);
  //   $.ajax({
  //     url: "/upload",
  //     type: "POST",
  //     data: formData,
  //     processData: false, // tell jQuery not to process the data
  //     contentType: false, // tell jQuery not to set contentType
  //     success: function (data) {
  //       console.log(data);
  //     },
  //     error: function (error) {
  //       console.log(error);
  //     },
  //   });
  });

