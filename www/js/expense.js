$(document).ready(() => {
    app.database.createDB();
    app.expenses.loadCategories();
    app.expenses.loadExpenses();
});

app.expenses = {

    loadCategories: () => {
        const query = `SELECT * FROM expCategory;`;
        $.when(app.database.tables.dbOparations.getData(query))
            .done(function(categories) {
                const categorySelect = $("#expense_category");
                categorySelect.empty().append(`<option value="">Category</option>`);
                
                const fltrcategorySelect = $("#filter_category");
                fltrcategorySelect.empty().append(`<option value="">Category</option>`);
                
            
                // Use a for loop to iterate over the categories
                for (let i = 0; i < categories.length; i++) {
                    categorySelect.append(`<option value="${categories[i].category_id}">${categories[i].category_name}</option>`);
                    fltrcategorySelect.append(`<option value="${categories[i].category_id}">${categories[i].category_name}</option>`);
                }
            })
            .fail(() => {
                console.error("Failed to load categories");
            });
    },
    

    loadSubCategories: () => {
        let categoryId = $('#expense_category').val()
        
        const query = `SELECT * FROM expSubcategory WHERE category_id = ${categoryId};`;
        $.when(app.database.tables.dbOparations.getData(query))
            .done(function(categories) {
                const categorySelect = $("#expense_subcategory");
                categorySelect.empty().append(`<option value="">Sub-Category</option>`);
               
               
    
                // Use a for loop to iterate over the categories
                for (let i = 0; i < categories.length; i++) {
                    categorySelect.append(`<option value="${categories[i].subcategory_id}">${categories[i].subcategory_name}</option>`);
                }
            })
            .fail(() => {
                console.error("Failed to load categories");
            });
    },
    
    addExpense: () => {
        // Get values from the form fields
        const categoryId = $("#expense_category").val();
        const subcategoryId = $("#expense_subcategory").val();
        const description = $("#expense_description").val();
        const amount = $("#expense_amount").val();
        const expenseDate = $("#expense_date").val();
    
        // Validate input fields
        if (!categoryId) {
            toastr.error('Please select a category.', '', { timeOut: 1000 });
            return;
        }
        if (!subcategoryId) {
            toastr.error('Please select a subcategory.', '', { timeOut: 1000 });
            return;
        }
        if (!amount || amount <= 0) {
            toastr.error('Please enter a valid amount.', '', { timeOut: 1000 });
            return;
        }
        if (!expenseDate) {
            toastr.error('Please select a date.', '', { timeOut: 1000 });
            return;
        }
    
        // Construct the SQL query to insert the expense
        let saveExpenseQry = `INSERT INTO expenses (category_id, subcategory_id, description, amount, expense_date) 
                              VALUES (${categoryId}, ${subcategoryId}, '${description}', ${amount}, '${expenseDate}');`;
    
        // Execute the query to save the expense
        app.database.tables.dbOparations.execute(saveExpenseQry)
            .done(() => {
                toastr.success('Expense added successfully!', '', { timeOut: 1000 });
                // Optionally reset the form or reload data
                $('#expenseForm')[0].reset();
                app.expenses.loadSubCategories(); // Reload subcategories if necessary
                app.expenses.loadExpenses();

            })
            .fail(() => {
                toastr.error('Failed to add expense. Please try again.', '', { timeOut: 1000 });
            });
    },


    loadExpenses: () => {

        let today = new Date().toISOString().split('T')[0];
        $('#expense_date').val(today);
        $('#to_date').val(today);


        // SQL query to get all expenses along with category and subcategory names
        let getExpensesQry = `
            SELECT 
                e.expense_id,
                c.category_name,
                sc.subcategory_name,
                e.description,
                e.expense_date,
                e.amount
            FROM 
                expenses e
            JOIN 
                expCategory c ON e.category_id = c.category_id
            JOIN 
                expSubcategory sc ON e.subcategory_id = sc.subcategory_id
            ORDER BY 
                e.expense_id DESC;
        `;
    
        // Fetch data and populate the table
        $.when(app.database.tables.dbOparations.getData(getExpensesQry))
            .done(function (data) {
                let tBody = ``;
                let Totalamount = 0;
             
             if(data != null){
                for (let i = 0; i < data.length; i++) {
                    tBody += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${data[i].category_name}</td>
                            <td>${data[i].subcategory_name}</td>
                            <td>${data[i].description}</td>
                            <td>${data[i].expense_date}</td>
                            <td>${data[i].amount}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="app.expenses.deleteExpense(${data[i].expense_id})">Delete</button>
                            </td>
                        </tr>`;
                        Totalamount += data[i].amount;
                }
             }
                
    
                // Append the constructed tbody to the expenses table
                $('#expenses_Tbody').html(tBody);
                $('#gTotal').html(Totalamount);

                
                
            })
            .fail(() => {
                toastr.error('Failed to load expenses data.', '', { timeOut: 1000 });
            });
    },

    deleteExpense: (expenseId) => {
        // Confirm before deleting the expense
        if (confirm("Are you sure you want to delete this expense?")) {
            // SQL query to delete the expense based on expense_id
            let deleteExpenseQry = `DELETE FROM expenses WHERE expense_id = ${expenseId};`;
            
            // Execute the delete query
            $.when(app.database.tables.dbOparations.execute(deleteExpenseQry))
                .done(() => {
                    toastr.success('Expense deleted successfully.', '', { timeOut: 1000 });
                    app.expenses.loadExpenses(); // Reload the expenses table to reflect changes
                })
                .fail(() => {
                    toastr.error('Failed to delete expense.', '', { timeOut: 1000 });
                });
        }
    },
    
    ///filter 

    loadFilterSubCategories: () => {
        const categoryId = $('#filter_category').val();
        // Fetch subcategories based on selected category for filter
        if (categoryId) {
            const subCatQuery = `SELECT subcategory_id, subcategory_name FROM expSubcategory WHERE category_id = ${categoryId};`;
            $.when(app.database.tables.dbOparations.getData(subCatQuery))
                .done(function (subcategories) {
                    let options = `<option value="">Subcategory</option>`;
                    for (let i = 0; i < subcategories.length; i++) {
                        options += `<option value="${subcategories[i].subcategory_id}">${subcategories[i].subcategory_name}</option>`;
                    }
                    $('#filter_subcategory').html(options);
                });
        } else {
            $('#filter_subcategory').html('<option value="">Subcategory</option>');
        }
    },

    applyFilters: () => {
        const fromDate = $('#from_date').val();
        const toDate = $('#to_date').val();
        const categoryId = $('#filter_category').val();
        const subcategoryId = $('#filter_subcategory').val();

        let query = `
            SELECT e.expense_id, e.description, e.amount, e.expense_date, 
                   c.category_name, s.subcategory_name
            FROM expenses e
            LEFT JOIN expCategory c ON e.category_id = c.category_id
            LEFT JOIN expSubcategory s ON e.subcategory_id = s.subcategory_id
            WHERE 1=1 `;

        if (fromDate) query += ` AND e.expense_date >= '${fromDate}'`;
        if (toDate) query += ` AND e.expense_date <= '${toDate}'`;
        if (categoryId) query += ` AND e.category_id = ${categoryId}`;
        if (subcategoryId) query += ` AND e.subcategory_id = ${subcategoryId}`;

        app.expenses.displayFilteredExpenses(query);
    },

    displayFilteredExpenses: (query) => {
        $.when(app.database.tables.dbOparations.getData(query))
            .done(function (data) {
                let tBody = ``;
                let grandTotal = 0;
                if(data != null){
                    for (let i = 0; i < data.length; i++) {
                        grandTotal += parseFloat(data[i].amount);
                        tBody += `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${data[i].category_name}</td>
                                <td>${data[i].subcategory_name}</td>
                                <td>${data[i].description}</td>
                                <td>${data[i].expense_date}</td>
                                <td>${data[i].amount}</td>
                                <td>
                                    <button class="btn btn-danger btn-sm" onclick="app.expenses.deleteExpense(${data[i].expense_id})">Delete</button>
                                </td>
                            </tr>`;
                    }
                }

                $('#expenses_Tbody').html(tBody);
                $('#gTotal').text(`₹${grandTotal.toFixed(2)}`);
            });
    }

    
};
