$(document).ready(() => {
  app.database.createDB();
  app.fieldSettings.insertFieldsData();
  $("#updateFields").click(function () {
    //app.fieldSettings.checkFormValidations();
    app.fieldSettings.getformData();
  });
});


app.fieldSettings = {
  
  checkFormValidations: ()=>{
    //app.fieldSettings.FetchAll();
   // alert("Hey Man");
    $.when(app.database.tables.fields.FetchAll())
    .done(function (data) {
      if(data != null || data != ""){
      //  let label = "_label";
        //console.log(data);
       // alert("yes i ");
        // Hide and Display  Feilds
      //  if(data[0].ISVISIBLE != "1"){
      //   document.getElementById("Vehicle_no_group").style.display ="none";
      //  }
      //  if(data[1].ISVISIBLE != "1"){
      //   document.getElementById("material_group").style.display ="none";
      //  }
      //  if(data[2].ISVISIBLE != "1"){
      //   document.getElementById("party_name_group").style.display ="none";
      //  }
      //  if(data[3].ISVISIBLE != "1"){
      //   document.getElementById("agent_group").style.display ="none";
      //  }
      //  if(data[4].ISVISIBLE != "1"){
      //   document.getElementById("qty_group").style.display ="none";
      //  }
      //  if(data[5].ISVISIBLE != "1"){
      //   document.getElementById("remark_group").style.display ="none";
      //  }


       // Validations 


      //  if(data[0].ISMANDATORY == "1" &&  document.getElementById("Vehicle_no").value ==""){
      //   alert("Please Enter Vehicle Number");
      //  }
      //  if(data[1].ISVISIBLE == "1" && document.getElementById("material").value ==""){
        
      //   alert("Please Enter Material");
      //  }
      //  if(data[2].ISVISIBLE == "1" && document.getElementById("party_name").value ==""){
      //   alert("Please Enter Material");
      //  }
      //  if(data[3].ISVISIBLE == "1" && document.getElementById("agent").value ==""){
      //   alert("Please Enter Agent");
      //  }
      //  if(data[4].ISVISIBLE == "1" && document.getElementById("qty").value ==""){
      //   alert("Please Enter Agent");
      //  }
      //  if(data[5].ISVISIBLE != "1" && document.getElementById("remark").value ==""){
      //   alert("Please Enter Remarks");
      //  }
      //  console.log(v1);
      }
    });
  },

  getformData:() =>{
  data={};
 
  let fieldlvals = [
    $("#fieldtext1").val(),
    $("#fieldtext2").val(),
    $("#fieldtext3").val(),
    $("#fieldtext4").val(),
    $("#fieldtext5").val(),
    $("#fieldtext6").val()
  ];
  
  let fieldIds = [
    $("#fieldId1").val(),
    $("#fieldId2").val(),
    $("#fieldId3").val(),
    $("#fieldId4").val(),
    $("#fieldId5").val(),
    $("#fieldId6").val()
  ];
  
  let isVisibleVals = [
    ($("#isVisble1").prop("checked") ? 1 : 0),
    ($("#isVisble2").prop("checked") ? 1 : 0),
    ($("#isVisble3").prop("checked") ? 1 : 0),
    ($("#isVisble4").prop("checked") ? 1 : 0),
    ($("#isVisble5").prop("checked") ? 1 : 0),
    ($("#isVisble6").prop("checked") ? 1 : 0)
  ];
  
  let isMandatoryVals = [
    ($("#isMandetory1").prop("checked") ? 1 : 0),
    ($("#isMandetory2").prop("checked") ? 1 : 0),
    ($("#isMandetory3").prop("checked") ? 1 : 0),
    ($("#isMandetory4").prop("checked") ? 1 : 0),
    ($("#isMandetory5").prop("checked") ? 1 : 0),
    ($("#isMandetory6").prop("checked") ? 1 : 0)
  ];

    for(var i=0;i< isVisibleVals.length;i++){
      if(isVisibleVals[i] == 0){
        isMandatoryVals[i] = 0;
      }
    }
  let checkpoint = true;
  for(let i = 0; i < fieldlvals.length; i++){
      if(fieldlvals[i].length < 2){
        alert("Feild Text "+(i+1)+" has "+fieldlvals[i]+" Should have atleast 2 characters");
        checkpoint = false;
      }
      //console.log(fieldlvals[i].length);
      //checkpoint = false;
  }

  if(checkpoint){
    for (let i = 0; i < 6; i++) {
      let fieldlval = fieldlvals[i];
      let fieldId = fieldIds[i];
      let isVisbleVal = isVisibleVals[i];
      let isMandetory = isMandatoryVals[i];
     // console.log(fieldlval);
      app.database.tables.fields.updateData(fieldlval, isVisbleVal, isMandetory, fieldId);
    }
    // alert("Settings Updated Successfully...😀👍");
    toastr.options = {
      positionClass: 'toast-bottom-right'
    };
    toastr.success('Updated Successfully...👍', '', {timeOut: 1000});
  }

  },

  insertFieldsData:()=>{
      $.when(
          app.database.tables.fields.checkFieldsData()
        ).done(function (data) {   
          console.log(data); 
          
          if(data == null || data.length == 0){
              app.database.tables.fields.insertData();
          }else{
            app.fieldSettings.showFields(data);
            
          }   
        });    
  },
     
  showFields: (data) => {
   
      if (!data) {
        return;
      }
      for (let i = 0; i < data.length; i++) {
        let j = i + 1;
       
        $("#fieldBody").append(`
          <tr>
              <td>
                  <div class="d-flex px-2">
                      <div></div>
                      <div class="my-auto">
                          <h6 class="mb-0 text-xs">${j}</h6>
                      </div>
                  </div>
              </td>
              <td>
                  <input class="form-control"   type="text" value="${data[i].FEILDTEXT}" id="fieldtext${j}" >
                  <input class="form-control" type="hidden" value="${data[i].ID}" id="fieldId${j}">
              </td>
              <td class="align-middle text-center">
                  <div class="form-check form-switch ps-0">
                      <input class="form-check-input ms-auto" type="checkbox" onchange="checkVis('isVisble${i+1}','isMandetory${i+1}')" value="${data[i].ISVISIBLE}" id="isVisble${j}" ${data[i].ISVISIBLE == 1 ? 'checked' : ''}>
                    
                  </div>
              </td>
              <td class="align-middle">
                  <div class="form-check form-switch ps-0">
                      <input class="form-check-input ms-auto" onchange="checkMandatory('isVisble${i+1}','isMandetory${i+1}')" type="checkbox" value="${data[i].ISMANDATORY}" id="isMandetory${j}" ${data[i].ISMANDATORY == 1 ? 'checked' : ''}>

                  </div>
              </td>
          </tr>
      `);
        
      }
    },

    getFeildsData : ()=>{
      //app.fieldSettings.FetchAll();
   
      $.when(app.database.tables.fields.FetchAll())
      .done(function (data) {
        if(data != null || data != ""){
          let label = "_label";
          console.log(data);
         
          // for(var i =0;i<data.length;i++){
          // document.getElementById(data[i].FEILDNAME+label).innerHTML = data[i].FEILDTEXT;
          // }
         document.getElementById("Vehicle_no_label").innerHTML = data[0].FEILDTEXT;
         document.getElementById("material_label").innerHTML = data[1].FEILDTEXT;
         document.getElementById("party_name_label").innerHTML = data[2].FEILDTEXT;
         document.getElementById("agent_label").innerHTML = data[3].FEILDTEXT;
         document.getElementById("qty_label").innerHTML = data[4].FEILDTEXT;
         document.getElementById("remark_label").innerHTML = data[5].FEILDTEXT;


         // Hide and Display  Feilds
         if(data[0].ISVISIBLE != "1"){
          document.getElementById("Vehicle_no_group").style.display ="none";
         }
         if(data[1].ISVISIBLE != "1"){
          document.getElementById("material_group").style.display ="none";
         }
         if(data[2].ISVISIBLE != "1"){
          
          document.getElementById("party_name_group").style.display ="none";
         }
         if(data[3].ISVISIBLE != "1"){
          document.getElementById("agent_group").style.display ="none";
         }
         if(data[4].ISVISIBLE != "1"){
          document.getElementById("qty_group").style.display ="none";
         }
         if(data[5].ISVISIBLE != "1"){
          document.getElementById("remark_group").style.display ="none";
         }
        }
      });
    }
};
