const token = sessionStorage.getItem('token')


async function today(){
    try{
      console.log('im working');
    console.log(token)
    const data = await $.get({
            url: '/police/getAllPolice',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const userData = data.data;
        const bklid = data.bklid;
        let s = 1;
        const today = [];
        for(let req of userData){
          if(bklid === req.bklid){
              document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${req.name}</a>`
          }
          const name = req.name;
          let bklidreq = req.bklid;
          const policeType = req.policetype;
          // console.log(req.request)
          if (req.request && req.request.length) {
            req.request.sort((a, b) => new Date(b.date) - new Date(a.date));
            for (let i = 0; i < req.request.length; i++) {
              let r = req.request[i];
              const fromDate = new Date(r.fromDate);
              const toDate = new Date(r.toDate);
              const currentDate = new Date();
              if (r.status === "Approved") {
                let daysDifference = Math.floor((fromDate - currentDate) / (24 * 60 * 60 * 1000))+1;
                console.log("daysDifference : "+daysDifference)
        
                let leaveDuration = Math.floor((toDate - fromDate) / (24 * 60 * 60 * 1000)) + 1;
                console.log("leaveDuration : "+leaveDuration)

                let currLeaveDuration = leaveDuration + daysDifference;
                console.log("currLeaveDuration : "+currLeaveDuration)                
                // Yesterday
                // if (daysDifference < 0 && currLeaveDuration >= 0 ) {
                //     yesterday.push([s, name, bklidreq,policeType,r.leaveType])
                // } 
                // Today
                if (daysDifference <= 0 && currLeaveDuration > 0 ) {
                    today.push([s, name, bklidreq,policeType,r.leaveType,  `<button class="btn btn-primary rounded-circle" onClick="openReq('${bklidreq}','${r.requestId}')">Info</button>`])
                } 
                // // Tomorrow
                // if(daysDifference == 1){
                //   tomorrowAbsentUsers.add(userString);
                // }
                // else if (daysDifference >= 0  && leaveDuration > 1) {
                //   tomorrowAbsentUsers.add(userString);
                // }
                // else if(daysDifference < 0 && currLeaveDuration > 1){
                //   tomorrowAbsentUsers.add(userString);
                // }
                // // Later
                // if(currLeaveDuration > 2){
                //   laterAbsentUsers.add(userString);
                // }
              }
            }
          } else {
            console.log("req.request is undefined or empty");
          }    
        }
        
        const tableOptions = {
          "paging": true,
          "lengthChange": true,
          "searching": false,
          "ordering": true,
          "info": true,
          "autoWidth": true,
          "responsive": true,
        }
        const todaytab = $('#today').DataTable(tableOptions);
        todaytab.clear().rows.add(today).draw();
    }catch(error){
      if(error.status == 401){
        window.location = "/log";
      }else{
        console.error("Request failed with status: " + error.status);
        console.error("Error message: " + error.statusText);
      }
    }
}
function openReq(bklid, reqId){
  reqId = `${reqId}`;
  bklid = `${bklid}`
  sessionStorage.setItem('reqId', reqId);
  sessionStorage.setItem('bklid', bklid);
  window.location.href = `/request`

}

function logout(){
  sessionStorage.removeItem('token');
  window.location.href = '/log'
}
   
async function tomorrow(){
    try{
      console.log('im working');
    console.log(token)
    const data = await $.get({
            url: '/police/getAllPolice',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const userData = data.data;
        const bklid = data.bklid;
        let s = 1;
        const tomorrow = [];
        for(let req of userData){
          if(bklid === req.bklid){
              document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${req.name}</a>`
          }
          const name = req.name;
          let bklidreq = req.bklid;
          const policeType = req.policetype;
          // console.log(req.request)
          if (req.request && req.request.length) {
            req.request.sort((a, b) => new Date(b.date) - new Date(a.date));
            for (let i = 0; i < req.request.length; i++) {
              let r = req.request[i];
              const fromDate = new Date(r.fromDate);
              const toDate = new Date(r.toDate);
              const currentDate = new Date();
              if (r.status === "Approved") {
                let daysDifference = Math.floor((fromDate - currentDate) / (24 * 60 * 60 * 1000))+1;
                console.log("daysDifference : "+daysDifference)
        
                let leaveDuration = Math.floor((toDate - fromDate) / (24 * 60 * 60 * 1000)) + 1;
                console.log("leaveDuration : "+leaveDuration)

                let currLeaveDuration = leaveDuration + daysDifference;
                console.log("currLeaveDuration : "+currLeaveDuration)                
                // Yesterday
                // if (daysDifference < 0 && currLeaveDuration >= 0 ) {
                //     yesterday.push([s, name, bklidreq,policeType,r.leaveType])
                // } 
                // Today
                // if (daysDifference <= 0 && currLeaveDuration > 0 ) {
                //     tomorrow.push([s, name, bklidreq,policeType,r.leaveType])
                // } 
                // // Tomorrow
                if(daysDifference == 1){
                    tomorrow.push([s, name, bklidreq,policeType,r.leaveType, `<button class="btn btn-primary rounded-circle" onClick="openReq('${bklidreq}','${r.requestId}')">Info</button>`])
                }
                else if (daysDifference >= 0  && leaveDuration > 1) {
                    tomorrow.push([s, name, bklidreq,policeType,r.leaveType, `<button class="btn btn-primary rounded-circle" onClick="openReq('${bklidreq}','${r.requestId}')">Info</button>`])
                }
                else if(daysDifference < 0 && currLeaveDuration > 1){
                    tomorrow.push([s, name, bklidreq,policeType,r.leaveType, `<button class="btn btn-primary rounded-circle" onClick="openReq('${bklidreq}','${r.requestId}')">Info</button>`])
                }
                // // Later
                // if(currLeaveDuration > 2){
                //   laterAbsentUsers.add(userString);
                // }
              }
            }
          } else {
            console.log("req.request is undefined or empty");
          }    
        }
        
        const tableOptions = {
          "paging": true,
          "lengthChange": true,
          "searching": false,
          "ordering": true,
          "info": true,
          "autoWidth": true,
          "responsive": true,
        }
        const tomorrowtab = $('#tomorrow').DataTable(tableOptions);
        tomorrowtab.clear().rows.add(tomorrow).draw();
    }catch(error){
      if(error.status == 401){
        window.location = "/log";
      }else{
        console.error("Request failed with status: " + error.status);
        console.error("Error message: " + error.statusText);
      }
    }
}

async function yesterday(){
    try{
      console.log('im working');
    console.log(token)
    const data = await $.get({
            url: '/police/getAllPolice',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const userData = data.data;
        const bklid = data.bklid;
        let s = 1;
        const yesterday = [];
        for(let req of userData){
          if(bklid === req.bklid){
              document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${req.name}</a>`
          }
          const name = req.name;
          let bklidreq = req.bklid;
          const policeType = req.policetype;
          // console.log(req.request)
          if (req.request && req.request.length) {
            req.request.sort((a, b) => new Date(b.date) - new Date(a.date));
            for (let i = 0; i < req.request.length; i++) {
              let r = req.request[i];
              const fromDate = new Date(r.fromDate);
              const toDate = new Date(r.toDate);
              const currentDate = new Date();
              if (r.status === "Approved") {
                let daysDifference = Math.floor((fromDate - currentDate) / (24 * 60 * 60 * 1000))+1;
                console.log("daysDifference : "+daysDifference)
        
                let leaveDuration = Math.floor((toDate - fromDate) / (24 * 60 * 60 * 1000)) + 1;
                console.log("leaveDuration : "+leaveDuration)

                let currLeaveDuration = leaveDuration + daysDifference;
                console.log("currLeaveDuration : "+currLeaveDuration)                
                // Yesterday
                if (daysDifference < 0 && currLeaveDuration >= 0 ) {
                    yesterday.push([s, name, bklidreq,policeType,r.leaveType, `<button class="btn btn-primary rounded-circle" onClick="openReq('${bklidreq}','${r.requestId}')">Info</button>`])
                } 
                // Today
                // if (daysDifference <= 0 && currLeaveDuration > 0 ) {
                //   todayAbsentUsers.add(userString);
                // } 
                // // Tomorrow
                // if(daysDifference == 1){
                //   tomorrowAbsentUsers.add(userString);
                // }
                // else if (daysDifference >= 0  && leaveDuration > 1) {
                //   tomorrowAbsentUsers.add(userString);
                // }
                // else if(daysDifference < 0 && currLeaveDuration > 1){
                //   tomorrowAbsentUsers.add(userString);
                // }
                // // Later
                // if(currLeaveDuration > 2){
                //   laterAbsentUsers.add(userString);
                // }
              }
            }
          } else {
            console.log("req.request is undefined or empty");
          }    
        }
        
        const tableOptions = {
          "paging": true,
          "lengthChange": true,
          "searching": false,
          "ordering": true,
          "info": true,
          "autoWidth": true,
          "responsive": true,
        }
        const yesterdaytab = $('#yesterday').DataTable(tableOptions);
        yesterdaytab.clear().rows.add(yesterday).draw();
    }catch(error){
      if(error.status == 401){
        window.location = "/log";
      }else{
        console.error("Request failed with status: " + error.status);
        console.error("Error message: " + error.statusText);
      }
    }
}

async function later(){
    try{
      console.log('im working');
    console.log(token)
    const data = await $.get({
            url: '/police/getAllPolice',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const userData = data.data;
        const bklid = data.bklid;
        let s = 1;
        const later = [];
        for(let req of userData){
          if(bklid === req.bklid){
              document.getElementById('info').innerHTML = `<a href="/profile" class="d-block">${req.name}</a>`
          }
          const name = req.name;
          let bklidreq = req.bklid;
          const policeType = req.policetype;
          // console.log(req.request)
          if (req.request && req.request.length) {
            req.request.sort((a, b) => new Date(b.date) - new Date(a.date));
            for (let i = 0; i < req.request.length; i++) {
              let r = req.request[i];
              const fromDate = new Date(r.fromDate);
              const toDate = new Date(r.toDate);
              const currentDate = new Date();
              if (r.status === "Approved") {
                let daysDifference = Math.floor((fromDate - currentDate) / (24 * 60 * 60 * 1000))+1;
                console.log("daysDifference : "+daysDifference)
        
                let leaveDuration = Math.floor((toDate - fromDate) / (24 * 60 * 60 * 1000)) + 1;
                console.log("leaveDuration : "+leaveDuration)

                let currLeaveDuration = leaveDuration + daysDifference;
                console.log("currLeaveDuration : "+currLeaveDuration)                
                // Yesterday
                if (daysDifference < 0 && currLeaveDuration >= 0 ) {
                    later.push([s, name, bklidreq,policeType,r.leaveType, `<button class="btn btn-primary rounded-circle" onClick="openReq('${bklidreq}','${r.requestId}')">Info</button>`])
                } 
                // Today
                // if (daysDifference <= 0 && currLeaveDuration > 0 ) {
                //   todayAbsentUsers.add(userString);
                // } 
                // // Tomorrow
                // if(daysDifference == 1){
                //   tomorrowAbsentUsers.add(userString);
                // }
                // else if (daysDifference >= 0  && leaveDuration > 1) {
                //   tomorrowAbsentUsers.add(userString);
                // }
                // else if(daysDifference < 0 && currLeaveDuration > 1){
                //   tomorrowAbsentUsers.add(userString);
                // }
                // // Later
                // if(currLeaveDuration > 2){
                //   laterAbsentUsers.add(userString);
                // }
              }
            }
          } else {
            console.log("req.request is undefined or empty");
          }    
        }
        
        const tableOptions = {
          "paging": true,
          "lengthChange": true,
          "searching": false,
          "ordering": true,
          "info": true,
          "autoWidth": true,
          "responsive": true,
        }
        const latertab = $('#later').DataTable(tableOptions);
        latertab.clear().rows.add(later).draw();
    }catch(error){
      if(error.status == 401){
        window.location = "/log";
      }else{
        console.error("Request failed with status: " + error.status);
        console.error("Error message: " + error.statusText);
      }
    }
        
}