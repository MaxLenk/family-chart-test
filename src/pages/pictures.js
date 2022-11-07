import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import pictureJsonData from '../src/json/picture_index.json'

function processData(jsonData) {
  const result = Object.keys(jsonData).map((key) => { 
    return jsonData[key];
  });
  return result;
}

const Names = ({ values }) => {
  return (
    <div style={{whiteSpace: "pre-line"}}>
      {values.map( function( item ){ return item.join( ", " )  } ).join("\n")}
    </div>
  );
};

export default function Pictures() {
    const columns = useMemo(
        () => [
          {
            Header: "Filename",
            accessor: d => <a href = {process.env.PUBLIC_URL + '/picture?name=' + d.filename}>{d.filename}</a>
          },
          {
            Header: "Date",
            accessor: d => `${d.date.year || "?"}/${d.date.month || "?"}/${d.date.day || "?"}`
          },
          {
            Header: "Location",
            accessor: "location"
          },
          {
            Header: "People",
            accessor: "names",
            // Cell method will provide the cell value; we pass it to render a custom component
            Cell: ({ cell: { value } }) => <Names values={value} />
          },
          {
            Header: "Additional Information",
            accessor: "additional info"
          },
        ],
        []
      );


      const [search, setSearch] = React.useState('');

      const handleSearch = (event) => {
        setSearch(event.target.value);
      };

      const processedPictureJsonData = processData(pictureJsonData);
      // const data = React.useMemo(() => processedPictureJsonData, []);
      const data = React.useMemo(
        () =>
          processedPictureJsonData.filter((picture) => {
            console.log('Filter function is running ...');
            return picture.names.join().toLowerCase().includes(search.toLowerCase());
          }),
        [search]
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
          <label htmlFor="search">
            Search People: 
            <input id="search" type="text" onChange={handleSearch} />
          </label>
          <table {...getTableProps()} border="collapse">
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