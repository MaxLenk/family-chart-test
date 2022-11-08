import React from "react";
import treeJsonData from '../src/json/family_tree.json'

//take in json object of picture data, output array of [[category name, string information], ...] for each applicable category
function formatPersonInformation(data){
  var information_list = [];

  //Name info
  var name = "";
  name += (data["data"]["first name"] || "?") + " ";
  name += data["data"]["nickname"] ? '"' + data["data"]["nickname"] + '" ' : "";
  name += data["data"]["last name"] || "?";
  name += data["data"]["nee"] ? " (nee " + data["data"]["nee"] + ")" : "";
  information_list.push(["Name", name]);

  var personal_data_list = ["Birthday", "Birthplace", "Deathplace", "Other info", "Gender"];

  personal_data_list.forEach(element => {
    if (data["data"][element.toLowerCase()]){
      information_list.push([element, data["data"][element.toLowerCase()]]);
    }
  });

  return information_list;
}

//get image name
function getQueryString() {
    const [hash, query] = window.location.href. split('#')[1].split('?');
    const params = Object.fromEntries(new URLSearchParams(query));
  
    return params;
}

export default function Person() {
  var person_id = getQueryString()['id'];

  var information_list = [];
  for (var i = 0; i < treeJsonData.length; i++) {
    if (treeJsonData[i]['id'] == person_id){
        //found the right image data
        information_list = formatPersonInformation(treeJsonData[i]);
    }
  }
  return (
    <div>
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