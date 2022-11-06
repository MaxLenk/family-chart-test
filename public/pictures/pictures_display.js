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
          var information_table = "<table class=\"noBorder\">";
          for (let j = 0; j < information_list.length; j++){
            information_table += "<tr class=\"noBorder\"><td class=\"noBorder\">" + information_list[j][0] + 
                                 ": </td><td class=\"noBorder\">" + information_list[j][1] + "</td></tr>";
          }
          information_table += "</table>";
          image_data.insertRow();
          image_data.rows[i].insertCell();
          image_data.rows[i].insertCell();
          image_data.rows[i].cells[0].innerHTML = "<a href=\"./picture.html?name=" + data[i]['filename'] + 
                                                                 "\">" + data[i]['filename'] + "</a>";
          image_data.rows[i].cells[1].innerHTML = information_table;    
          image_data.rows[i].className = (i % 2 == 0) ? 'row1' : 'row2';

          // for (let j = 0; j < information_list.length; j++){
          //     image_data.insertRow();
          //     image_data.rows[j + total_row_count].className = (i % 2 == 0) ? 'row1' : 'row2';
          //     image_data.rows[j + total_row_count].insertCell();
          //     image_data.rows[j + total_row_count].insertCell();
          //     image_data.rows[j + total_row_count].cells[0].innerHTML = information_list[j][0] + ": ";
          //     image_data.rows[j + total_row_count].cells[1].innerHTML = information_list[j][1];
          // }
          // image_data.rows[total_row_count].insertCell(0);
          // image_data.rows[total_row_count].cells[0].innerHTML = "<a href=\"./picture.html?name=" + data[i]['filename'] + 
          //                                                       "\">" + data[i]['filename'] + "</a>";
          // image_data.rows[total_row_count].cells[0].setAttribute('rowspan', information_list.length);

          // total_row_count += information_list.length;
      
    }
}

//function to hide rows during search
function filterTable() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("image_data");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < table.rows.length; i++) {
    td = table.rows[i].cells[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        table.rows[i].style.display = "";
      } else {
        table.rows[i].style.display = "none";
      }
    }
  }
}
window.filterTable = filterTable;

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
  