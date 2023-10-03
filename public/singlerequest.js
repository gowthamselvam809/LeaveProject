
const deleteUser = sessionStorage.getItem('delete');

    if(deleteUser == 'true'){
        toastr.success("Request Deleted successfully...");
        sessionStorage.removeItem('delete');
    }

document.addEventListener('DOMContentLoaded', async event=>{
    const bklid = sessionStorage.getItem('bklid');
    console.log(bklid)
    const token = sessionStorage.getItem('token');

    try{
        const data =  await $.get({
            url: '/police/getAllPolice',
            headers: { 'Authorization': `Bearer ${token}`},
        })
        const userData = data.data;
        const adminBklid = data.bklid;
        console.log(data)
        const allRequest = [];
        let request;
        for(let user of userData){
           if(adminBklid === user.bklid){
                document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${user.name}</a>`
            }
            if(user.bklid == bklid){
                request = user;
            }
        }
        console.log(request)
        let s = 1;
        for(let req of request.request){
            if(request.request.length > 1){
                request.request.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
            allRequest.push([s,dateFormat(req.fromDate),dateFormat(req.toDate),req.leaveType, req.status, `<button class="btn btn-primary" onClick="openReq('${bklid}','${req.requestId}')">Info</button>`]);
            s++;
        }

        const tableOptions = {
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": true,
            "responsive": true,
        }


        const requestTable = $('#requestTable').DataTable(tableOptions);
        requestTable.clear().rows.add(allRequest).draw();
    }catch(error){
        console.log(error)
        if(error.status == 401){
            window.location = "/log";
          }else{
            console.error("Request failed with status: " + error.status);
            console.error("Error message: " + error.statusText);
          }
    }
})

function logout(){
    sessionStorage.removeItem('token');
    window.location.href = '/log'
  }
     
function openReq(bklid, reqId){
    reqId = `${reqId}`;
    bklid = `${bklid}`
    sessionStorage.setItem('reqId', reqId);
    sessionStorage.setItem('bklid', bklid);
    window.location.href = `/request`

}

var date_diff = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}
const dateFormat = (date) => {
      let newDate = new Date(date).toLocaleString("en-us", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return newDate;
  };

function viewDocuments(file){
    window.location.href = `/documents/${file.fileName}`
}
