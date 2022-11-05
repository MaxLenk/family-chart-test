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

//display image
function show_image() {
    // grab and show image
    var name = getQueryString()['name'];
    var img = document.getElementById("image");
    img.src = 'pictures/pictures/' + name + '.jpg';
    img.height = 400;
    img.alt = 'picture not found';

}

//put picture information in table
function appendData(data) {
    // grab and show image data
    var name = getQueryString()['name'];
    var image_data = document.getElementById("image_data");
    for (var i = 0; i < data.length; i++) {
        if (data[i]['filename'] == name){
            //found the right image data
            var information_list = formatPictureInformation(data[i]);
            
            for (let i = 0; i < information_list.length; i++){
                image_data.insertRow();
                image_data.rows[i].insertCell(0);
                image_data.rows[i].insertCell(1);
                image_data.rows[i].cells[0].innerHTML = information_list[i][0] + ": ";
                image_data.rows[i].cells[1].innerHTML = information_list[i][1];
            }
        }
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

//grab and show image, runs on load
window.onload = function() {
    show_image();
};
  