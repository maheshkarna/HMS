// Load categories on page load
$(document).ready(() => {
    app.database.createDB();
    app.category.getAllCategoriesData();
    // app.category.loadCategories(); 
    app.category.getAllSubcategoriesData(); 
});

app.category = {

    
    saveCategory: () => {
        var categoryName = $("#category_name").val();
    
        // Validate the input
        if (categoryName == "") {
            toastr.error('Enter Category Name', '', { timeOut: 1000 });
           
        } else {
            // Construct the SQL query to insert the new category
            let saveCategoryQry = `INSERT INTO expCategory (category_name) VALUES ('${categoryName}');`;
    
            // Execute the query to save the category
            app.database.tables.dbOparations.execute(saveCategoryQry)
                .done(() => {
                    toastr.success('Category Submitted Successfully', '', { timeOut: 1000 });
                    setTimeout(function () {
                        location.reload(); // Reload the page to reflect changes
                    }, 1000);
                })
                .fail(() => {
                    toastr.error('Failed to Submit Category', '', { timeOut: 1000 });
                });
        }
    },
    

    saveSubcategory: () => {
        var subcategoryName = $("#subcategory_name").val();
        var categoryId = $("#selectCatg").val(); // Get the selected category ID
    
        // Validate the input
        if (subcategoryName == "") {
            toastr.error('Enter Subcategory Name', '', { timeOut: 1000 });
          
        } else if (!categoryId) {
            toastr.error('Select a Category', '', { timeOut: 1000 });
          
        } else {
            // Construct the SQL query to insert the new subcategory
            let saveSubcategoryQry = `INSERT INTO expSubcategory (category_id, subcategory_name) VALUES (${categoryId}, '${subcategoryName}');`;
    
            // Execute the query to save the subcategory
            app.database.tables.dbOparations.execute(saveSubcategoryQry)
                .done(() => {
                    toastr.success('Subcategory Submitted Successfully', '', { timeOut: 1000 });
                    setTimeout(function () {
                        location.reload(); // Reload the page to reflect changes
                    }, 1000);
                })
                .fail(() => {
                    toastr.error('Failed to Submit Subcategory', '', { timeOut: 1000 });
                });
        }
    },
    

    getAllCategoriesData: () => {
        // SQL query to select all categories from the expCategory table
        let getCategoryQry = `SELECT category_id, category_name FROM expCategory;`;
        
        $.when(
            // Fetch the data using the SQL query
            app.database.tables.dbOparations.getData(getCategoryQry)
        ).done(function (data) { 
            console.log(data);
            let tBody = ``;
            let options = ` <option value="">Select Category</option>`;
            // Use a for loop to iterate over the data
            for (let i = 0; i < data.length; i++) {

                options +=`<option value="${data[i].category_id}">${data[i].category_name}</option>`;
                tBody += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>
                        <input type="text" id="category${i + 1}" value="${data[i].category_name}" readonly class="form-control">
                        
                        </td>
                        <td>
                            <button class="btn btn-primary btn-sm" id="btnEdit" onclick="app.category.editCategory(${i + 1})">Edit</button>
                            <button class="btn btn-primary btn-sm" id="btnUpdate" style="display:none" onclick="app.category.updateSubCategory(${data[i].category_id},${i + 1})">Update</button>
                        </td>
                    </tr>`;
            }
    
            // Append the constructed tbody to the category table
            $('#selectCatg').html(options);
            $('#category_Tbody').html(tBody);

        });
    },
    
    
    editCategory: (id) => {
        $('#btnUpdate').toggle(); // Show or hide the block
        $('#btnEdit').hide(); 
        $('#category' + id).prop('readonly', false);
    },

     
    updateCategory: (id,inputId) => {
        let catgVal =   $('#category'+inputId).val(); 
        if(catgVal != ""){
            let updateCategoryQry = `Update expCategory set category_name = '${catgVal}' where category_id = ${id};`;
    
            // Execute the query to update the Category
            app.database.tables.dbOparations.execute(updateCategoryQry)
                .done(() => {
                    toastr.success('Category Submitted Successfully', '', { timeOut: 1000 });
                    setTimeout(function () {
                        location.reload(); // Reload the page to reflect changes
                    }, 1000);
                })
                .fail(() => {
                    toastr.error('Failed to Submit Subcategory', '', { timeOut: 1000 });
                });
        }else{
            toastr.error('Filed is Empty', '', { timeOut: 1000 });
        }
    },
    


    
    getAllSubcategoriesData: () => {
        // SQL query to select all subcategories with their associated category names
        let getSubcategoryQry = `
            SELECT s.subcategory_id, s.subcategory_name, c.category_name 
            FROM expSubcategory s 
            JOIN expCategory c ON s.category_id = c.category_id;`;
        
        $.when(
            // Fetch the data using the SQL query
            app.database.tables.dbOparations.getData(getSubcategoryQry)
        ).done(function (data) { 
            console.log(data);
            let tBody = '';
    
            // Use a for loop to iterate over the data
            for (let i = 0; i < data.length; i++) {
                tBody += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>
                         <input type="text" id="subCategory${i + 1}" value="${data[i].subcategory_name}" readonly class="form-control">
                        </td>
                        <td>${data[i].category_name}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" id="subEdtBtn" onclick="app.category.editSubcategory(${data[i].subcategory_id})">Edit</button>
                            <button class="btn btn-primary btn-sm"  id="subUpdateBtn" style="display:none" onclick="app.category.updateSubCategory(${data[i].subcategory_id},${i + 1})">Update</button>
                        </td>
                    </tr>`;
            }
    
            // Append the constructed tbody to the subcategory table
            $('#subcategory_Tbody').html(tBody);
        })
        .fail(() => {
            console.error("Failed to load subcategories");
        });
    },
    

    editSubcategory: (id) => {
        $('#subUpdateBtn').toggle(); // Show or hide the block
        $('#subEdtBtn').hide(); 
        $('#subCategory' + id).prop('readonly', false);
    },

    updateSubCategory: (id,inputId) => {
        let catgVal =   $('#subCategory'+inputId).val(); 
        if(catgVal != ""){
            let updateSubCategoryQry = `Update expSubcategory set subcategory_name = '${catgVal}' where subcategory_id = ${id};`;
    
            // Execute the query to update the Category
            app.database.tables.dbOparations.execute(updateSubCategoryQry)
                .done(() => {
                    toastr.success('Subcategory Submitted Successfully', '', { timeOut: 1000 });
                    setTimeout(function () {
                        location.reload(); // Reload the page to reflect changes
                    }, 1000);
                })
                .fail(() => {
                    toastr.error('Failed to Submit Subcategory', '', { timeOut: 1000 });
                });
        }else{
            toastr.error('Filed is Empty', '', { timeOut: 1000 });
        }
    }

};
