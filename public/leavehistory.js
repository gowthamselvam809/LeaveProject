 

function logout(){
    sessionStorage.removeItem('token');
    window.location.href = '/log'
  }
     

document.addEventListener('DOMContentLoaded', async event=>{
    const token = sessionStorage.getItem('token');

    try{
        const data =  await $.get({
            url: '/police/getPolice',
            headers: { 'Authorization': `Bearer ${token}`},
        })
        const requestData = data[0].request;
        const allRequest = [];
        let s = 1;
        // console.log(requestData[0].bklid)
        if(requestData.length > 1){
            requestData.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        for(let req of requestData){
            
            allRequest.push([s,dateFormat(req.fromDate),dateFormat(req.toDate),req.leaveType, req.status, `<button class="btn btn-primary rounded-circle" onClick="openReq('${req.bklid}','${req.requestId}')">Info</button>`]);
            s++;
        }
        console.log(allRequest)
        const tableOptions = {
            "paging": false,
            "lengthChange": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": true,
            "responsive": true,
        }
        document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${data[0].name}</a>`


        const requestTable = $('#historytable').DataTable(tableOptions);
        requestTable.clear().rows.add(allRequest).draw();

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

function openReq(bklid, reqId){
    sessionStorage.setItem('reqId', reqId);
    sessionStorage.setItem('bklid', bklid);
    window.location.href = '/request'
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