import formatPictureInformation from "./picture_tools.js";

//get image name
function getQueryString() {
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;
  
    while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
  
    return result;
}

//put picture information in table
function appendData(data) {
    // grab and show image data
    var name = getQueryString()['name'];
    var image_data = document.getElementById("image_data");

    var total_row_count = 0;
    for (var i = 0; i < data.length; i++) {
          //for each image data, make a row in the table
          var information_list = formatPictureInformation(data[i]);
          
          for (let j = 0; j < information_list.length; j++){
              image_data.insertRow();
              image_data.rows[j + total_row_count].className = (i % 2 == 0) ? 'row1' : 'row2';
              image_data.rows[j + total_row_count].insertCell();
              image_data.rows[j + total_row_count].insertCell();
              image_data.rows[j + total_row_count].cells[0].innerHTML = information_list[j][0] + ": ";
              image_data.rows[j + total_row_count].cells[1].innerHTML = information_list[j][1];
          }
          image_data.rows[total_row_count].insertCell(0);
          image_data.rows[total_row_count].cells[0].innerHTML = "<a href=\"/picture.html?name=" + data[i]['filename'] + 
                                                                "\">" + data[i]['filename'] + "</a>";
          image_data.rows[total_row_count].cells[0].setAttribute('rowspan', information_list.length);

          total_row_count += information_list.length;
      
    }
}

//grab and parse relevant data, runs on load
fetch('pictures/picture_index.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    appendData(data);
  })
  .catch(function (err) {
    console.log(err);
  });
  