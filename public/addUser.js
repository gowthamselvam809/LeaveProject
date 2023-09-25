
const token = sessionStorage.getItem('token')

document.addEventListener('DOMContentLoaded', async event=>{
    const create = localStorage.getItem('create');
    if(create){
        toastr.success("User created successfully...");
        localStorage.removeItem('create');
    }

    try{
      let userData =  await $.get({
           url: '/police/getPolice',
           headers: { 'Authorization': `Bearer ${token}`},
       })

       document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${userData[0].name}</a>`

    
    }catch(error){
        if(error.status == 401){
            window.location = "/log";
          }else{
            console.log(error)
            console.error("Request failed with status: " + error.status);
            console.error("Error message: " + error.statusText);
          }
          
    }
});

async function create(){
    try{
        const name = $('#name').val();
    const bklid = $('#bklid').val();
    const email = $('#email').val();
    const COY = $('#COY').val();
    const address = $('#address').val();
    const DOB = $('#dob').val();
    const policetype = $('#policetype').val();
    const phoneNumber = $('#phone').val();
    const alternateNumber = $('#alternate').val();
    let isActive = $('#isActive').val();
    isActive = isActive == '1'? true : false;
    const accesstype = $('#accessType').val();
    console.log(policetype)
    const data = {
        name : name, 
        bklid : bklid, 
        email : email,
        address : address,
        COY : COY,
        DOB : DOB,
        policetype : policetype,
        phoneNumber : phoneNumber,
        alternateNumber : alternateNumber,
        isActive : isActive=='1'?true:false,
        accesstype : accesstype,
    }

    $.ajax({
        url: '/police/createpolice',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: data
        ,
        dataType: 'json', 
        success: function (response) {
          if (response) {
            localStorage.setItem('create', true);
            location.reload();
          } else {
            console.log('Not approved, something went wrong');
          }
        },
        error: function (err) {
          console.log(err);
        },
      });
    }catch(error){
        if(error.status == 401){
            window.location = "/log";
          }else{
            console.log(error)
            console.error("Request failed with status: " + error.status);
            console.error("Error message: " + error.statusText);
          }
    }
}


function validateInput(input) {
    const sanitizedValue = input.value.replace(/\D/g, '');
    const truncatedValue = sanitizedValue.substring(0, 10);
    input.value = truncatedValue;
  }

  function logout(){
    sessionStorage.removeItem('token');
    window.location.href = '/log'
  }
     