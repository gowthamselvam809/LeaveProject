$(document).ready(function() {
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    const $tabLink = $(e.target);
    const $navItem = $tabLink.parent();
    
    $navItem.siblings().find('a.nav-link').removeClass('bg-primary bg-success bg-danger');
    
    if ($tabLink.hasClass('active')) {
      if ($tabLink.text() === 'Pending') {
        $tabLink.addClass('bg-primary');
      } else if ($tabLink.text() === 'Approved') {
        $tabLink.addClass('bg-success');
      } else if ($tabLink.text() === 'Denied') {
        $tabLink.addClass('bg-danger');
      }
    }
  });
});
 
const token = sessionStorage.getItem('token')

 document.addEventListener('DOMContentLoaded', async event=>{
    console.log('im working');
    console.log(token)
    const denyFlag = localStorage.getItem('denyFlag');
    const approveFlag = localStorage.getItem('approveFlag');

  if (denyFlag === 'true') {
    toastr.error("You Denied the Leave request!");
    localStorage.removeItem('denyFlag');
  }else if(approveFlag == 'true'){
    toastr.success("You Approved the Leave request!");
    localStorage.removeItem('approveFlag');
  }
    try{
      const data = await $.get({
        url: '/police/getAllPolice',
        headers: { 'Authorization': `Bearer ${token}` },
    });
        const userData = data.data;
        const bklid = data.bklid;
        let p = 1,a = 1, d = 1;
        const pendingReq = [];
        const approvedReq = [];
        const deniedReq = [];
        const yesterdayLeaveUsers = new Set();
        const todayAbsentUsers = new Set();
        const tomorrowAbsentUsers = new Set();
        const laterAbsentUsers = new Set();
        const previousDaysLeaveUsers = new Set();
        
        for(let req of userData){
          if(bklid === req.bklid){
              document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${req.name}</a>`
          }
          const name = req.name;
          let bklidreq = req.bklid;
          // const policeType = req.policetype;
          // console.log(req.request)
          if (req.request && req.request.length) {
            if(req.request.length > 1){
              req.request.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
            for (let i = 0; i < req.request.length; i++) {
              let r = req.request[i];
              const fromDate = new Date(r.fromDate);
              const toDate = new Date(r.toDate);
              const currentDate = new Date();

              // console.log(daysDifference);
              if (r.status === "pending") {
                pendingReq.push([p, name, bklidreq, dateFormat(r.fromDate), dateFormat(r.toDate),date_diff(fromDate, toDate) + 1, `<input type='button' onClick="showUserInfoModal('${r.requestId}','${bklidreq}')" value="View"/>`]);
                p++;
              } else if (r.status === "Approved") {
                approvedReq.push([a, name, bklidreq, dateFormat(r.fromDate),dateFormat(r.toDate),date_diff(fromDate, toDate) + 1, `<input type='button' onClick="showUserInfoModal('${r.requestId}','${bklidreq}')" value="View"/>`]);
                a++;
              } else if(r.status==="Denied"){
                deniedReq.push([d, name, bklidreq, dateFormat(r.fromDate),dateFormat(r.toDate), date_diff(fromDate, toDate) + 1, `<input type='button' onClick="showUserInfoModal('${r.requestId}','${bklidreq}')" value="View"/>`]);
                d++;
              }

              if (r.status === "Approved") {
                let daysDifference = Math.floor((fromDate - currentDate) / (24 * 60 * 60 * 1000))+1;
                console.log("daysDifference : "+daysDifference)
        
                let leaveDuration = Math.floor((toDate - fromDate) / (24 * 60 * 60 * 1000)) + 1;
                console.log("leaveDuration : "+leaveDuration)

                let currLeaveDuration = leaveDuration + daysDifference;
                console.log("currLeaveDuration : "+currLeaveDuration)
        
                const userString = `${name}-${bklid}`;
        
                
                // Yesterday
                if (daysDifference < 0 && currLeaveDuration >= 0 ) {
                  yesterdayLeaveUsers.add(userString);
                }  
                // Today
                if (daysDifference <= 0 && currLeaveDuration > 0 ) {
                  todayAbsentUsers.add(userString);
                } 
                // Tomorrow
                if(daysDifference == 1){
                  tomorrowAbsentUsers.add(userString);
                }
                else if (daysDifference >= 0  && leaveDuration > 1) {
                  tomorrowAbsentUsers.add(userString);
                }
                else if(daysDifference < 0 && currLeaveDuration > 1){
                  tomorrowAbsentUsers.add(userString);
                }
                // Later
                if(currLeaveDuration > 2){
                  laterAbsentUsers.add(userString);
                }
              }
            }
          } else {
            console.log("req.request is undefined or empty");
          }    
        }
        const yesterdayLeaveCount = yesterdayLeaveUsers.size;
        const todayAbsentCount = todayAbsentUsers.size;
        const tomorrowAbsentCount = tomorrowAbsentUsers.size;
        const laterAbsentCount = laterAbsentUsers.size;
        // const previousDaysLeaveCount = previousDaysLeaveUsers.size;
        
        console.log(laterAbsentCount,yesterdayLeaveCount,todayAbsentCount,tomorrowAbsentCount,)
        // Display the leave count for each category
        document.getElementById('yesterday').innerText = yesterdayLeaveCount;
        document.getElementById('today').innerText = todayAbsentCount;
        document.getElementById('tom').innerText = tomorrowAbsentCount;
        document.getElementById('later').innerText = laterAbsentCount;
        
        const tableOptions = {
          "paging": true,
          "lengthChange": false,
          "searching": false,
          "ordering": true,
          "info": true,
          "autoWidth": false,
          "responsive": true,
        }
        const pending = $('#pendingtable').DataTable(tableOptions);
        pending.clear().rows.add(pendingReq).draw();
        const approved = $('#approvedtable').DataTable(tableOptions);
        approved.clear().rows.add(approvedReq).draw();
        const denied = $('#deniedtable').DataTable(tableOptions);
        denied.clear().rows.add(deniedReq).draw();

        let notifyDetails = "";
        let count = 0;

        const notification = await $.get({
          url: '/notification/allRequest',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        console.log(notification)
            if(notification.length > 0){
              if(notification.length > 1){
                notification.sort((a, b) => new Date(b.date) - new Date(a.date));
              }
              const recentNotifications = notification.slice(0, 5);
              for(let not of recentNotifications){
                if(!not.adminSeen){
                  const time = timings(not.date);
                  notifyDetails += `<a href="#" class="dropdown-item" onClick = adminSeenandShowUser('${not.requestId}','${not.bklid}') >
                   <div class="media">
                     <!-- <img src="../dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3"> -->
                     <div class="media-body">
                       <h3 class="dropdown-item-title">
                         ${not.name}
                         <!-- <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span> -->
                       </h3>
                       <p class="text-sm">Sent a Leave Request </p>
                       <p class="text-sm text-muted text-bold"><i class="far fa-clock mr-1"></i> ${time} Ago</p>
                     </div>
                   </div>
                 </a>          
                 <div class="dropdown-divider"></div>`
                 count++;
                }
              }
              document.getElementById('notify').innerHTML = notifyDetails;
            }else{
              document.getElementById('notify').innerHTML = `<a href="#" class="dropdown-item disabled" id="nothing">
              <p class="text-sm text-center"> No notification </p>
            </a>`
            }
            document.getElementById('badge').innerText = `${count}`;
            document.getElementById('nhead').innerText = `${count} Notification`;
    }catch(err){
      if(err.status == 401){
        window.location = "/log";
      }else{
        console.log(err)
        console.error("Request failed with status: " + err.status);
        console.error("Error message: " + err.statusText);
      }
    }
  })

  async function adminSeenandShowUser(reqId, bklid){
    console.log(reqId, bklid)
    await $.ajax({
      url: '/notification/adminSeen',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: {
        requestId: reqId,
        bklid: bklid,
      },
      dataType: 'json', 
      success: function (response) {
        if (response) {
          showUserInfoModal(`${reqId}`, `${bklid}`);
        } else {
          console.log('Not setting adminseen , something went wrong');

        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  }

  function logout(){
    sessionStorage.removeItem('token');
    window.location.href = '/log'
  }
      
      async function showUserInfoModal(reqId, bklid) {
        console.log(bklid)
        const data = await $.get({
          url: '/police/getAllPolice',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        for(let user of data.data){
          if(user.bklid == bklid){
            const name = user.name;
            const phone = user.mobile_no;
            if (user.request && user.request.length) {
              for (let i = 0; i < user.request.length; i++){
                let r = user.request[i];
                if(r.requestId == reqId){
                  const fromDate = dateSeq(r.fromDate);
                  const toDate = dateSeq(r.toDate);
                  const details = `
                  <tr>
                    <th><label for="name">Name</label></th>
                    <td><input type="text" name="" id="user_name" value="${name}" disabled></td>
                  </tr>
                  <tr>
                      <th><label for="name">From To</label></th>
                      <td><input type="text" name="daterange" id="date" value="${fromDate} - ${toDate}" disabled/></td>
                  </tr>
                  <tr>
                    <th><label for="name">Buckle ID</label></th>
                    <td><input type="text" name="" id="bklId" value="${bklid}" disabled></td>
                  </tr>
                  <tr>
                    <th><label for="name">Request ID</label></th>
                    <td><input type="text" name="" id="requestId" value="${reqId}" disabled></td>
                  </tr>
                  <tr>
                    <th><label for="name">Phone</label></th>
                    <td><input type="tel" name="" id="user_phone" value="${phone}" disabled></td>
                  </tr>
                  <tr>
                      <th><label for="name">Leave Type</label></th>
                      <td><input type="tel" name="" id="leave_type" value="${r.leaveType}" disabled></td>
                  </tr>
                  <tr>
                      <th><label for="name">Reason</label></th>
                      <td><textarea name="reason" id="reason" cols="25" disabled>${r.reason}</textarea></td>
                  </tr>
                  <tr>
                      <th><label for="name">Attached File</label></th>
                      <tr><a href="/documents/${r.fileName}" target="_blank">View File</a></tr>
                  </tr>`;

                  
                  let condition;

                  if(r.status == 'Approved'){
                    condition = `<input type="button" name="button" id="button" value="Deny" class="btn btn-danger" onclick="deny('${reqId}','${bklid}')">`
                  }else if(r.status === 'Denied'){
                    condition = `<input type="button" name="button" id="button" value="Approve" class="btn btn-warning" onclick="approve('${reqId}','${bklid}')">`
                  }else{
                    condition = `<input type="button" name="button" id="button" value="Approve" class="btn btn-warning" onclick="approve('${reqId}','${bklid}')">&nbsp;&nbsp;
                    <input type="button" name="button" id="button" value="Deny" class="btn btn-danger" onclick="deny('${reqId}','${bklid})'">`
                  }
                  const beforebutton = `
                  <input type="button" name="button" id="button" value="Modify" class="btn btn-primary" onclick="modify()">&nbsp;&nbsp;
                    ${condition}
                  <br>`

                  const afterbutton = `
                  <input type="button" name="button" id="button" value="Save" class="btn btn-success" onclick="save()" >&nbsp;&nbsp;
                <input type="button" name="button" id="button" value="Cancel" class="btn btn-danger" onclick="cancel('${reqId}','${bklid}')"></td>
                `

                  document.getElementById('before').innerHTML = beforebutton;
                  document.getElementById('after').innerHTML = afterbutton; 

                  document.getElementById('userDetailsModal').innerHTML = details;
                  initializeDateRangePicker();
                  $('#userModal').modal('show');
                  break;
                }
              }
            }  
          }
        }        
      }
    
    function initializeDateRangePicker() {
        $('#date').daterangepicker({
            opens: 'left'
        }, function(start, end, label) {
            console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        });
    }

      function closeButton(){
        document.getElementById('after').style.display = 'none'
        document.getElementById('before').style.display = 'inline-block'
      }
      
      function modify(){
        document.getElementById('date').removeAttribute('disabled')
        document.getElementById('after').style.display = 'inline-block'
        document.getElementById('before').style.display = 'none'
        
      }
      
      function save(){
        document.getElementById('date').disabled = true;
        document.getElementById('after').style.display = 'none'
        document.getElementById('before').style.display = 'inline-block'
      }
      
      function cancel(requestId, bklid){
        document.getElementById('date').disabled = true
        document.getElementById('after').style.display = 'none'
        document.getElementById('before').style.display = 'inline-block'
        showUserInfoModal(requestId,bklid)
      }


      async function approve(requestId, bklid) {
        try {
          const date = document.getElementById('date').value;
          let [fromDate, toDate] = date.split(' - ');
          const leaveType = document.getElementById('leave_type').value;
          fromDate = new Date(fromDate);
          toDate = new Date(toDate);
          const dayCount = date_diff(fromDate, toDate) + 1;
      
          await $.ajax({
            url: '/document/approveRequest',
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            data: {
              requestId: requestId,
              bklid: bklid,
              fromDate: fromDate,
              toDate: toDate,
              dayCount: dayCount,
              leaveType : leaveType,
            },
            dataType: 'json', 
            success: function (response) {
              if (response) {
                localStorage.setItem('approveFlag', 'true');
                location.reload();
              } else {
                console.log('Not approved, something went wrong');
              }
            },
            error: function (err) {
              console.log(err);
            },
          });
        } catch (err) {
          console.log(err);
        }
      }
      
      function deny(requestId, bklid) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger mr-2'
          },
          buttonsStyling: false
        });
      
        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "You want to Deny the request!",
          iconHtml: '<i class="fas fa-exclamation-triangle"></i>',
          showCancelButton: true,
          confirmButtonText: 'Yes, Deny ',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const denyReq = await $.ajax({
                url: '/document/denyRequest',
                method: 'POST', 
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
                data: { 
                  requestId: requestId,
                  bklid: bklid,
                },
                dataType: 'json',
              });
      
              console.log(denyReq);
              
              swalWithBootstrapButtons.fire(
                'Denied!',
                'The request has been denied.',
                'success'
              );
              localStorage.setItem('denyFlag', 'true');
              location.reload();
            } catch (err) {
              console.log(err);
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              'Cancelled',
              'The request was not denied :)',
              'error'
            );
            toastr.info("You didn't Deny the Leave request!");
          }
        });
      }
      

    var date_diff = function(date1, date2) {
      dt1 = new Date(date1);
      dt2 = new Date(date2);
      return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) / (1000 * 60 * 60 * 24));
    }
    const dateFormat = (date) => {
      let newDate = new Date(date).toLocaleString("en-us", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return newDate;
    };


    function dateSeq(date){
      const inputDate = new Date(date);
      const day = inputDate.getDate();
      const month = inputDate.getMonth() + 1; 
      const year = inputDate.getFullYear();
      // Format the date as mm/dd/yyyy
      const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

      return formattedDate;
    }

   function timings(upDate) {
    const currentDate = new Date();
    const uploadDate = new Date(upDate);
    const timeDifferenceInMilliseconds = currentDate - uploadDate;
    const minutesDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));

    if (minutesDifference < 60) {
        return `${minutesDifference} minutes`;
    } else if (minutesDifference < 1440) { 
        const hoursDifference = Math.floor(minutesDifference / 60);
        return `${hoursDifference} hours`;
    } else if (minutesDifference < 43200) {
        const daysDifference = Math.floor(minutesDifference / 1440);
        return `${daysDifference} days`;
    } else {
        const monthsDifference = Math.floor(minutesDifference / 43200);
        return `${monthsDifference} months`;
    }
}
