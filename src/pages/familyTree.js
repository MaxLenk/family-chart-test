import React from "react";
import { useSearchParams } from 'react-router-dom';
import FamilyChart from "../src/FamilyChart";
  
const FamilyTree = () => {

    const [searchParams] = useSearchParams();
    var person_id = searchParams.get('id');

    return (
        <div className="App">
          <FamilyChart person_id={person_id} />
        </div>
      );
};
  
export default FamilyTree;