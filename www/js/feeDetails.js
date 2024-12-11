$(document).ready(() => {
    app.database.createDB();
    $('#addStudentBtn').click(function(){
      // alert('test');
      $('#add_form').toggle(); // Show or hide the block
      $('#StudentTable_card').hide(); 
  });
    app.fee.getFeeAllDetails();
    // app.fee.feeStatusCheck(1);
  });
  
app.fee = {
  getFeeAllDetails: () => {
    // Set today's date as the default value for the "To Date" input
    let today = new Date().toISOString().split('T')[0];
    $('#toDate').val(today);

    // Query to fetch fee details
    let getFeeDetails = `
        SELECT st.status, st.student_id, st.name, fd.*, 
               (SELECT SUM(payment_amount) FROM payments WHERE fee_id = fd.fee_id) AS total_payment 
        FROM students st 
        LEFT JOIN fee_details fd ON st.student_id = fd.student_id 
        WHERE st.status = 'Active' 
        ORDER BY 
            CASE WHEN fd.status = 'Pending' THEN 0 ELSE 1 END, 
            fd.fee_date DESC;
    `;

    $.when(
        app.database.tables.dbOparations.getData(getFeeDetails) // Adjust this to your actual function
    ).done(function (data) {
        let tBody = ``;
        let totalFeePerMonth = 0;
        let totalPaymentAmount = 0;

        // Loop through the data to construct rows and calculate totals
        for (let i = 0; i < data.length; i++) {
            totalFeePerMonth += parseFloat(data[i].fee_per_month) || 0;
            totalPaymentAmount += parseFloat(data[i].total_payment) || 0;

            tBody += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${data[i].name}</td>
                    <td>${data[i].fee_date}</td>
                    <td>${data[i].fee_per_month}</td>
                    <td>${data[i].status}</td>
                    <td>
                      <button 
                        class="btn btn-sm ${data[i].status == 'Pending' ? 'btn-warning' : 'btn-success'}" 
                        onclick="app.fee.showPaymentSection(${data[i].fee_id})">
                        ${data[i].status == 'Pending' ? 'Pending - Fee' : 'Completed - Fee'}
                      </button> 
                    </td>
                </tr>`;
        }

        // Append the constructed tbody to the fee details table
        $('#feeTableBody').html(tBody);

        // Update the totals
        let toBePaid = totalFeePerMonth - totalPaymentAmount;
        $('#feePerMonthLable').html(totalFeePerMonth.toFixed(2));
        $('#paiedLable').html(totalPaymentAmount.toFixed(2));
        $('#toBePiedLable').html(toBePaid.toFixed(2));
    });
},
  
  showPaymentSection: (feeId) => {
    $('#feeIdLabel').text(feeId);
    $('#paymentDetailsSection').show();
    $('#feeDetailsTable').hide();

    let today = new Date().toISOString().split('T')[0];
    $('#paymentDate').val(today);

    let getFeeDetailsyIdQry = `SELECT fd.fee_id, fd.student_id,s.name AS student_name, fd.fee_date, 
    fd.fee_per_month, fd.status FROM  fee_details fd JOIN students s ON fd.student_id = s.student_id 
    WHERE fd.fee_id = ${feeId};`;
    // Fetch the fee details and total paid amount
    $.when(
        app.database.tables.dbOparations.getData(getFeeDetailsyIdQry)
    ).done(function (feeData) {
        $('#totalFeeAmount').text(feeData[0].fee_per_month);
        $('#student_id').text(feeData[0].student_id);
        $('#fee_date').text(feeData[0].fee_date);
        $('#name_of_student').text(feeData[0].student_name);
    });
    
    //// payment Data
    let getPaymentDataQry = `SELECT 
            payment_id, 
            fee_id, 
            payment_amount, 
            payment_date 
        FROM 
            payments 
        WHERE 
            fee_id = ${feeId}
        ORDER BY 
            payment_date ASC;
    `;
    // Fetch the fee details and total paid amount
    $.when(
        app.database.tables.dbOparations.getData(getPaymentDataQry),
    ).done(function (paymentData) {
      let totalPayed = 0;
      let amount_per_month = $('#totalFeeAmount').text();
      let paymentTBody = '';
      if(paymentData != null){
        let payments = paymentData;
        // Populate payment history table
        for (let i = 0; i < payments.length; i++) {
            paymentTBody += `
                <tr>
                    <td>${i + 1}</td>
                    <td><input type="number" class="form-control" id="payment${i}" value="${payments[i].payment_amount}" readonly> </td>
                    <td><input type="date" class="form-control" id="pymentDate${i}" value="${payments[i].payment_date}" readonly></td>
                    <td>
                    <button class="btn btn-danger btn-sm" onclick="app.fee.deletPayment(${payments[i].fee_id},${payments[i].payment_id})">Dlt</button>
                    <button  id="paymentEditBtn${i}" class="btn btn-primary btn-sm" onclick="app.fee.edit(${i})">Edit</button>

                    <button style="display:none" id="paymentUpdateBtn${i}" class="btn btn-primary btn-sm" onclick="app.fee.updatePayment(${i}, ${payments[i].payment_id},${payments[i].fee_id})">Update</button>
                    </td>
                </tr>`;
                totalPayed += payments[i].payment_amount;
        }

      }else{
        paymentTBody += `
        <tr>
            <td colspan='3' class='text-center'>No Payments Yet</td>
        </tr>`;
      }
      $('#totalPaidAmount').text(totalPayed);
      let reming  = amount_per_month - totalPayed;
      $('#remainingAmount').text(reming);

      $('#paymentTableBody').html(paymentTBody);

      $('#totalFeeAmount').text(feeData[0].fee_per_month);
    });
},




addPayment: () => {
    const feeId = $('#feeIdLabel').text();
    const paymentAmount = parseFloat($('#paymentAmount').val());
    const paymentDate = $('#paymentDate').val();
    if (paymentAmount && paymentDate) {
      let savePaymentQry = `INSERT INTO payments (fee_id, payment_amount, payment_date) 
        VALUES (${feeId}, ${paymentAmount}, '${paymentDate}');`;
        $.when(
            app.database.tables.dbOparations.execute(savePaymentQry)
        ).done(function () {
            toastr.success('Payment Added Successfully', '', { timeOut: 1000 });
        });
        app.fee.showPaymentSection(feeId); // Refresh payment details
        app.fee.feeStatusCheck(feeId); // to Check and Update Fee Status 
    } else {
        toastr.error('Please enter a valid amount and date', '', { timeOut: 1000 });
    }
},
  

/// delete payment 

deletPayment: (feeId, paymentId) => {
  // Confirmation dialog before deletion
  if (confirm('Are you sure you want to delete this payment?')) {
      const deleteQuery = `DELETE FROM payments WHERE payment_id = ${paymentId};`;
      const updatePendingStatusQry = `UPDATE fee_details SET status = 'Pending' WHERE fee_id = ${feeId};`;
          app.database.tables.dbOparations.execute(deleteQuery);
          app.database.tables.dbOparations.execute(updatePendingStatusQry);
          toastr.success('Payment Deleted Successfully', '', { timeOut: 1000 });
          // Refresh the payment list for the specific fee
          app.fee.showPaymentSection(feeId);
  }
},


feeStatusCheck :(feeId)=>{
let calckPaymentQry = `SELECT fd.fee_id, fd.fee_per_month, 
COALESCE(SUM(p.payment_amount), 0) AS total_payments FROM fee_details fd
LEFT JOIN  payments p ON fd.fee_id = p.fee_id  WHERE fd.fee_id = ${feeId}
GROUP BY fd.fee_id, fd.fee_per_month`;
$.when(
  app.database.tables.dbOparations.getData(calckPaymentQry)
).done(function (amountData) {
if(amountData[0].fee_per_month == amountData[0].total_payments){
  let updateFeeStatus = `UPDATE fee_details SET status = 'Paid' WHERE fee_id = ${feeId};`;
  app.database.tables.dbOparations.execute(updateFeeStatus);

  toastr.success('Payment Completed Successfully', '', { timeOut: 1000 });
}
});
},

edit: (index) => {
  // Show the update button and hide the edit button for the selected row
  $(`#payment${index}`).removeAttr('readonly'); // Remove readonly from payment amount
  $(`#pymentDate${index}`).removeAttr('readonly'); // Remove readonly from payment date
  $(`#paymentEditBtn${index}`).hide(); // Hide the edit button
  $(`#paymentUpdateBtn${index}`).show(); // Show the update button
},

updatePayment: (index, paymentId,feeId) => {
  const updatedAmount = $(`#payment${index}`).val();
  const updatedDate = $(`#pymentDate${index}`).val();
  // Here you should add a validation check to ensure values are correct
  if (updatedAmount && updatedDate) {
      const updatePaymentQry = `UPDATE payments SET payment_amount = ${updatedAmount}, payment_date = '${updatedDate}' WHERE payment_id = ${paymentId};`;
      
      $.when(app.database.tables.dbOparations.execute(updatePaymentQry))
          .done(function () {
              toastr.success('Payment Updated Successfully', '', { timeOut: 1000 });
              app.fee.showPaymentSection($('#feeIdLabel').text()); // Refresh payment section to reflect changes
              app.fee.feeStatusCheck($('#feeIdLabel').text()); // to Check and Update Fee Status 
          })
          .fail(function () {
              toastr.error('Failed to Update Payment', '', { timeOut: 1000 });
          });
  } else {
      toastr.error('Please fill in all fields.', '', { timeOut: 1000 });
  }
},


applyFilters: () => {
  const fromDate = $('#fromDate').val();
  const toDate = $('#toDate').val();
  const status = $('#statusFilter').val();
  const studentId = $('#searchStudentId').val();
  
  let query = `SELECT st.status, st.student_id, st.name, fd.*, 
               (SELECT SUM(payment_amount) FROM payments WHERE fee_id = fd.fee_id) AS total_payment 
               FROM students st 
               LEFT JOIN fee_details fd ON st.student_id = fd.student_id 
               WHERE st.status = 'Active'`;

  // Apply filters
  if (studentId) query += ` AND st.student_id = ${studentId}`;
  if (status) query += ` AND fd.status = '${status}'`;
  if (fromDate) query += ` AND fd.fee_date >= '${fromDate}'`;
  if (toDate) query += ` AND fd.fee_date <= '${toDate}'`;

  query += `
      ORDER BY 
          CASE WHEN fd.status = 'Pending' THEN 0 ELSE 1 END, 
          fd.fee_date DESC;
  `;
  
  $.when(
      app.database.tables.dbOparations.getData(query) // Adjust this to your actual function to get fee details by studentId
  ).done(function (data) {
      let tBody = ``;
      let totalFeePerMonth = 0;
      let totalPaymentAmount = 0;

      // Loop through the data to build each row for fee details
      if (data != null) {
          for (let i = 0; i < data.length; i++) {
              totalFeePerMonth += parseFloat(data[i].fee_per_month) || 0;
              totalPaymentAmount += parseFloat(data[i].total_payment) || 0;

              tBody += `
                  <tr>
                      <td>${i + 1}</td>
                      <td>${data[i].name}</td>
                      <td>${data[i].fee_date}</td>
                      <td>${data[i].fee_per_month}</td>
                      <td>${data[i].status}</td>
                      <td>
                        <button 
                          class="btn btn-sm ${data[i].status == 'Pending' ? 'btn-warning' : 'btn-success'}" 
                          onclick="app.fee.showPaymentSection(${data[i].fee_id})">
                          ${data[i].status == 'Pending' ? 'Pending - Fee' : 'Completed - Fee'}
                        </button> 
                      </td>
                  </tr>`;
          }
      }
      
      // Append the constructed tbody to the fee details table
      $('#feeTableBody').html(tBody);
      let toBePaid = totalFeePerMonth - totalPaymentAmount;
      $('#feePerMonthLable').html(totalFeePerMonth.toFixed(2));
      $('#paiedLable').html(totalPaymentAmount.toFixed(2));
      $('#toBePiedLable').html(toBePaid.toFixed(2));
  });
}

  };
  