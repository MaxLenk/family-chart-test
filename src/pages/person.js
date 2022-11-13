import React from "react";
import treeJsonData from '../src/json/family_tree.json'
import pictureJsonData from '../src/json/picture_index.json'
import '../src/person_utils'
import { personRelativesList } from "../src/person_utils";
import { useSearchParams, Link } from 'react-router-dom';

//take in json object of picture data, output array of [[category name, string information], ...] for each applicable category
function formatPersonInformation(data){
  const italic_style = {
    fontStyle: 'italic'
  };
  
  var information_list = [];

  //Name info
  var name = 
  <>
    {(data["data"]["first name"] || "?") + " "}
    {data["data"]["nickname"] ? '"' + data["data"]["nickname"] + '" ' : ""}
    {data["data"]["last name"] || "?"}
    <span style={italic_style}>{data["data"]["nee"] ? " (nee " + data["data"]["nee"] + ")" : ""}</span>
  </>;
  information_list.push(["Name", name]);

  var personal_data_list = ["Birthday", "Birthplace", "Deathplace", "Other info", "Gender"];

  personal_data_list.forEach(element => {
    if (data["data"][element.toLowerCase()]){
      information_list.push([element, data["data"][element.toLowerCase()]]);
    }
  });

  var relatives_list = personRelativesList(data['id']);
  information_list = information_list.concat(relatives_list);

  return information_list;
}

function getPersonPictures(person_id){
  var pictures_jsx = [];
  pictureJsonData.forEach( pictureJson => {
    if (pictureJson['people'].some(row => row.includes(person_id))){
      var image_loc = process.env.PUBLIC_URL + '/pictures/' + pictureJson['filename'] + ".png";

      pictures_jsx.push(
        <Link key={"pic_" + pictureJson['filename']} 
          to={{ pathname: '/picture', search: "name=" + pictureJson['filename'] }}>
            <img src={image_loc} width="100px" alt="Not found" />
        </Link>
      );
    }
  });

  return pictures_jsx;
}

export default function Person() {
  const [searchParams] = useSearchParams();
  var person_id = searchParams.get('id');

  //format the person's information
  var information_list = [];
  for (var i = 0; i < treeJsonData.length; i++) {
    if (treeJsonData[i]['id'] === person_id){
        //found the right image data
        information_list = formatPersonInformation(treeJsonData[i]);
    }
  }
  if (information_list.length === 0){
    return <div>Person was not found</div>
  }

  //get a list of all pictures the person is in
  var pictures_jsx = getPersonPictures(person_id);

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
    <br/>Pictures:<br/>
    {pictures_jsx}
    </div>
  );
}