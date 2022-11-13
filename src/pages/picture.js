import React, { useMemo, useState } from "react";
import pictureJsonData from '../src/json/picture_index.json'
import { useSearchParams, Link } from 'react-router-dom';

//take in json object of picture data, output array of [[category name, string information], ...] for each applicable category
function formatPictureInformation(data){
  var information_list = [];

  //People
  var people_string = 
  <div style={{whiteSpace: "pre-line"}}>
    {data.names.map( (current_row, index) =>
      <div key={data.filename + "_" + index.toString()}>
        {current_row.map( ( current_person, index2)=>
          <span key={data.filename + "_" + index.toString() + "_" + index2.toString()}>
            <a href={process.env.PUBLIC_URL + '#/person?id=' + data.people[index][index2]}>{current_person}</a>
            {index2 + 1 < data.people[index].length ? ", " : ""}
          </span>
        )}
      </div>
      )}
  </div>;

  if (people_string !== ""){
      information_list.push(["People (Left to Right)", people_string]);
  }

  //Date
  var year = data.date.year;
  var month = data.date.month;
  var day = data.date.day;
  var date_string = (year || "?") + "/" + (month || "?") + "/" + (day || "?");

  if (date_string !== "?/?/?"){
      information_list.push(["Date (Y/M/D)", date_string]);
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

async function formatPictureLabels(image_labels_loc, pictureData){
  const label_data_text = await (await fetch(image_labels_loc)).text();
  
    //loop through the labels to pull out the people locations
    var label_array = [];
    var label_centroids_x = [];
    var label_centroids_y = [];
    label_data_text.split("\n").forEach((current_label) => {
      var current_label_info = current_label.split(" ");
      //check that the label is a person
      if (current_label_info[0] === "0"){
        //add the x/y/w/h to the list
        label_array.push(current_label_info.slice(1, 5).map(x=>parseFloat(x)));
        label_centroids_x.push(parseFloat(current_label_info[1]));
        label_centroids_y.push(parseFloat(current_label_info[2]));
      }
    });
    //loop through the people in the information list, and for each of them, pick out their corresponding label
    //for each row grab however many labels needed starting from the top
    //then grab labels from that set ordered by position from the left
    var label_jsx_list = [];

    pictureData['names'].forEach( (name_row, row_index) =>{

      //make a list of the labels starting from the top
      let cur_label_array = [];
      let cur_label_centroids_x = [];
      for (let i = 0; i < name_row.length; i++){
        if (label_array.length === 0){
          continue;
        }
        let cur_label_index = argMin(label_centroids_y);
        //add to cur_label_array
        cur_label_array.push(label_array[cur_label_index]);
        cur_label_centroids_x.push(label_centroids_x[cur_label_index]);
        //remove from the other arrays
        label_array.splice(cur_label_index, 1);
        label_centroids_x.splice(cur_label_index, 1);
        label_centroids_y.splice(cur_label_index, 1);
      }

      //pull out the people starting from the left
      name_row.forEach( (name, column_index) => {
        if (cur_label_array.length === 0){
          return;
        }
        let cur_label_index = argMin(cur_label_centroids_x);
        //grab x/y/w/h
        let cur_label = cur_label_array[cur_label_index];
        //remove from the arrays
        cur_label_array.splice(cur_label_index, 1);
        cur_label_centroids_x.splice(cur_label_index, 1);

        let style = {
          position: "absolute",
          background: "rgba(255, 255, 255, 0.4)",
          border: "none",
          opacity: "0",
          color: "black", textDecoration: "none",
          display: "flex",flexDirection: "row",justifyContent: "center",alignItems: "center",textAlign: "center",
          left: ((cur_label[0] - cur_label[2] / 2)*50).toFixed(0) + "%",
          top: ((cur_label[1] - cur_label[3] / 2)*100).toFixed(0) + "%",
          width: (cur_label[2]*50).toFixed(0) + "%",
          height: (cur_label[3]*100).toFixed(0) + "%",
        };

        label_jsx_list.push(
          // <button onMouseOver={labelMouseOver} onMouseOut={labelMouseOut} key={"label_" + name} style={style}
          // onClick={"location.href='" + process.env.PUBLIC_URL + '#/person?id=' + pictureData['people'][row_index][column_index]+"'"}>
          //   {name}
          // </button>
          <Link onMouseOver={labelMouseOver} onMouseOut={labelMouseOut} key={"label_" + column_index.toString() + row_index.toString()} 
          style={style} 
          to={{ pathname: '/person', search: "id=" + pictureData['people'][row_index][column_index] }} className="btn btn-primary">
            {name}
          </Link>
        );

      });
    });
    return label_jsx_list;
}

function argMin(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}

function labelMouseOver(event) {
  event.target.style.opacity = "1";
}
function labelMouseOut(event){
  event.target.style.opacity = "0";
}

//main function
export default function Picture() {
  const [labels, setLabels] = useState();
  const [searchParams] = useSearchParams();
  var image_name = searchParams.get('name');

  //grab the image and labels
  var image_loc = process.env.PUBLIC_URL + '/pictures/' + image_name + ".png";
  var image_labels_loc = process.env.PUBLIC_URL + '/pictures/labels/' + image_name + ".txt";

  //go through the json data and pull out the relevant info
  var information_list = [];
  var picture_data = {};
  for (var i = 0; i < pictureJsonData.length; i++) {
    if (pictureJsonData[i]['filename'] === image_name){
        //found the right image data
        picture_data = pictureJsonData[i];
        information_list = formatPictureInformation(picture_data);

    }
  }

  //add the labels
  useMemo(async () => {
    let response = await formatPictureLabels(image_labels_loc, picture_data);
    setLabels(response)
  }, [image_labels_loc, picture_data])

  
  let style = {
    position: "relative"
  };
  return (
    <div>
    <style>{`
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 5px;
      }
    `}</style>
      <div key="image" style={style}>
        <img src={image_loc} width="50%" alt="Not found" />
        {labels}
      </div>
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