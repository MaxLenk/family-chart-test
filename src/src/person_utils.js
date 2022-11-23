import React from "react";
import orderedTreeJsonData from '../src/json/family_tree_ordered.json'
import { Link } from 'react-router-dom';

//take in a person's ID, output a list of jsx elements by category
//e.g. [['father', <a href="link">Dad</a>], ['spouses', <><a>spouse1</a>, <a>spouse2</a></>] ]
export function personRelativesList(person_id)
{
    var output_list = [];
    
    var sibling_id_list = [];

    //parents
    ['Mother', 'Father'].forEach( element =>{
        var cur_id = orderedTreeJsonData[person_id]["rels"][element.toLowerCase()];
        if (cur_id)
        {
            var parent_link = 
                <span key={"parent " + cur_id}>
                    <Link to={{ pathname: '/person', search: "id=" + cur_id }}>
                        {nameFromId(cur_id)}
                    </Link>
                </span>;
            output_list.push([element, parent_link]);

            //add children to list of children if they aren't already in there. Can add logic to differentiate half siblings
            orderedTreeJsonData[cur_id]["rels"]["children"].forEach( element =>{
                if (sibling_id_list.indexOf(element) === -1 && element !== person_id){
                    sibling_id_list.push(element);
                }
            });
        }
    });

    //spouses and children
    ['Spouses', 'Children'].forEach( element =>{
        var cur_ids = orderedTreeJsonData[person_id]["rels"][element.toLowerCase()];
        if (cur_ids)
        {
            var spouses_list = 
                <div key={person_id}>
                    {cur_ids.map( ( current_id, index )=>
                    <span key={person_id + current_id}>
                        <Link to={{ pathname: '/person', search: "id=" + current_id }}>
                            {nameFromId(current_id)}
                        </Link>
                        {index + 1 < cur_ids.length ? ", " : ""}
                    </span>
                    )}
                </div>;
            output_list.push([element, spouses_list]);
        }
    });


    //siblings
    if (sibling_id_list)
    {
        var siblings_list = 
            <div key={person_id}>
                {sibling_id_list.map( ( current_id, index )=>
                <span key={person_id + current_id}>
                    <Link to={{ pathname: '/person', search: "id=" + current_id }}>
                        {nameFromId(current_id)}
                    </Link>
                    {index + 1 < sibling_id_list.length ? ", " : ""}
                </span>
                )}
            </div>;
        output_list.push(['Siblings', siblings_list]);
    }
    

    return output_list;
}

function nameFromId(person_id){
    var name = `${orderedTreeJsonData[person_id]['data']['first name'] || "?"} ${orderedTreeJsonData[person_id]['data']['last name'] || "?"}`;
    return name;
}
