$(document).ready(() => {
    app.database.createDB();

    
      app.serialPorts.checkData();

    $("#updateoprtData").click(function () {
      app.serialPorts.updatePortData();
    });  
  });
  
  
  
  app.serialPorts = {

  
    savePortData:() =>{
      app.database.tables.serialPosrt.insertData();
    },


    updatePortData:() =>{
      let FilePath = $('#filePath').val();
      let ID = $('#Pathhid').val();
      
      let currentDate = new Date().toISOString().slice(0, 10)
      app.database.tables.serialPosrt.updatePortData(FilePath,currentDate,ID);
    },

     checkData : ()=>{
          

          $.when(
            app.database.tables.serialPosrt.CheckData()
          ).done(function (data) {   
            console.log(data);  
            if(data !=null && data.length > 0 ){
                // alert("Data Avilable");
             document.getElementById("saveoprtData").style.display = "none";
             document.getElementById("updateoprtData").style.display = "block";

             $('#filePath').val(data[0].filePath);
             $('#Pathhid').val(data[0].ID);
             
            // app.cameraSettings.appendData(data);
    
            }else{
                app.serialPorts.savePortData();
                document.getElementById("saveoprtData").style.display = "block";
                document.getElementById("updateoprtData").style.display = "none";
             //   app.cameraSettings.UpdateCamerasData();
            }
           
          });

      }

  };
  