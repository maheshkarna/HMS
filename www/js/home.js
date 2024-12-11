$(document).ready(() => {
    app.database.createDB();
    app.home.generateMonthlyFees();
});

app.home = {
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
