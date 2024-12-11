$(document).ready(() => {
    app.database.createDB();

    $("#saveoprtData").click(function () {
      app.serialPorts.savePortData();
    });

    $("#updateoprtData").click(function () {
      app.serialPorts.updatePortData();
    });
    
  
  });
  
  
  
  app.serialPorts = {

    savePortData:() =>{
      let weighbridge = $('#weightBridge').val();
      let port =  $('#port').val();
      let boadrate = $('#boadrate').val();
      let currentDate = new Date().toISOString().slice(0, 10)
      app.database.tables.serialPosrt.insertData(weighbridge,port,boadrate,currentDate);
    },


    updatePortData:() =>{
      let weighbridge = $('#weightBridge').val();
      let port =  $('#port').val();
      let boadrate = $('#boadrate').val();
      let currentDate = new Date().toISOString().slice(0, 10)
      app.database.tables.serialPosrt.updatePortData(weighbridge,port,boadrate,currentDate);
    },

     checkData : (i)=>{
          let value = i.value;

          $.when(
            app.database.tables.serialPosrt.CheckData(value)
          ).done(function (data) {   
            console.log(data);  
            if(data !=null && data.length > 0 ){
                //alert("Data Avilable");
             document.getElementById("saveoprtData").style.display = "none";
             document.getElementById("updateoprtData").style.display = "block";

             $('#weightBridge').val(data[0].WEIGHBRIDGE);
             $('#port').val(data[0].PORTNO);
             $('#boadrate').val(data[0].BOADRATE);
            // app.cameraSettings.appendData(data);
    
            }else{
                document.getElementById("saveoprtData").style.display = "block";
                document.getElementById("updateoprtData").style.display = "none";
             //   app.cameraSettings.UpdateCamerasData();
            }
           
          });

      }

  };
  