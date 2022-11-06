//get person id
function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;
  
    while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
  
    return result;
}

//put person information in table
function parseData(data) {
    // grab and show image data
    var id = getQueryString()['id'];
    var person_data = document.getElementById("person_data");
    for (var i = 0; i < data.length; i++) {
        if (data[i]['id'] == id){
            //found the right image data
            person_data.insertRow();
            person_data.rows[0].insertCell();
            person_data.rows[0].cells[0].innerHTML = data[i]['first name'] + data[i]['last name'];
            // var information_list = formatPictureInformation(data[i]);
            
            // for (let i = 0; i < information_list.length; i++){
            //   person_data.insertRow();
            //   person_data.rows[i].insertCell(0);
            //   person_data.rows[i].insertCell(1);
            //   person_data.rows[i].cells[0].innerHTML = information_list[i][0] + ": ";
            //   person_data.rows[i].cells[1].innerHTML = information_list[i][1];
            // }
        }
    }
}

//grab and parse relevant data, runs on load
fetch(window.location.origin + '/src/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log("test");

    parseData(data);
  })
  .catch(function (err) {
    console.log(err);
  });
  