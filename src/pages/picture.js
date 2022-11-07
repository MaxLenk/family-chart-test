import React from "react";
import pictureJsonData from '../src/json/picture_index.json'

//take in json object of picture data, output array of [[category name, string information], ...] for each applicable category
function formatPictureInformation(data){
  var information_list = [];

  //People
  var people_string = "";
  people_string = data.names.map(a => a.join(", ")).join("<br>");

  if (people_string !== ""){
      information_list.push(["People (Left to Right)", people_string]);
  }

  //Date
  var year = data.date.year;
  var month = data.date.month;
  var day = data.date.day;
  var date_string = (year == null ? "?" : year)+ "/" + 
                      (month == null ? "?" : month)+ "/"+ 
                      (day == null ? "?" : day);

  if (date_string !== "?/?/?"){
      information_list.push(["Date", date_string]);
  }

  //Location
  if (data.location !== null){
      information_list.push(["Location", data.location]);
  }
  
  //Additional Info
  if (data["additional info"] !== null){
      information_list.push(["Additional Information", data["additional info"]]);
  }

  return information_list;
}

//get image name
function getQueryString() {
    const [hash, query] = window.location.href. split('#')[1].split('?');
    const params = Object.fromEntries(new URLSearchParams(query));
  
    return params;
}

export default function Picture() {
  var image_name = getQueryString()['name'];
  var image_loc = process.env.PUBLIC_URL + '/pictures/' + image_name + ".png";

  var information_list = [];
  for (var i = 0; i < pictureJsonData.length; i++) {
    if (pictureJsonData[i]['filename'] == image_name){
        //found the right image data
        information_list = formatPictureInformation(pictureJsonData[i]);
        console.log(information_list);
    }
  }
  return (
    <div>
    <img src={image_loc} width="50%" />
    <table>
      <thead>
      </thead>
      <tbody>
      {information_list.map((information_row, index) => (
          <tr key={index}>
              <td>{information_row[0]}</td>
              <td>{information_row[1]}</td>
          </tr>
      ))}
      </tbody>
    </table>
    </div>
  );
}