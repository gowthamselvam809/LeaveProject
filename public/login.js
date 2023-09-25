// const { response } = require("express")

const handleLogin =async () => {
    try {

        const pw = localStorage.getItem('pwchanged');
        if(pw){
            toastr.success("Your password changed successfully. Please Login again");
            localStorage.removeItem('pwchanged');
        }
        const buckle = document.getElementById('bklid').value;
        const password = document.getElementById('password').value;

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
            console.log(response.token);
            const res = document.getElementById('e-status');
            res.innerText = response.message;
            res.classList.remove('d-none');
            res.classList.remove('text-danger');
            res.classList.add('text-success');
            console.log(response.accesstype)
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
            console.log(err.responseJSON.message); // Log the error message
            const errorMessageElement = document.getElementById('e-status');
            errorMessageElement.innerText = err.responseJSON.message;
            errorMessageElement.classList.remove('d-none');
            errorMessageElement.classList.add('text-danger')
        } else {
            console.error("Request failed with status: " + err.status);
            console.error("Error message: " + err.statusText);
        }
    }
}
