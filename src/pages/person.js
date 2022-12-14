import React from "react";
import treeJsonData from '../src/json/family_tree.json'
import pictureJsonData from '../src/json/picture_index.json'
import '../src/person_utils'
import { personRelativesList } from "../src/person_utils";
import { useSearchParams, Link } from 'react-router-dom';

//take in json object of person data, output array of [[category name, string information], ...] for each applicable category
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
            <img src={image_loc} width="150px" alt="Not found" />
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
  var avatar_loc = "";
  for (var i = 0; i < treeJsonData.length; i++) {
    if (treeJsonData[i]['id'] === person_id){
        //found the right image data
        information_list = formatPersonInformation(treeJsonData[i]);

        //get the avatar pic
        avatar_loc = process.env.PUBLIC_URL + '/pictures/thumbnails/' + treeJsonData[i]['data']['avatar'] + ".png";
    }
  }
  if (information_list.length === 0){
    return <div>Person was not found</div>
  }

  //get a list of all pictures the person is in
  var pictures_jsx = getPersonPictures(person_id);

  return (
    <div>
    <style>{`
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 5px;
      }
    `}</style>
    <img src={avatar_loc} width="30%" alt="Avatar not found" />
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
    <br/><a href={process.env.PUBLIC_URL + "#/family-tree?id=" + person_id}>Link to position on family tree</a><br/>
    <br/>Pictures:<br/>
    {pictures_jsx}
    </div>
  );
}