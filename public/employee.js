// function uploadFile() {
//     const fileInput = document.getElementById('fileInput');
//     const file = fileInput.files[0];

//     if (!file) {
//       alert('Please select a file to upload.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     const token = sessionStorage.getItem('token')

//     const res = $.post({
//         url: '/police/uploads',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body : formData
//     }).catch(err=>{
//         console.log('something is wrong'+err)
//     })
//     console.log(res.message)
//     // fetch('police/upload', {
//     //   method: 'POST',
//     //   body: formData,
//     // })
//     // .then(response => response.json())
//     // .then(data => {
//     //   // Handle the response, e.g., display a success message or update the document list
//     //   console.log(data.message);

//     //   // Reload the document list
//     // //   loadDocumentList();
//     // })
//     // .catch(error => {
//     //   console.error('Error uploading file:', error);
//     // });
//   }

$(function() {
  $('#oneday').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: moment().format('YYYY'),
    maxYear: parseInt(moment().format('YYYY'),10)
  }, function(start, end, label) {
    console.log('your date has been selected');
  });
});

// function showSecondDropdown() {
//   const oneleaveTypeSelect = document.getElementById("oneinputState");
//   console.log(oneleaveTypeSelect.value);
//   const mleaveTypeSelect = document.getElementById("minputState");
//   const onesecondDropdown = document.getElementById('onesecondDropdown')
//   const msecondDropdown = document.getElementById('msecondDropdown')
  

//   if (oneleaveTypeSelect.value === "casualLeave") {
//       onesecondDropdown.style.display = "block";
//   } else {
//       onesecondDropdown.style.display = "none";
//   }

//   if(mleaveTypeSelect.value === "casualLeave"){
//     msecondDropdown.style.display = "block"
//   }else{
//     msecondDropdown.style.display = "none";
//   }
// }

function toggleForm(formType) {
  const singleLeaveBtn = document.getElementById('singleLeaveBtn');
  const multipleLeaveBtn = document.getElementById('multipleLeaveBtn');
  const singleDayLeaveForm = document.getElementById('singleDayLeaveForm');
  const multipleDayLeaveForm = document.getElementById('multipleDayLeaveForm');

  if (formType === 'single') {
    singleLeaveBtn.classList.add('active');
    multipleLeaveBtn.classList.remove('active');
    singleDayLeaveForm.classList.remove('d-none');
    multipleDayLeaveForm.classList.add('d-none');
  } else {
    singleLeaveBtn.classList.remove('active');
    multipleLeaveBtn.classList.add('active');
    singleDayLeaveForm.classList.add('d-none');
    multipleDayLeaveForm.classList.remove('d-none');
  }
}


function initializeDateRangePicker() {
    $('#mdate').daterangepicker({
        opens: 'right',
        startDate : moment(),
        endDate : moment(),
    }, function(start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
}



const token = sessionStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async event=>{
  const showSuccessMessage = localStorage.getItem('showSuccessMessage');

  if (showSuccessMessage === 'true') {
    document.querySelector('.alert-success').classList.remove('d-none');
    localStorage.removeItem('showSuccessMessage');
  }
    const date = new Date();
    initializeDateRangePicker();
    try{
      const policeData =  await $.get({
        url: '/police/getPolice',
        headers: { 'Authorization': `Bearer ${token}`},
      })
      console.log(policeData[0])
      if(policeData[0].leave){
        const cls = policeData[0].leave.casualLeave + policeData[0].leave.holidayPermission + policeData[0].leave.governmentHoliday + policeData[0].leave.restrictedHoliday;
        document.getElementById('cls').innerText = cls;
        document.getElementById('cl').innerText = policeData[0].leave.casualLeave;
        document.getElementById('cld').innerText = policeData[0].leave.casualLeave;
        document.getElementById('hpl').innerText = policeData[0].leave.holidayPermission;
        document.getElementById('hpld').innerText = policeData[0].leave.holidayPermission;
        document.getElementById('rh').innerText = policeData[0].leave.restrictedHoliday;
        document.getElementById('rhd').innerText = policeData[0].leave.restrictedHoliday;
        document.getElementById('gh').innerText = policeData[0].leave.governmentHoliday;
        document.getElementById('ghd').innerText = policeData[0].leave.governmentHoliday;
        document.getElementById('el').innerText = policeData[0].leave.earnedLeave;
        document.getElementById('pl').innerText = policeData[0].leave.paternityLeave;
        document.getElementById('ml').innerText = policeData[0].leave.medicalLeave;
      }
      
      // console.log(policeData[0]);
      document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${policeData[0].name}</a>`
      
      const notification =  await $.get({
        url: '/notification/oneRequest',
        headers: { 'Authorization': `Bearer ${token}`},
      })    
      let count = 0;
      console.log(notification)
      let notify = "";
      if(notification.length > 0){
        if(notification.length > 1){
          notification.sort((a, b) => new Date(b.mDate) - new Date(a.mDate));
        }
        const recentNotifications = notification.slice(0, 5);
        for(let not of recentNotifications){
          console.log(not)
          if(not.adminSeen){
            const time = timings(not.mDate);
            if(not.status == 'Approved'){
              notify += `<a href="#" class="dropdown-item" onClick = adminSeenandShowUser('${not.requestId}',${not.bklid})>
              <div class="media">
                <!-- <img src="../dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3"> -->
                <div class="media-body">
                  <p class="text-sm">Your Leave Request has been Approved. </p>
                  <p class="text-sm text-muted text-bold"><i class="far fa-clock mr-1"></i> ${time} Ago</p>
                </div>
              </div>
            </a>          
            <div class="dropdown-divider"></div>`
            count++;
            }else if(not.status == 'Denied'){
              notify += `<a href="#" class="dropdown-item" onClick = adminSeenandShowUser('${not.requestId}',${not.bklid}) >
              <div class="media">
                <!-- <img src="../dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3"> -->
                <div class="media-body">
                  <p class="text-sm">Your Leave Request has been Denied.</p>
                  <p class="text-sm text-muted text-bold"><i class="far fa-clock mr-1"></i> ${time} Ago</p>
                </div>
              </div>
            </a>          
            <div class="dropdown-divider"></div>`
            count++;
            }
          }
        }
        document.getElementById('notify').innerHTML = notify;
      }else{
        document.getElementById('notify').innerText = notify;
      }
      document.getElementById('ihead').innerText = `${count} Notification`;
      document.getElementById('badge').innerText = count;
      
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
      url: '/notification/employeeSeen',
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
          // showUserInfoModal(reqId, bklid);
          console.log("swaped done successfully");
        } else {
          console.log('Not setting adminseen, something went wrong');

        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  
  async function uploadMultipleDetails() {
    try{
      const fileInput = document.getElementById('mfileInput');
      const file = fileInput.files[0];
      const dateRange = document.getElementById('mdate').value;
      const [fromDateStr, toDateStr] = dateRange.split(' - ');
      const currDate = new Date();
      const fromDate = new Date(fromDateStr);
      const toDate = new Date(toDateStr);
      const reason = document.getElementById('mreason').value;
      const leaveValue = document.getElementById('minputState').value;
      const messageElement = document.getElementById('mmessage');

      if (leaveValue === "none") {
        messageElement.style.display = 'block';
        return;
      } else {
        messageElement.style.display = 'none';
        console.log('ur option selected')
      }

      // if(leaveValue === "casualLeave"){
      //   const smessageElement = document.getElementById('smmessage');
      //   const sleaveValue = document.getElementById('msecondInputState').value;
      //   if(sleaveValue === "none"){
      //     smessageElement.style.display = 'block';
      //     return;
      //   }else{
      //     leaveType = sleaveValue;
      //     smessageElement.style.display = 'none';
      //     console.log('ur option selected')
      //   }
      // }

      let dayCount = date_diff(fromDate,toDate) + 1;
      const fmess = document.getElementById('ferrmessage');
      // const smess = document.getElementById('serrmessage');
      let weekendDays = countWeekendDays(new Date(fromDate),new Date(toDate));

      const leaveDays =  await $.get({
        url: '/police/getPolice',
        headers: { 'Authorization': `Bearer ${token}`},
      })

      console.log(leaveDays)
      console.log(leaveValue)
      switch (leaveValue){
        case 'casualLeave' :

          if(leaveDays[0].leave.holidayPermission > 0 ){
            if(weekendDays > 0){
              dayCount = dayCount - weekendDays;
            }
          }else{  
            weekendDays = 0;
          }
          
          if(leaveDays[0].leave.casualLeave < dayCount ){
            fmess.innerText = ` * ${leaveValue} has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} leave, If U have Holiday Permission Apply leave for saturday and Sunday  `;
            fmess.style.display = 'block'
            return;
          }
          // smess.style.display = 'none'
          fmess.style.display = 'none'
          break;
        case 'medicalLeave' :
          if(leaveDays[0].leave.medicalLeave < dayCount){
            fmess.innerText = ` * Medical Leave has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} days leave`;
            fmess.style.display = 'block'
            return;
          }
          // smess.style.display = 'none'
          fmess.style.display = 'none'
          break;
        // case 'holidayPermission' :
        //   if(leaveDays[0].leave.holidayPermission < dayCount){
        //     smess.innerText = ` * Holiday Permission has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} days leave`;
        //     // smess.style.display = 'block'
        //     return;
        //   }
        //   // smess.style.display = 'none'
        //   fmess.style.display = 'none'          
        //   break;
        // case 'governmentHoliday' :
        //   if(leaveDays[0].leave.governmentHoliday < dayCount){
        //     smess.innerText = ` * Government Holiday has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} days leave`;
        //     // smess.style.display = 'block'
        //     return;
        //   }
        //   // smess.style.display = 'none'
        //   fmess.style.display = 'none'
        //   break;
        // case 'restrictedHoliday' :
        //   if(leaveDays[0].leave.restrictedHoliday < dayCount){
        //     smess.innerText = ` * Restricted Holiday has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} days leave`;
        //     // smess.style.display = 'block'
        //     return;
        //   }
        //   // smess.style.display = 'none'
        //   fmess.style.display = 'none'
        //   break;
        case 'earnedLeave' :
          dayCount = earnedLeaveCount(fromDate, toDate ,dayCount)
          if(leaveDays[0].leave.earnedLeave < dayCount){
            fmess.innerText = ` * Earned Leave has ${leaveDays[0].leave.earnedLeave} leave, U can't apply ${dayCount} leave`;
            fmess.style.display = 'block'
            return;
          }
          // smess.style.display = 'none'
          fmess.style.display = 'none';
          break;
        case 'paternityLeave' :
          if(leaveDays[0].leave.paternityLeave < dayCount){
            fmess.innerText = ` * Paternity Leave has ${leaveDays[0].leave.paternityLeave} leave, U can't apply ${dayCount} leave`;
            fmess.style.display = 'block'
            return;
          }
          // smess.style.display = 'none'
          fmess.style.display = 'none';
          break;
      }

      if (date_diff(currDate,fromDate) < 0) {
        alert('Please select a valid date in the future or today for the "From Date".');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fromDate', fromDate);
      formData.append('toDate',toDate);
      if(leaveValue === 'casualLeave'){
        formData.append('weekendDays',weekendDays);
      }
      formData.append('dayCount',dayCount);
      formData.append('leaveType',leaveValue);
      formData.append('reason',reason);
    
      const response = await fetch('/document/pushRequest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        localStorage.setItem('showSuccessMessage', 'true');
        window.location.reload();
      } else {
        console.error('Request failed:', response);
      }
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

  function logout(){
    sessionStorage.removeItem('token');
    window.location.href = '/log'
  }

async function uploadSingleDetails() {
  try{
    const fileInput = document.getElementById('onefileInput');
    const file = fileInput.files[0];
    console.log(file);
    const dateRange = document.getElementById('oneday').value;
    const currDate = new Date();
    const fromDate = new Date(dateRange);
    const toDate = new Date(dateRange);
    const reason = document.getElementById('onereason').value;    
    const leaveValue = document.getElementById('oneinputState').value;
    const messageElement = document.getElementById('onemessage');
    console.log(leaveValue)


    let dayCount = date_diff(fromDate,toDate) + 1;
    let weekendDays = countWeekendDays(new Date(fromDate),new Date(toDate));
    
      const fmess = document.getElementById('sferrmessage');
      // const smess = document.getElementById('sserrmessage');

      const leaveDays =  await $.get({
        url: '/police/getPolice',
        headers: { 'Authorization': `Bearer ${token}`},
      })

      
      console.log(leaveDays)
      switch (leaveValue){
        case 'casualLeave' :
          if(leaveDays[0].leave.holidayPermission > 0 ){
            if(weekendDays > 0){
              dayCount = dayCount - weekendDays;
            }
          }else{  
            weekendDays = 0;
          }
          if(leaveDays[0].leave.casualLeave < dayCount){
            fmess.innerText = `${leaveValue} has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} leave, If U have Holiday Permission Apply leave for saturday and Sunday`;
            // smess.style.display = 'block'
            return;
          }
          // smess.style.display = 'none'
          fmess.style.display = 'none'
          break;
        case 'medicalLeave' :
          if(leaveDays[0].leave.medicalLeave < dayCount){
            fmess.innerText = `${leaveValue} has ${leaveDays[0].leave.medicalLeave} leave, U can't apply ${dayCount} leave`;
            fmess.style.display = 'block'
            return;
          }
          // smess.style.display = 'none'
          fmess.style.display = 'none'
          break;
        // case 'holidayPermission' :
        //   if(leaveDays[0].leave.holidayPermission < dayCount){
        //     smess.innerText = `${leaveValue} has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} leave`;
        //     smess.style.display = 'block'
        //     return;
        //   }
        //   smess.style.display = 'none'
        //   fmess.style.display = 'none'          
        //   break;
        // case 'governmentHoliday' :
        //   if(leaveDays[0].leave.governmentHoliday < dayCount){
        //     smess.innerText = `${leaveValue} has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} leave`;
        //     smess.style.display = 'block'
        //     return;
        //   }
        //   smess.style.display = 'none'
        //   fmess.style.display = 'none'
        //   break;
        // case 'restrictedHoliday' :
        //   if(leaveDays[0].leave.restrictedHoliday < dayCount){
        //     smess.innerText = `${leaveValue} has ${leaveDays[0].leave.casualLeave} leave, U can't apply ${dayCount} leave`;
        //     smess.style.display = 'block'
        //     return;
        //   }
        //   smess.style.display = 'none'
        //   fmess.style.display = 'none'
        //   break;
        case 'earnedLeave' :
          dayCount = earnedLeaveCount(fromDate, toDate ,dayCount)
          if(leaveDays[0].leave.earnedLeave < dayCount){
            fmess.innerText = `${leaveValue} has ${leaveDays[0].leave.earnedLeave} leave, U can't apply ${dayCount} leave`;
            fmess.style.display = 'block'
            return;
          }
          // smess.style.display = 'none'
          fmess.style.display = 'none'
          break;
        case 'paternityLeave' :
          if(leaveDays[0].leave.paternityLeave < dayCount){
            fmess.innerText = `${leaveValue} has ${leaveDays[0].leave.paternityLeave} leave, U can't apply ${dayCount} leave`;
            fmess.style.display = 'block'
            return;
          }
          // smess.style.display = 'none'
          fmess.style.display = 'none'
          break;
      }

    if (date_diff(currDate,fromDate) < 0) {
      alert('Please select a valid date in the future or today for the "From Date".');
      return;
    }

    if (leaveValue === "none") {
      messageElement.style.display = 'block';
      return;
    } else {
      messageElement.style.display = 'none';
      console.log('ur option selected')
    }

    // if(leaveValue === "casualLeave"){
    //   const smessageElement = document.getElementById('sonemessage');
    //   const sleaveValue = document.getElementById('onesecondInputState').value;
    //   console.log(sleaveValue)
    //   if(sleaveValue === "none"){
    //     smessageElement.style.display = 'block';
    //     return;
    //   }else{
    //     leaveType = sleaveValue;
    //     smessageElement.style.display = 'none';
    //     console.log('ur option selected')
    //   }
    // }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fromDate', fromDate);
    formData.append('toDate',toDate);
    formData.append('dayCount',dayCount);
    formData.append('weekendDays',weekendDays);
    formData.append('leaveType',leaveValue);
    formData.append('reason',reason);
  
    const response = await fetch('/document/pushRequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) {
        localStorage.setItem('showSuccessMessage', 'true');
        window.location.reload();
      
    } else {
      console.error('Request failed:', response);
    }
  }catch(err){
    console.log(err)
    console.log("something wrong while sending request " + err);
  }

}


const date_diff = (date1, date2)=> {
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


function timings(upDate) {
  const currentDate = new Date();
  const uploadDate = new Date(upDate);
  const timeDifferenceInMilliseconds = currentDate - uploadDate;
  const minutesDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));

  if (minutesDifference < 60) {
      return `${minutesDifference} minutes`;
  } else if (minutesDifference < 1440) { // Less than 24 hours (1 day)
      const hoursDifference = Math.floor(minutesDifference / 60);
      return `${hoursDifference} hours`;
  } else if (minutesDifference < 43200) { // Less than 30 days (1 month)
      const daysDifference = Math.floor(minutesDifference / 1440);
      return `${daysDifference} days`;
  } else {
      const monthsDifference = Math.floor(minutesDifference / 43200);
      return `${monthsDifference} months`;
  }
}


function countWeekendDays(startDate, endDate) {
  let count = 0;
  let currentDate = new Date(startDate);
 
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // 0 or 6 corresponds to Sunday or Saturday
      count++;
    }
 
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
 
  return count;
 }
 
 

 function earnedLeaveCount(startDate, endDate,dayCount) {
  let currentDate = new Date(startDate);
  endDate = new Date(endDate); 
    const currdayOfWeek = currentDate.getDay(); 
    const enddayOfWeek = endDate.getDay(); 
    console.log(currdayOfWeek, enddayOfWeek, dayCount)
    
    if (currdayOfWeek === 0 ) {
      dayCount -= 1;
    }else if(currdayOfWeek === 6){
        dayCount -= 2;
    }
    if (enddayOfWeek === 0 ) {
      dayCount -=2;
    }else if(enddayOfWeek === 6){
        dayCount -= 1;
    }
    
  return dayCount;
 }
