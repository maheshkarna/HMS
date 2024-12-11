$(document).ready(() => {
  app.database.createDB();
  $("#loginBtn").click(function () {
    let userType = document.getElementById("user_type").value;
  if(userType === "admin"){
    app.login.CheckLoginsAdm();
  }else{
    app.login.checkLogins();
  }
  });
});

app.login = {
  validation: () => {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username == "") {
      toastr.error('Enter Your Username', '', {timeOut: 1000});
      return false;
    } else if (password == "") {
      toastr.error('Enter Your Password', '', {timeOut: 1000});
      return false;
    } else {
      return true;
    }
  },

  checkLogins: () => {
    if (app.login.validation()) {
      let data = {};
      let username = document.getElementById("username").value;
      let password = document.getElementById("password").value;
      data.username = username;
      data.password = password;
      $.when(
        app.database.tables.creatLogins.checking(data.username, data.password)
      ).done(function (data) {   
        console.log(data);  
        if(data !=null && data.length > 0 ){
          toastr.success('Login Succsess..', '', {timeOut: 1000});
          let role = data[0].USERROLE;
          let cc = data[0].CC ;
          let wbs = data[0].WBS;
          localStorage.setItem('wbs', wbs);
          localStorage.setItem('role', role);
          localStorage.setItem('cc', cc);
          console.log(data);
          window.location.href = "home.html";
        }else{      
          toastr.error('Invalid logins..', '', {timeOut: 1000});
        }
      });
    }
  },
  
  CheckLoginsAdm:()=>{

    if (app.login.validation()) {
      let data = {};
      let username = document.getElementById("username").value;
      let password = document.getElementById("password").value;
      data.username = username;
      data.password = password;
      $.when(
        app.database.tables.creatLogins.checkingAdm(data.username, data.password)
      ).done(function (data) {   
        console.log(data);  
        if(data !=null && data.length > 0 ){
          toastr.success('Login Succsess..', '', {timeOut: 1000});
          let cc = data[0].CC;
          let wbs = data[0].WBS;
          let email = data[0].EMAIL;

          localStorage.setItem('email', email);
          localStorage.setItem('wbs', wbs);
          localStorage.setItem('role', 'Admin');
          localStorage.setItem('cc', cc);
        
          window.location.href = "home.html";
        }else{
          toastr.error('Invalid logins..', '', {timeOut: 1000});
        }
      });
    }
  }


};
