const locationHost = "192.168.1.118";
const statusURL = "http://" + locationHost + "/api/ledstatus";

const hwStateURL= "ws://" + locationHost + "/hwstate";
const hwSocket = new WebSocket(hwStateURL);

hwSocket.addEventListener('message', ev => {
    console.log('<<< ' + ev.data);
});
hwSocket.addEventListener('close', ev => {
    console.log("<<< closing 'hwstate' endpoint.");
});

document.addEventListener("change", function(){

    if (document.querySelector("#ledSwitch").checked) {
        //add the code to send a WS 'ON' message...
        hwSocket.send(1);
        console.log("Msg to turn LED ON has been sent via WS...");
       }
    else {
        //add the code to send a WS 'OFF' message...
        hwSocket.send(0)
        console.log("Msg to turn LED OFF has been sent via WS...");
    }
});

async function getLedStatus() {
    request = await fetch(statusURL)
        .then((request) => request.json())
        .then((json) => {
            if (json.ledStatus == 1)
                document.querySelector("#ledSwitch").checked = true;
            else
                document.querySelector("#ledSwitch").checked = false;
        });
}


function handleClick(cb) {
      // place holder until GPIO updates can be handled here...
          console.log("Checked value:", cb.checked);
      }
      // create a function to update the date and time
function updateDateTime() {
  // create a new `Date` object
  const now = new Date();

  // get the current date and time as a string
  const currentDateTime = now.toLocaleString();

  // update the `textContent` property of the `span` element with the `id` of `datetime`
  document.querySelector('#datetime').textContent = currentDateTime;
}

function wsPoll() {
    if (hwSocket.readyState !== WebSocket.CLOSED) {
        console.log("polling for temp data...");
        hwSocket.send(2); // This is a request for temp data...
    }
}

// call "updateDateTime on a 1 sec interval and update the span...
setInterval(updateDateTime, 1000);
setInterval(wsPoll, 5000);