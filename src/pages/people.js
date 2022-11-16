import React, { useMemo } from "react";
import { useTable } from "react-table";
import treeJsonData from '../src/json/family_tree.json'
import '../src/person_utils'

function processData(jsonData) {
  const result = Object.keys(jsonData).map((key) => { 
    return jsonData[key];
  });
  return result;
}

const italic_style = {
  fontStyle: 'italic'
};

export default function People() {
    const columns = useMemo(
        () => [
          {
            Header: "Avatar",
            accessor: d => <img src={
                              process.env.PUBLIC_URL + '/pictures/thumbnails/' + d['data']['avatar'] + ".png"
                              } width="100px" alt="" />
          },
          {
            Header: "Name",
            accessor: d => <a href = {process.env.PUBLIC_URL + '#/person?id=' + d.id}>
              {(d["data"]["first name"] || "?") + " "}
              {d["data"]["nickname"] ? '"' + d["data"]["nickname"] + '" ' : ""}
              {d["data"]["last name"] || "?"}
              <span style={italic_style}>{d["data"]["nee"] ? " (nee " + d["data"]["nee"] + ")" : ""}</span>
            </a>
          },
          {
            Header: "Birthday",
            accessor: d => d['data']['birthday']
          },
          {
            Header: "Birthplace",
            accessor: d => d['data']['birthplace']
          },
          {
            Header: "Deathplace",
            accessor: d => d['data']['deathplace']
          },
          {
            Header: "Gender",
            accessor: d => d['data']['gender']
          },
          {
            Header: "Additional Information",
            accessor: d => d['data']['other info']
          },
        ],
        []
      );


      const [search, setSearch] = React.useState('');

      const handleSearch = (event) => {
        setSearch(event.target.value);
      };

      const processedTreeJsonData = processData(treeJsonData);
      
      const data = React.useMemo(
        () =>
          processedTreeJsonData.filter((person) => {
            return ((person['data']['first name'] + " " + person['data']['last name']).toLowerCase().includes(search.toLowerCase()) ||
                    (person['data']['first name'] + " " + person['data']['nee']).toLowerCase().includes(search.toLowerCase()) ||
                    (person['data']['nickname'] + " " + person['data']['last name']).toLowerCase().includes(search.toLowerCase()) ||
                    (person['data']['nickname'] + " " + person['data']['nee']).toLowerCase().includes(search.toLowerCase())
                    );
          }),
        [search, processedTreeJsonData]
      );
    

      const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
      } = useTable({
        columns,
        data
      });

    
      return (
        <>
        <style>{`
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 5px;
          }
        `}</style>

          <label style={{margin: "20px 0px 20px 0px", display: "inline-block"}} htmlFor="search">
            Search People:{' '}
            <input id="search" type="text" onChange={handleSearch} />
          </label>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      );
};