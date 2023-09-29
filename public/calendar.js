
const token = sessionStorage.getItem('token');
let eventDataForAPI;

$(async function () {


  const data =  await $.get({
    url: '/police/getPolice',
    headers: { 'Authorization': `Bearer ${token}`},
  })

  console.log(data)
  document.getElementById('info').innerHTML = `<a href="#" class="d-block">${data[0].name}</a> `

  if(data[0].accesstype == 'admin'){
    document.getElementById('admin').classList.remove('d-none') 
    document.getElementById('navAdmin').classList.remove('d-none') 
    document.getElementById('topic').innerText = 'ADMIN' 
    
  }else{
    document.getElementById('normal').classList.remove('d-none') 
    document.getElementById('navNormal').classList.remove('d-none') 
    document.getElementById('topic').innerText = 'IRBN' 


  }

    /* initialize the external events
     -----------------------------------------------------------------*/
    function ini_events(ele) {
      ele.each(function () {

        // create an Event Object (https://fullcalendar.io/docs/event-object)
        var eventObject = {
          title: $.trim($(this).text())
        }
        $(this).data('eventObject', eventObject)

        $(this).draggable({
          zIndex        : 1070,
          revert        : true,
          revertDuration: 0 
        })

      })
    }

    ini_events($('#external-events div.external-event'))

    /* initialize the calendar
     -----------------------------------------------------------------*/
    var Calendar = FullCalendar.Calendar;
    var Draggable = FullCalendar.Draggable;

    var containerEl = document.getElementById('external-events');
    var checkbox = document.getElementById('drop-remove');
    var calendarEl = data[0].accesstype == 'admin' ? document.getElementById('calendar') : document.getElementById('calendar2');

    // initialize the external events
    // -----------------------------------------------------------------
     new Draggable(containerEl, {
      itemSelector: '.external-event',
      eventData: function(eventEl) {

            eventDataForAPI = {
                title: eventEl.innerText,
                backgroundColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
                borderColor: window.getComputedStyle(eventEl, null).getPropertyValue('background-color'),
                textColor: window.getComputedStyle(eventEl, null).getPropertyValue('color'),
            };
            return eventDataForAPI;
        
      }
    });
    var res;
    await fetch('/event/',{
      method : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.ok) {
          return response.json(); // Parse the response as JSON
      } else {
          console.log('Error:', response.status);
          throw new Error('Network response was not ok.');
      }
  })
  .then(data => {
    const showEvents = new Set();
    let addEvents = "";
    for(let i = 0 ; i < data.length ; i++){
      if(!showEvents.has(data[i].title)){
        showEvents.add(data[i].title);
        addEvents += `<div class="external-event" style="background-color : ${data[i].backgroundColor};color: white;" >${data[i].title}</div>`
      }
    }
    document.getElementById('external-events').innerHTML = `
    ${addEvents}<div class="checkbox">
    <label for="drop-remove">
      <input type="checkbox" id="drop-remove">
      remove after drop
    </label>
    </div>
  `;
    document.getElementById('external-event').innerHTML = `
    ${addEvents}
  `;
    // renderExternalEvents(data)

    res = data.map(({ _id, ...event }) => ({
      ...event, 
      start: new Date(event.start) 
    }));
      console.log(res);
  })
  .catch(error => {
      console.error('Fetch error:', error);
  });

    var calendar = new Calendar(calendarEl, {
      headerToolbar: {
        left  : 'prev,next today',
        center: 'title',
        right : 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      themeSystem: 'bootstrap',
      events: await res.map(event => ({
        title: event.title,
        start: new Date(event.start),
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        allDay: event.allDay
    })),
      editable  : true,
      droppable : true, 
      drop: data[0].accesstype == 'admin' ? function(info) {
        console.log(eventDataForAPI);
        console.log(info.draggedEl.innerText);
        console.log(info.date);
        pushEvent(eventDataForAPI, info.draggedEl.innerText, info.date );
        if (checkbox.checked) {
            info.draggedEl.parentNode.removeChild(info.draggedEl);
        } 
      }: console.log('dropped '),

      eventClick: data[0].accesstype == 'admin' ?function (info) {
        console.log(eventDataForAPI);

        console.log(info)
        console.log(info.el.innerText);
        console.log(info.event.start);
        deleteUser(info.el.innerText, info.event.start);
        info.event.remove();
      }: console.log('clicked'),
    });

    calendar.render();
    // $('#calendar').fullCalendar()

    /* ADDING EVENTS */
    var currColor = '#3c8dbc' //Red by default
    // Color chooser button
    $('#color-chooser > li > a').click(function (e) {
      e.preventDefault()
      // Save color
      currColor = $(this).css('color')
      // Add color effect to button
      $('#add-new-event').css({
        'background-color': currColor,
        'border-color'    : currColor
      })
    })
    $('#add-new-event').click(function (e) {
      e.preventDefault()
      var val = $('#new-event').val()
      if (val.length == 0) {
        return;
      }

      // Create events
      var event = $('<div />')
      event.css({
        'background-color': currColor,
        'border-color'    : currColor,
        'color'           : '#fff'
      }).addClass('external-event')
      event.text(val)
      $('#external-events').prepend(event)

      ini_events(event)

      $('#new-event').val('')
    })
})

function pushEvent(props, title, date){
    const data = {
      title : title,
      borderColor : props.borderColor,
      backgroundColor : props.backgroundColor,
      title : title,
      start : new Date(date),
    }
    fetch('/event/pushEvent', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status === 200) {
            console.log('Event pushed successfully.');
          } else {
            console.error('Failed to push event.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
} 


function deleteUser(title, date){
  const data = {
    title : title,
    start : new Date(date)
  }
  fetch('/event/deleteEvent', {
    method:  'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        console.log('Event deleted successfully.');
      } else {
        console.error('Failed to delete event.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// function renderExternalEvents(events) {
//   let externalEventsHtml = '';
//   for (let i = 0; i < events.length; i++) {
//       externalEventsHtml += `<div class="external-event" style="background-color: ${events[i].backgroundColor}">${events[i].title}</div>`;
//   }

//   externalEventsHtml += `${externalEventsHtml}  <div class="checkbox">
//   <label for="drop-remove">
//     <input type="checkbox" id="drop-remove">
//     remove after drop
//   </label>
// </div>`
//   $('#external-events').html(externalEventsHtml);
// }
