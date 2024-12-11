$(document).ready(() => {
    app.database.createDB();
    app.apiData.autobacup();
});


app.apiData = {

  //autoUploading data
    autobacup:()=>{
      $.when(app.database.tables.apiData.getData())
      .done(function(data) {
       if(data[0].UPLOAD_MAXID > 0){
       
            if(navigator.onLine){
              let currentDate = new Date();
              let isoDate = currentDate.toISOString().slice(0,10);   
              $.when(app.database.tables.apiData.getWeighmentData(data[0].UPLOAD_MAXID))
              .done(function(data){
                
                if(data !=null && data[0].CREATED_DATE < isoDate){
                  alert(data[0].CREATED_DATE+','+isoDate)
                  app.apiData.sendData(data[0].ID -1);
                }
              });
          }else{
          }
        }
      });
    },

    //manual uploading Data
     getData:()=>{
        $.when(app.database.tables.apiData.getData())
        .done(function(data) {
          if(navigator.onLine){
            if(data !=null){
            //app.apiData.sendData(data[0].UPLOAD_MAXID);
             let fDate = $('#fDate').val();
             app.apiData.sendData(fDate);
            }else{
              toastr.error('no Data ', '', {timeOut: 2000});
            }
          }else{
            toastr.error('Please Check your Internet Connection ', '', {timeOut: 2000});
          }
      });
    },


  // SEND dATA tO THE API...........
  sendData: (id) => {
    $.when(app.database.tables.apiData.getWeighmentData(id))
      .done(function (data) {
        if (data != null && data.length > 0) {
          let Wt_data = [];
          let Wt_Images = {};
          let countid = 0;
          let subData = {};
          let maxid = 0;
          
  if (data != null && data.length > 0) {
   $("#spinner").show();
  let tempSet = [];
  for (let x = 0; x < data.length; x++) {
    tempSet.push(data[x]);

    if (tempSet.length === 10 || x === data.length - 1) {
      Wt_data.push(tempSet);
      tempSet = [];
    }

    if (data[x].TARE_CAMERAONE !== "no Image" ) {
      if(data[x].TARE_CAMERAONE !== null){
        Wt_Images[countid] = data[x].TARE_CAMERAONE;
      countid += 1;
      }
    }

    if (data[x].TARE_CAMERATWO !== "no Image") {
    if (data[x].TARE_CAMERATWO !==  null) {
      Wt_Images[countid] = data[x].TARE_CAMERATWO;
      countid += 1;
    }
    }

    if (data[x].TARE_CAMERATHREE !== "no Image") {
    if (data[x].TARE_CAMERATHREE !== null) {
      Wt_Images[countid] = data[x].TARE_CAMERATHREE;
      countid += 1;
    }
    }

    if (data[x].GROSS_CAMERAONE !== "no Image") {
    if (data[x].GROSS_CAMERAONE !== null) {
      Wt_Images[countid] = data[x].GROSS_CAMERAONE;
      countid += 1;
    } 
    }

    if (data[x].GROSS_CAMERATWO !== "no Image") {
    if (data[x].GROSS_CAMERATWO !== null) {
      Wt_Images[countid] = data[x].GROSS_CAMERATWO;
      countid += 1;
    }
    }

    if (data[x].GROSS_CAMERATHREE !== "no Image") {
      if (data[x].GROSS_CAMERATHREE !== null) {
        Wt_Images[countid] = data[x].GROSS_CAMERATHREE;
        countid += 1;
      }
    }
  }
  
  subData.action = 'saveWT';
  subData.length = data.length;
  maxid = data[data.length - 1].ID;
  subData.cc = data[data.length - 1].CC;
  Wt_Images.imgCount = countid;
}
      //Wt_data.length
      for (let j = 0; j < Wt_data.length; j++) {
          let Wt_Images2={imgCount:0};
          
          if(j == Wt_data.length-1){
            app.apiData.sendDatatoAPI(Wt_data[j],subData,Wt_Images,maxid);
          }else{
            app.apiData.sendDatatoAPI(Wt_data[j],subData,Wt_Images2,0);
          }
      }
      }else{  
        toastr.error('There is no pending data to upload to the server', '', {timeOut: 2000});
        // alert('There is no pending data to upload to the server.');
      }
    });
  },

      sendDatatoAPI: (Wt_data,subData,Wt_Images,maxid)=>{
      $.ajax({
            url: "http://localhost:8686/postAPI_WeighmentData",
            type: "GET",
            cache: false,
            data: {Wt_data: Wt_data ,Wt_Images : Wt_Images,subData : subData,maxid : maxid},
            success: function (data) {
              if(data !== '0'){
                app.database.tables.apiData.updateMaxId(data);
                $("#spinner").hide();
                toastr.success('Data Uploaded Successfully ', '', {timeOut: 2000});
              }
            }
          });
      }
};