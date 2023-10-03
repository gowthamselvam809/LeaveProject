function logout(){
    sessionStorage.removeItem('token');
    window.location.href = '/log'
  }
     

document.addEventListener('DOMContentLoaded', async event=>{
    const token = sessionStorage.getItem('token');
    const deleteUser = sessionStorage.getItem('delete');

    if(deleteUser == 'true'){
        toastr.success("User Deleted successfully...");
        sessionStorage.removeItem('delete');
    }

    try{
        const data =  await $.get({
            url: '/police/getAllPolice',
            headers: { 'Authorization': `Bearer ${token}`},
        })
        const userData = data.data;
        const bklid = data.bklid;
        // console.log(data)
        // const allRequest = [];
        const allUser = [];

        let s = 1;
        // console.log(requestData[0].bklid)
        for(let req of userData){
            if(bklid === req.bklid){
                document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${req.name}</a>`
            }
            console.log(req.toDate- req.fromDate)
            allUser.push([s,req.name,req.bklid,req.policetype,`<input type='button' class="btn btn-primary rounded-circle" onClick="openUserProfile('${req.bklid}')" value='Profile'/>`, `<input type='button' class="btn btn-secondary rounded-circle" onClick="individualRequest('${req.bklid}')" value="View"/>`]);
            s++;
        }
        // console.log(allUser)
        // preloader.style.display = 'none';
        const tableOptions = {
            "paging": true,
            "lengthChange": false,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": {
                details: {
                    type: 'column',
                    target: 'tr'
                }
            }
        }

        const employeeTable = $('#employeeTable').DataTable(tableOptions);
        employeeTable.clear().rows.add(allUser).draw();

    }catch(error){
        if(error.status == 401){
            window.location = "/log";
          }else{
            console.error("Request failed with status: " + error.status);
            console.error("Error message: " + error.statusText);
          }
    }
});


function individualRequest(bklid){
    sessionStorage.setItem('bklid', bklid);
    window.location.href = '/userRequest';
}

function openUserProfile(bklid) {
    window.location.href = `/profile/${bklid}`;
  }
