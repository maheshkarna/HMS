$(document).ready(() => {
    app.database.createDB();
    $('#addStudentBtn').click(function(){
      // alert('test');
      $('#add_form').toggle(); // Show or hide the block
      $('#StudentTable_card').hide(); 
  });
    app.student.getAllStudentsData();
  });
  
  app.student = {

   saveStudent: () => {
    var name = $("#name").val();
    var age = $("#age").val();
    var contact = $("#contact").val();
    var adhaar = $("#adhaar").val();
    var address = $("#address").val();
    var purpose = $("#purpose").val();
    var companyOrCollege = $("#company_or_college").val();
    // var status = $("#status").val();
    var fee = $("#fee").val();
    var joinDate = $("#join_date").val();
    var roomNo = $("#room_no").val();
    var description = $("#description").val();

    if (name == "") {
        toastr.error('Enter Student Name', '', { timeOut: 1000 });
    } else if (age == "") {
        toastr.error('Enter Age', '', { timeOut: 1000 });
    } else if (contact == "") {
        toastr.error('Enter Contact Number', '', { timeOut: 1000 });
    } else if (adhaar == "") {
        toastr.error('Enter Aadhar Number', '', { timeOut: 1000 });
    } else if (address == "") {
        toastr.error('Enter Address', '', { timeOut: 1000 });
    } else if (purpose == "") {
        toastr.error('Enter Purpose of Stay', '', { timeOut: 1000 });
    }else if (fee == "") {
        toastr.error('Enter Fee/Month', '', { timeOut: 1000 });
    } else if (joinDate == "") {
        toastr.error('Enter Join Date', '', { timeOut: 1000 });
    } else if (description == "") {
        toastr.error('Enter Description', '', { timeOut: 1000 });
    } else {
        var saveStudentQry = `INSERT INTO students 
        (name, age, contact, adhaar, address, purpose, company_or_college, status, fee,join_date, room_no, description) 
        VALUES ('${name}', ${age}, '${contact}', '${adhaar}', '${address}', '${purpose}', '${companyOrCollege}', 'Inactive', '${fee}', '${joinDate}', '${roomNo}', '${description}');`;
        // app.database.tables.dbOparations.saveStudentData(
        //     name, age, contact, adhaar, address, purpose, companyOrCollege, status,fee, joinDate, roomNo, description
        // );

        app.database.tables.dbOparations.execute(saveStudentQry);
         /// creating Fee details
    
         var getStudentMaxIdQry =  `SELECT max(student_id) as student_id FROM students`;
     $.when(
        // app.database.tables.dbOparations.getMaxStudent_id()
        app.database.tables.dbOparations.getData(getStudentMaxIdQry)

    ).done(function (data) { 
var saveFeeDataQry = `INSERT INTO fee_details (student_id, fee_date, fee_per_month, status)
                        VALUES (${data[0]['student_id']}, '${joinDate}', ${fee}, 'Pending');`;
        // app.database.tables.dbOparations.saveFeeData(data[0]['student_id'],joinDate, fee);
       
        $.when(
            // app.database.tables.dbOparations.getMaxStudent_id()
            app.database.tables.dbOparations.execute(saveFeeDataQry)
        ).done(function (data) { 
            toastr.success('Student Details Submitted Successfully', '');
            setTimeout(function() {
              location.reload();
          }, 1000);
        });
    });
       
    }
},

// Function to toggle status
changeStatus: (currentStatus, studentId) => { 
    // Determine the new status
    let newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
let changeQry = `UPDATE students SET room_no = 0, status = '${newStatus}' WHERE student_id = ${studentId}`;
    $.when(
        app.database.tables.dbOparations.execute(changeQry)
    ).done(function () {
        
        // Update the button text and click event to reflect the new status
        $(`#statusButton_${studentId}`).text(newStatus);
        $(`#statusButton_${studentId}`).attr('onclick', `changeStatus('${newStatus}', ${studentId})`);

        toastr.success(`Status updated to ${newStatus}`, '');

        setTimeout(function() {
            location.reload();
        }, 1000);

    }).fail(function () {
        toastr.error('Failed to update status', '', { timeOut: 1000 });
    });
},

updateStudent: () => {
  var studentId = $("#student_id").val(); // Hidden field for student ID
  var name = $("#name").val();
  var age = $("#age").val();
  var contact = $("#contact").val();
  var adhaar = $("#adhaar").val();
  var address = $("#address").val();
  var purpose = $("#purpose").val();
  var companyOrCollege = $("#company_or_college").val();
//   var status = $("#status").val();
  var fee = $("#fee").val();
  var joinDate = $("#join_date").val();
  var roomNo = $("#room_no").val();
  var description = $("#description").val();

  var updateStudentQry = `UPDATE students SET 
  name = '${name}', 
  age = ${age}, 
  contact = '${contact}', 
  adhaar = '${adhaar}', 
  address = '${address}', 
  purpose = '${purpose}', 
  company_or_college = '${companyOrCollege}', 
  fee = '${fee}', 
  join_date = '${joinDate}', 
  room_no = '${roomNo}', 
  description = '${description}'
 WHERE student_id = ${studentId};`;

  $.when(
    //   app.database.tables.dbOparations.updateStudentData(studentId, name, age, contact, adhaar, address, purpose, companyOrCollege, status, fee, joinDate, roomNo, description)
    app.database.tables.dbOparations.execute(updateStudentQry)

  ).done(function () { 
      toastr.success('Student Details Updated Successfully', '', { timeOut: 1000 });
      setTimeout(function() {
          location.reload();
      }, 1000);
    
  }).fail(function () {
      toastr.error('Failed to Update Student Details', '', { timeOut: 1000 });
  });
},
    
getAllStudentsData: () => {
    var getStudentDataQry = "SELECT * FROM students order by student_id desc";
  $.when(
    // app.database.tables.dbOparations.getStudentsData() 
    app.database.tables.dbOparations.getData(getStudentDataQry) 

  ).done(function (data) { 
      let tBody = ``;

      // Loop through the data to build each row
      for (let i = 0; i < data.length; i++) {
          tBody += `
              <tr>
                  <td>${data[i].student_id}</td>
                  <td>${data[i].name}</td>
                  <td>${data[i].age}</td>
                  <td>${data[i].contact}</td>
                  <td>${data[i].room_no}</td>
                  <td>${data[i].join_date}</td>
                  <td>
                      <button class="btn btn-primary btn-sm" onclick="app.student.editStudent(${data[i].student_id})">Edit</button>
                    
                      <button class="btn btn-${data[i].status =='Active' ? 'success' : 'danger'} btn-sm" onclick="app.student.changeStatus('${data[i].status}',${data[i].student_id})">${data[i].status}</button>
                  </td>
              </tr>`;
      }

      // Append the constructed tbody to the student table
      //  <button class="btn btn-danger btn-sm" onclick="app.student.deleteStudent(${data[i].student_id})">Delete</button>
      $('#students_Tbody').html(tBody);
  });
},

editStudent: (std_id) => {
    var getStudentByIdQry =  `SELECT * FROM students where student_id = ${std_id} `;

  $.when(
    //   app.database.tables.dbOparations.getStudentById(getStudentByIdQry)
      app.database.tables.dbOparations.getData(getStudentByIdQry)

  ).done(function (data) { 
    console.log(data);
      // Display the form for editing and hide the student list table
      $('#add_form').show(); // Display the edit student card
      $('#StudentTable_card').hide(); 
      // Update form header and buttons
      $('#editH').html('Edit Student');
      $('#updateBtn').show();
      $('#saveBtn').hide();
      // Fill in the form fields with the student data
      $('#name').val(data[0].name);
      $('#age').val(data[0].age);
      $('#contact').val(data[0].contact);
      $('#adhaar').val(data[0].adhaar); // If applicable
      $('#address').val(data[0].address);
      $('#purpose').val(data[0].purpose);
      $('#company_or_college').val(data[0].company_or_college);
      $('#status').val(data[0].status);
      $('#fee').val(data[0].fee);
      $('#join_date').val(data[0].join_date);
      $('#room_no').val(data[0].room_no);
      $('#description').val(data[0].description);
      $('#student_id').val(data[0].student_id); // Assuming you have a hidden input for the student ID
  });
},


deleteStudent: (studentId) => {
    var deleteStudentQry = `DELETE FROM students  WHERE student_id = ${studentId};`;
  $.when(
    //   app.database.tables.dbOparations.deleteStudentData(id)
      app.database.tables.dbOparations.execute(deleteStudentQry)
  ).done(function (data) { 
    toastr.success('Deleted Successfully', '');
    setTimeout(function() {
    location.reload();
    }, 1000);
    });
  },
  };
  