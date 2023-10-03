
const token = sessionStorage.getItem('token')

function logout(){
  sessionStorage.removeItem('token');
  window.location.href = '/log'
}
   
 const edit = async ()=>{
    const type =  await $.get({
      url: '/police/getPolice',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if(type[0].accesstype == 'admin'){
      document.getElementById('top').innerText = 'ADMIN';
      document.getElementById('before').style.display = 'none';
      document.getElementById('after').classList.remove('d-none');
      document.getElementById('before').classList.remove('d-flex');
      var inputElements = document.querySelectorAll('input');
      var selectElements = document.querySelectorAll('select');
      document.querySelector('textarea').removeAttribute('disabled')
      selectElements.forEach(function(select){
        select.removeAttribute('disabled')
      })
  
      inputElements.forEach(function(input) {
         if (input.id !== 'bklid') {
          input.removeAttribute('disabled');
      }
      });
    }else{
      document.getElementById('top').innerText = 'IRBN';

      document.getElementById('before').style.display = 'none';
      document.getElementById('after').classList.remove('d-none');
      document.getElementById('before').classList.remove('d-flex');
      const elements = document.querySelectorAll(".normal");
      elements.forEach((element) => {
        element.removeAttribute("disabled");
      });
    }

}

const cancel = ()=>{
    // document.getElementById('before').style.display = 'block';
    // document.getElementById('after').classList.add('d-none');
    // document.getElementById('before').classList.add('d-flex');
    location.reload();
}


function validateInput(input) {
    const sanitizedValue = input.value.replace(/\D/g, '');
    const truncatedValue = sanitizedValue.substring(0, 10);
    input.value = truncatedValue;
  }
  
 const save = () => {
    try{
        var inputElements = document.querySelectorAll('input');
    document.querySelector('textarea').setAttribute('disabled','disabled')

    inputElements.forEach(function(input) {
       if (input.id !== 'bklid') {
        input.setAttribute('disabled', 'disabled'); 
    }
    });

    const name = $('#name').val();
    const bklid = $('#bklid').val();
    const email = $('#email').val();
    const COY = $('#COY').val();
    const address = $('#address').val();
    const DOB = $('#dob').val();
    const policetype = $('#policetype').val();
    const phoneNumber = $('#phone').val();
    const alternateNumber = $('#alternate').val();
    const casual = $('#casual').val();
    const permission = $('#perm').val();
    const government = $('#govern').val();
    const medical = $('#medical').val();
    const restricted = $('#restrict').val();
    const paternity = $('#patern').val();
    const earned = $('#earned').val();
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
        casual : casual,
        medical : medical,    
        permission : permission,
        government : government,
        earned : earned,
        paternity : paternity,
        restricted : restricted,
        isActive : isActive,
        accesstype : accesstype,
    }

    $.ajax({
        url: '/police/updateDetails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: data
        ,
        dataType: 'json', 
        success: function (response) {
          if (response) {
            location.reload();
          } else {
            console.log('Not approved, something went wrong');
          }
        },
        error: function (err) {
          console.log(err);
        },
      });
    
    }catch(err){
        if(err.status == 401){
            window.location = "/log";
        }else{
            console.log(err)
            console.error("Request failed with status: " + err.status);
            console.error("Error message: " + err.statusText);
        }
    }
}

document.addEventListener('DOMContentLoaded', async event=>{
    try{
      let data;
      let userData =  await $.get({
           url: '/police/getPolice',
           headers: { 'Authorization': `Bearer ${token}`},
       })

       document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${userData[0].name}</a>`

       if(userData[0].accesstype == 'admin'){
        document.getElementById('adm').classList.remove('d-none');
        document.getElementById('top').innerText = 'ADMIN';
        document.getElementById('visible').classList.remove('d-none');
       }else{
        document.getElementById('emp').classList.remove('d-none');
        document.getElementById('top').innerText = 'IRBN'
       }

      const currentURL = window.location.href;

      if (currentURL.includes('/profile/') && currentURL.split('/profile/')[1]) {
        const bklid = currentURL.split('/profile/')[1];
        console.log('bklid exists:', bklid);
        data =  await $.get({
          url: `/police/getPolice/${bklid}`,
          headers: { 'Authorization': `Bearer ${token}`},
      })
      data = data.data[0];

      if(userData[0].accesstype == 'admin'){
        document.getElementById('deluser').classList.remove('d-none');
      }else{
        document.getElementById('deluser').classList.add('d-none');
      }
      } else {
        console.log(userData)
       data = userData[0];
       if(userData[0].accesstype == 'admin'){
        document.getElementById('deluser').classList.remove('d-none');
      }else{
        document.getElementById('deluser').classList.add('d-none');
      }
      }
        console.log(data)
        const user = data;
        console.log(user)
        $('#name').val(user.name);
        $('#bklid').val(user.bklid);
        $('#COY').val(user.COY?user.COY:"");
        $('#phone').val(user.phoneNumber?user.phoneNumber:"");
        $('#alternate').val(user.alternateNumber?user.alternateNumber:"");
        $('#email').val(user.email?user.email:"");
        $('#policetype').val(user.policetype?user.policetype:"");
        $('#dob').val(user.DOB ? user.DOB : "");        
        $('#address').val(user.address?user.address:"");
        $('#casual').val(user.leave.casualLeave);
        $('#perm').val(user.leave.holidayPermission);
        $('#govern').val(user.leave.governmentHoliday);
        $('#restrict').val(user.leave.restrictedHoliday);
        $('#earned').val(user.leave.earnedLeave);
        $('#medical').val(user.leave.medicalLeave);
        $('#patern').val(user.leave.paternityLeave);
        $('#accessType').val(user.accesstype);
        $('#isActive').val(user.isActive?'1':'0');
        
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

 function deleteUser(){

  let data = document.getElementById('bklid').value;
  console.log(data);
    Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await $.ajax({
        url: '/police/deletepolice',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify({ bklid: data }),
        dataType: 'json',
      })
      .done(function(response) {
        if (response) {
          console.log('User deleted successfully');
          sessionStorage.setItem('delete','true');
          window.location.href = '/user'
        } else { 
          console.error('Failed to delete user');
        }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error:', textStatus, errorThrown);
      });

      Swal.fire(
        'Deleted!',
        'User has been deleted.',
        'success'
      )
    }
  })



  
}