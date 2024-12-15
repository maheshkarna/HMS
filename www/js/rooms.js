$(document).ready(() => {
    app.database.createDB();
    app.rooms.getAllRoomsData();
    app.rooms.getAllStudentData();
    
    $('#addRoomBtn').click(function(){
      // alert('test');
      $('#add_room_card').toggle(); // Show or hide the block
      $('#RoomTable_card').hide(); 
  });

  $('#room_number').on('blur', function() {
    
    app.rooms.checkRoomNum($("#room_number").val());
});
$('#roomTable').DataTable();
    // $('#add_room_card').css({})
///////////////////////////////////////////////


$(document).on('click', '.add-row-btn', function() {
  var newRow = `
      <tr class="student-row">
          <td>
              <select class="form-control student-select" required id="student_id">
                  <option value="">Select Student</option>
                  <option value="student1">Student 1</option>
                  <option value="student2">Student 2</option>
                  <option value="student3">Student 3</option>
              </select>
          </td>
          <td class="text-center">
              <button type="button" class="btn btn-danger remove-row-btn">-</button>
          </td>
      </tr>`;
  
  $('#allocate_Table table tbody').append(newRow);
});

// Remove a student row when "-" button is clicked
$(document).on('click', '.remove-row-btn', function() {
  $(this).closest('tr').remove();
});

  // Remove a student row when "-" button is clicked
  $(document).on('click', '.remove-row-btn', function() {
  $(this).closest('.student-row').remove();
  });
});
  
  app.rooms = {
    saveRoom: () => {
      
            var roomNumber = $("#room_number").val();
            var capacity = $("#capacity").val();
            var currentOccupancy = $("#current_occupancy").val();
            // var feePerMonth = $("#fee_per_month").val();
    
            if (roomNumber == "") {
                toastr.error('Enter Room Number', '', {timeOut: 1000});
                event.preventDefault(); // Prevent form submission
            } else if (capacity == "") {
                toastr.error('Enter Room Capacity', '', {timeOut: 1000});
                event.preventDefault(); // Prevent form submission
            } else if (currentOccupancy == "") {
                toastr.error('Enter Current Occupancy', '', {timeOut: 1000});
                event.preventDefault(); // Prevent form submission
            } else {

            let saveRoomQry = `INSERT INTO rooms (room_number, capacity, current_occupancy, fee_per_month) 
            VALUES (${roomNumber},${capacity},${currentOccupancy}, 0.0);`

				    // app.database.tables.dbOparations.saveRoomData(roomNumber,capacity,currentOccupancy)
				    app.database.tables.dbOparations.execute(saveRoomQry);

                toastr.success('Room Details Submitted Successfully', '');
                setTimeout(function() {
                  location.reload();
                  }, 1000);
            }
    },
  
    getAllRoomsData: () => {
      let getRoomQry =`SELECT 
    r.room_id,
    r.room_number,
    r.capacity,
    r.current_occupancy,
    COUNT(s.student_id) AS student_count
FROM 
    rooms r
LEFT JOIN 
    students s ON r.room_number = s.room_no
GROUP BY 
    r.room_id;`;
      $.when(
          // app.database.tables.dbOparations.getRoomsData()
          app.database.tables.dbOparations.getData(getRoomQry)

      ).done(function (data) { 
        console.log(data);
          let tBody = ``;
  
          // Use a for loop to iterate over the data
          for (let i = 0; i < data.length; i++) {
              tBody += `
                  <tr>
                      <td>${i+1}</td>
                      <td>${data[i].room_number}</td>
                      <td>${data[i].capacity}</td>
                      <td>${data[i].student_count}</td>
                      <td>${data[i].capacity - data[i].student_count}</td>
                      <td>
                          <button class="btn btn-primary btn-sm" onclick="app.rooms.editRoom(${data[i].room_id})">Edit</button>
                          <button class="btn btn-danger btn-sm" onclick="app.rooms.deleteRoom(${data[i].room_id})">Dlt</button>
                          <button class="btn btn-warning btn-sm" onclick="app.rooms.allocateStudent(${data[i].room_id},${data[i].room_number})">Alct</button>
                      </td>
                  </tr>`;
          }
  
          // Append the constructed tbody to the table
          $('#rooms_Tbody').html(tBody);
      });
  },


  getStudentDatabyRoom: (room_no) => {

    let getStudentByRoomQry = `SELECT * FROM students where room_no = ${room_no}`;
    $.when(
        // app.database.tables.dbOparations.StudentByRoom(room_no)
      app.database.tables.dbOparations.getData(getStudentByRoomQry)
    ).done(function (data) { 
      console.log(data);
      $('#alctStudentTab').empty();
        let tBody = ``;

        // Use a for loop to iterate over the data
        for (let i = 0; i < data.length; i++) {
            tBody += `
                <tr>
                    <td>${i+1}</td>
                    <td>${data[i].name}</td>
                    <td>${data[i].company_or_college}</td>
                    <td> 
                        <button class="btn btn-danger btn-sm" onclick="app.rooms.removeAllocateStudent(${data[i].student_id})">Dlt</button>
                    </td>
                </tr>`;
        }

        // Append the constructed tbody to the table
        $('#alctStudentTab').html(tBody);
    });
},
  
  getAllStudentData: () => {

    let getStudenData = `SELECT * FROM students where status = 'Active' order by student_id desc;`;
    $.when(
        app.database.tables.dbOparations.getData(getStudenData)
    ).done(function (data) { 
        let tBody = `<option value="">--Select Student to Allocate--</option>`;
        // Use a for loop to iterate over the data
        for (let i = 0; i < data.length; i++) {
        tBody += `<option value="${data[i]['student_id']}">${data[i]['student_id']} - ${data[i]['name']}</option>`;
        }

        // Append the constructed tbody to the table
        $('#studentList').html(tBody);
    });
},
  
  updateRoom: () => {
    var roomId = $("#room_id").val();
    var roomNumber = $("#room_number").val();
    var capacity = $("#capacity").val();
    var currentOccupancy = $("#current_occupancy").val();
    
    let editRoomDataQry = `UPDATE rooms SET room_number = ${roomNumber}, capacity = ${capacity}, 
                  current_occupancy = ${currentOccupancy} WHERE room_id = ${roomId};`
    $.when(
        // app.database.tables.dbOparations.editRoomData(roomId, roomNumber, capacity, currentOccupancy)
        app.database.tables.dbOparations.execute(editRoomDataQry)

    ).done(function (data) { 
        toastr.success('Room Deleted Successfully', '');
        setTimeout(function() {
        location.reload();
        }, 1000);
    })
  },


  editRoom: (roomId) => {

    let getRoomByIdQry = `SELECT * FROM rooms where room_id = ${roomId} `;

      $.when(
          // app.database.tables.dbOparations.getDataById(getRoomByIdQry)
          app.database.tables.dbOparations.getData(getRoomByIdQry)

      ).done(function (data) { 
          // console.log(data);
        $('#add_room_card').toggle(); // Show or hide the block
        $('#RoomTable_card').hide(); 
        $('#editH').html('Room Edit');
        $('#updateBtn').toggle();
        $('#saveBtn').hide();
        $('#room_number').val(data[0].room_number);
        $('#capacity').val(data[0].capacity);
        $('#current_occupancy').val(data[0].current_occupancy);
        $('#room_id').val(data[0].room_id); // Assuming you have a hidden input for the room ID

      });
  },


  allocateStudent: (id,roomNum) => {

    $('#allocate_Table').toggle(); // Show or hide the block
    $('#RoomTable_card').hide(); 
    $('#RoomNum').html(roomNum);
    $('#room_no').val(roomNum);

    app.rooms.getStudentDatabyRoom(roomNum);
   
    },

    
  removeAllocateStudent: (student_id) => {
    let roomNumber = $('#room_no').val();
    let removeAllocationQry = `UPDATE students SET room_no = 0 WHERE student_id = ${student_id};`;
           $.when(
              //  app.database.tables.dbOparations.roomAllocation(0,student_id)
            app.database.tables.dbOparations.execute(removeAllocationQry)

           ).done(function (data) { 
 
             });
      app.rooms.getStudentDatabyRoom(roomNumber);
      toastr.success('Removed Successfully', '',{timeOut: 1000});
     },
  
  saveAllocation: () => {
   let studentList = $('#studentList').val();
   let roomNumber = $('#room_no').val();
      if (studentList == "") {
        toastr.error('Select Student First','', {timeOut: 1000});
        return;
      }else{
      let roomAllocationQry = `UPDATE students SET room_no = ${roomNumber} WHERE student_id = ${studentList};`;

        $.when(
            // app.database.tables.dbOparations.roomAllocation(roomNumber,studentList)
            app.database.tables.dbOparations.execute(roomAllocationQry)

        ).done(function (data) { 
          toastr.success('Room Deleted Successfully','',{timeOut: 1000});
      });
      app.rooms.getStudentDatabyRoom(roomNumber);
          
      }
    },

  deleteRoom: (roomId) => {
    let deleteRoom = `DELETE FROM rooms WHERE room_id = ${roomId};`;
    $.when(
        // app.database.tables.dbOparations.deleteRoomData(id)
        app.database.tables.dbOparations.execute(deleteRoom)

    ).done(function (data) { 
      
      toastr.success('Room Deleted Successfully', '');
      setTimeout(function() {
      location.reload();
      }, 1000);
  
      });
    },

    
  checkRoomNum: (roomId) => {
    let getRoomQry =  `SELECT * FROM rooms where room_number = ${roomId} `;

    $.when(
        // app.database.tables.dbOparations.getDataById2(id)
      app.database.tables.dbOparations.getData(getRoomQry)

    ).done(function (data) { 
      console.log(data);
      if(data != null){
        if(data.length > 0){
          toastr.error('Room Number already Existed', '',{timeOut: 1000});
          $('#room_number').val('');
        }
      }
      });
    },



  };
  


  