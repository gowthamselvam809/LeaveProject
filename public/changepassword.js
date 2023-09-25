
//   function handleClick(event) {
//     const newPasswordField = document.getElementById('newPassword');
//     const confirmNewPasswordField = document.getElementById('confirmNewPassword');
//     const oldPassword = document.getElementById('oldPassword');
//     const notMatchMessage = document.getElementById('notmatch');
//     const samePwMessage = document.getElementById('samepw');
  
//     if (newPasswordField.value !== confirmNewPasswordField.value) {
//       event.preventDefault();
//       notMatchMessage.classList.remove('d-none'); 
//     } else {
//       notMatchMessage.classList.add('d-none');
//     }
  
//     if (oldPassword.value === newPasswordField.value) {
//       event.preventDefault();
//       alert('New Password cannot be the same as the Old Password.');
//     }
//   }

const token = sessionStorage.getItem('token')
function submitForm() {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    const notMatchMessage = document.getElementById('notmatch');
    const samePwMessage = document.getElementById('samepw');


  
    if (newPassword !== confirmNewPassword) {
      notMatchMessage.classList.remove('d-none');      
      return;
    }else {
        notMatchMessage.classList.add('d-none');

    }

   
    $.ajax({
        url: '/police/passwordChange',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: {oldPassword : oldPassword, newPassword : newPassword}
        ,
        dataType: 'json', 
        success: function (response) {
        if (response) {
            if(response.same){
                samePwMessage.classList.remove('d-none');      
                return;
            }else{
                samePwMessage.classList.add('d-none');
                sessionStorage.removeItem("token");
                localStorage.setItem('pwchanged', true);
                window.location.href = '/log';
            }
        } else {
          alert('Error changing password.');
        }
      }
    })
      .catch((error) => {
        // Handle network or fetch API errors
        console.error(error);
      });
  }