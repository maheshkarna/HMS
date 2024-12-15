$(document).ready(() => {
    app.database.createDB();
    app.home.generateMonthlyFees();
    app.home.reportData();

    
});

app.home = {

    reportData: () => {
       
   let qry =`SELECT 
    strftime('%Y-%m', e.expense_date) AS month,
    IFNULL(SUM(e.amount), 0) AS total_expenses,
    IFNULL((SELECT SUM(p.payment_amount)
            FROM payments p
            WHERE strftime('%Y-%m', p.payment_date) = strftime('%Y-%m', e.expense_date)), 0) AS total_paid_amount,
    IFNULL((SELECT SUM(f.fee_per_month) - IFNULL(SUM(p.payment_amount), 0)
            FROM fee_details f
            LEFT JOIN payments p ON f.fee_id = p.fee_id
            WHERE strftime('%Y-%m', f.fee_date) = strftime('%Y-%m', e.expense_date)), 0) AS total_pending_amount
FROM expenses e
GROUP BY strftime('%Y-%m', e.expense_date)
ORDER BY month desc;`
$.when(
    app.database.tables.dbOparations.getData(qry),
).done(function (data) {
    let paymentTBody = "";
    for (let i = 0; i < data.length; i++) {
            paymentTBody += `
            <tr>
            <th>${data[i].month}</th>
            <th>${data[i].total_expenses}</th>
            <th>${data[i].total_paid_amount}</th>
            <th>${data[i].total_pending_amount}</th>
            <th>${data[i].total_paid_amount - data[i].total_expenses}</th>
            </tr>`;
    }
    $('#reportTableBody').html(paymentTBody);
})

 
let qrystudent =`select Count(*) as stdCount from students where status ="Active"`;
$.when(
app.database.tables.dbOparations.getData(qrystudent),
).done(function (data) {

    $('#stdCount').html(data[0].stdCount);
});
},
    

    generateMonthlyFees: () => {
        const currentDate = new Date();
        const getActiveStudentsQuery = `SELECT st.student_id, MAX(fd.fee_date) AS last_fee_date, fd.fee_per_month
                                        FROM students st
                                        LEFT JOIN fee_details fd ON st.student_id = fd.student_id
                                        WHERE st.status = 'Active'
                                        GROUP BY st.student_id`;
    
        $.when(app.database.tables.dbOparations.getData(getActiveStudentsQuery))
            .done(function (data) {
                if (data != null) {
                    let feesToGenerate = []; // Array to hold fee details to be inserted
    
                    for (let i = 0; i < data.length; i++) {
                        const lastFeeDate = data[i]['last_fee_date'];
                        const studentId = data[i]['student_id'];
                        const feePerMonth = data[i]['fee_per_month'];
                        let nextFeeDate;
    
                        if (lastFeeDate) {
                            // Convert last fee date to Date object
                            const lastFeeDateObj = new Date(lastFeeDate);
                            
                            // Calculate the difference in days
                            const daysSinceLastFee = Math.floor((currentDate - lastFeeDateObj) / (1000 * 60 * 60 * 24));
    
                            // Only add fee if 28 days or more have passed since last fee date
                            if (daysSinceLastFee >= 28) {
                                // Set the next fee date to 30 days after the last fee date
                                lastFeeDateObj.setDate(lastFeeDateObj.getDate() + 30);
                                nextFeeDate = lastFeeDateObj.toISOString().split("T")[0]; // Format as YYYY-MM-DD
                                feesToGenerate.push({
                                    student_id: studentId,
                                    fee_date: nextFeeDate,
                                    fee_per_month: feePerMonth
                                });
                            }
                        } else {
                            // If no previous fee date, set next fee date to current date
                            nextFeeDate = currentDate.toISOString().split("T")[0];
                            feesToGenerate.push({
                                student_id: studentId,
                                fee_date: nextFeeDate,
                                fee_per_month: feePerMonth
                            });
                        }
                    }
    
                    // If there are fees to generate, insert them
                    if (feesToGenerate.length > 0) {
                        feesToGenerate.forEach(fee => {
                            const insertFeeQuery = `INSERT INTO fee_details (student_id, fee_date, fee_per_month)
                                                    VALUES (${fee.student_id}, '${fee.fee_date}', ${fee.fee_per_month})`;
                            app.database.tables.dbOparations.execute(insertFeeQuery);
                        });
    
                        console.log(`Generated fees for ${feesToGenerate.length} students.`);
                    } else {
                        console.log("No fees generated. All active students have up-to-date fees.");
                    }
            }
        });
    }
    
}
