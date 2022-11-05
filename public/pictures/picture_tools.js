
//take in json object of picture data, output array of [[category name, string information], ...] for each applicable category
function formatPictureInformation(data){
    var information_list = [];

    //People
    var people_string = "";
    people_string = data.names.map(a => a.join(", ")).join("<br>");

    if (people_string != ""){
        information_list.push(["People", people_string]);
    }

    //Date
    var year = data.date.year;
    var month = data.date.month;
    var day = data.date.day;
    var date_string = (year == null ? "?" : year)+ "/" + 
                        (month == null ? "?" : month)+ "/"+ 
                        (day == null ? "?" : day);

    if (date_string != "?/?/?"){
        information_list.push(["Date", date_string]);
    }

    //Location
    if (data.location != null){
        information_list.push(["Location", data.location]);
    }
    
    //Additional Info
    if (data["additional info"] != null){
        information_list.push(["Additional Information", data["additional info"]]);
    }

    return information_list;
}

export default formatPictureInformation;