

const token = sessionStorage.getItem('token')
const reqId = String(sessionStorage.getItem('reqId'));
const sbklid = String(sessionStorage.getItem('bklid'));
// var url = window.location.href;
// var urlParams = new URLSearchParams(url);
// var reqId = String(urlParams.get('reqId')); // Convert to string
// var bklid = String(urlParams.get('bklid')); // Convert to string

console.log(reqId, sbklid);

document.addEventListener('DOMContentLoaded', async event=>{
    try{
      let data;
      let userData =  await $.get({
          url: '/police/getPolice',
          headers: { 'Authorization': `Bearer ${token}`},
      })
      document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${userData[0].name}</a>`
      let isAdmin = '';
      if(userData[0].accesstype == 'admin'){
        document.getElementById('adm').classList.remove('d-none');
        isAdmin = true;
        document.getElementById('top').innerText = 'ADMIN';
        // document.getElementById('visible').classList.remove('d-none');
      }else{
        document.getElementById('emp').classList.remove('d-none');
        document.getElementById('top').innerText = 'IRBN';
        isAdmin = false;
      }
      document.getElementById('before').innerHTML = `<button type="button" class="btn btn-danger ml-4 " onclick="deleteRequest(${isAdmin})" id="delreq" >Delete Request</button>
      <button type="button" class="btn btn-warning mr-4 d-none" onclick="modify()" id="modify">Modify</button>`
        const datas = await $.get({
          url: '/police/getAllPolice',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        for(let user of datas.data){
          if(user.bklid == sbklid){
            const name = user.name;
            const phone = user.phoneNumber;
            if (user.request && user.request.length) {
              for (let i = 0; i < user.request.length; i++){
                let r = user.request[i];
                if(r.requestId === reqId){

                  if(r.status === 'pending' && user.accesstype == 'admin'){
                      document.getElementById('modify').classList.remove('d-none');
                  }
                  if(r.status === 'pending' && userData[0].accesstype === 'normal' ){
                    document.getElementById('delreq').classList.add('d-none');
                  }

                  // console.log(r.requestId === reqId)
                  const fromDate = dateSeq(r.fromDate);
                  const toDate = dateSeq(r.toDate);
                  const files = r.fileName ? ` <input type="button" class="form-control underline-input btn btn-primary  rounded-circle" name="file" id="file"  onclick="openPdf('/documents/${r.fileName}')" value="View File"/>` : ` <input type="button" class="form-control underline-input btn btn-secondary rounded-circle" name="file" id="file"  value="no Attachments" disabled/>`
                  $('#name').val(user.name);
                  $('#bklid').val(user.bklid);
                  $('#rid').val(reqId); 
                  $('#applydate').val(dateFormat(r.date)); 
                  $('#updateStatus').val(dateFormat(r.updateStatus)); 
                  $('#twodate').val(`${dateSeq(r.fromDate)} - ${dateSeq(r.toDate)}`);
                  $('#leaveCount').val(date_diff(fromDate,toDate) +1);
                  $('#leaveType').val(r.leaveType);
                  $('#status').val(r.status);
                  $('#reason').val(r.reason);
                  
                  document.getElementById('insertfile').innerHTML = `<label for="file">Documents</label> ${files}`
                }
              }
            }  
          }
        }        
       

        initializeDateRangePicker()

    }catch(error){
        if(error.status == 401){
            // window.location = "/log";
          }else{
            console.log(error)
            console.error("Request failed with status: " + error.status);
            console.error("Error message: " + error.statusText);
          }
          
    }
});

const modify = async ()=>{
  const type =  await $.get({
    url: '/police/getPolice',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if(type[0].accesstype == 'admin'){
    document.getElementById('top').innerText = 'ADMIN';
    document.getElementById('before').style.display = 'none';
    document.getElementById('after').classList.remove('d-none');
    document.getElementById('before').classList.remove('d-flex');
    document.getElementById('date').removeAttribute('disabled')
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

function openPdf(pdfUrl) {
  window.open(pdfUrl, '_blank');
}

function save(){
  document.getElementById('date').disabled = true;
  document.getElementById('after').style.display = 'none'
  document.getElementById('before').style.display = 'inline-block'
}



const cancel = ()=>{
  location.reload();
}


function deleteRequest(isAdmin){
  
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
        url: '/document/deleteRequest',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify({ bklid: data,requestId : reqId }),
        dataType: 'json',
      })
      .done(function(response) {
        if (response) {
          console.log('User deleted successfully');
          sessionStorage.setItem('delete','true');
          if(isAdmin){
            window.location.href = '/userRequest'
          }else{
            window.location.href = '/leavehistory'
          }
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

function initializeDateRangePicker() {
    $('#date').daterangepicker({
        opens: 'left'
    }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
}

function dateSeq(date){
  const inputDate = new Date(date);
  const day = inputDate.getDate();
  const month = inputDate.getMonth() + 1; 
  const year = inputDate.getFullYear();
  // Format the date as mm/dd/yyyy
  const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

  return formattedDate;
}

var date_diff = function(date1, date2) {
  dt1 = new Date(date1);
  dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) / (1000 * 60 * 60 * 24));
}
const dateFormat = (date) => {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  let newDate = new Date(date).toLocaleString("en-us", options);
  return newDate;
};

function logout(){
  sessionStorage.removeItem('token');
  window.location.href = '/log'
}