// const { response } = require("express")
function validateInput(input) {
    const sanitizedValue = input.value.replace(/\D/g, '');
    const truncatedValue = sanitizedValue.substring(0, 6);
    input.value = truncatedValue;
}


const pw = localStorage.getItem('pwchanged');
if(pw){
    toastr.success("Your password changed successfully. Please Login again");
    localStorage.removeItem('pwchanged');
}

const handleLogin =async () => {
    try {
        const errbklid = document.getElementById('errbklid');
        const errpw = document.getElementById('errpw');
        // const errstatus = document.getElementById('errstatus');
        const estat = document.getElementById('e-status')
        
        
        const buckle = document.getElementById('bklid').value;
        const password = document.getElementById('password').value;
        
        if(buckle.length < 6){
            errbklid.innerText = 'Please Enter 6 Digit Number of Buckle ID.'
            errbklid.classList.remove('d-none');
            return;
        }else{
            errbklid.classList.add('d-none')
        }

        if(password.length == 0){
            errpw.innerText = 'Please Enter the Password.'
            errpw.classList.remove('d-none');
            return;
        }else{
            errpw.classList.add('d-none')
        }

        const data = {
            bklid: buckle,
            password: password
        }

        const response = await $.post({
            url: '/auth/signin',
            data: data
        });

        if (response) {
            sessionStorage.setItem('token', response.token);
            
            estat.innerText = 'Login Success! '

            estat.classList.remove('d-none');
            estat.classList.add('text-success');
            
            if (response.accesstype === "admin") {
                window.location.href = '/dash';
            } else {
                window.location.href = '/employee';
            }
        } else {
            console.log(response.message);
        }

    } catch (err) {
        if (err.status === 401) {
            console.log(err)
            console.log(err.responseJSON.message); // Log the error message
            let errorMessageElement = document.getElementById('errbklid');
            if(!err.responseJSON.isUser){
                errorMessageElement = document.getElementById('errbklid');
                errorMessageElement.innerText = 'Buckle ID is not exists, Enter valid ID.'
                errorMessageElement.classList.remove('d-none');
                return;
            }else if(!err.responseJSON.valid){
                errorMessageElement = document.getElementById('errpw');
                errorMessageElement.innerText = 'Wrong Password, Enter Correct Password.'
                errorMessageElement.classList.remove('d-none');
                return;
            }else if(!err.responseJSON.isActive){
                errorMessageElement = document.getElementById('e-status');
                errorMessageElement.innerText = 'User Not Active, Contact Admin.'
                errorMessageElement.classList.remove('d-none');
                estat.classList.add('text-danger');
                return;
            }
        } else {
            console.log(err)
            console.error("Request failed with status: " + err.status);
            console.error("Error message: " + err.statusText);
        }
    }
}
