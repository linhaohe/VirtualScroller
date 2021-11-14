import React, { useEffect, useState } from "react";
import VirtualScroller from "./components/VirtualScroller";
import { csv } from "d3";
import csvdata from "./components/data.csv";
import './index.css';

const SETTINGS = {
  //height of each box
  itemHeight: 97,
  //width of each box
  itemWidth: 97,
  //the extra amount that were load in
  tolerance: 5,
  //where you want to start
  //the amount of row to be display
  maxRow: 20,
  //index to start
  startIndex: 0,
  amount: 17
};

//construct the columns of each row
const rowTemplate2D = (row, rowIndex) => {
  var indents = [];
  for (let i = 0; i < row.length; i++) {
    indents.push(<td key={`${rowIndex}` + `${i}`}><div className="textBox" style={{ height: SETTINGS.itemHeight, width: SETTINGS.itemWidth }}>{row[i]}</div></td>);
  }
  return indents;
}

//Consturct the entire table as a 2D array
const template2D = (item) => {
  var indents = [];
  indents = item.map((target, index) => (
    <tr key={index} style={{ height: SETTINGS.itemHeight }}>
      {rowTemplate2D(target, index)}
    </tr>
  ))

  return <>{indents}</>;
}

//Get the data that is specify my the function caller 
const getDataCSV = (offsetX, limitX, dataObject) => {
  if (typeof dataObject === "undefined") {
    return [];
  }
  const data = [];
  const startX = Math.max(0, offsetX);
  const endX = Math.min(offsetX + limitX - 1, dataObject[0].length);

  if (startX <= endX) {
    for (let i = 0; i < SETTINGS.maxRow; i++) {
      data[i] = [];
      for (let j = startX; j < endX; j++) {
        data[i][j - startX] = dataObject[i][j];
      }
    }
  }
  return data;
}


function App() {
  const [dataObject, setdataObject] = useState();
  //Get the data from the local CSV files
  useEffect(async () => {
    await csv(csvdata).then(data => {
      //Put them into a 2D array where each row is the row and colum is the field
      let data2D = data.map(tag => Object.values(tag));
      setdataObject(data2D);
    })
  }, []);

  //handle is cause where data retrive is null
  if (!dataObject) {
    return <p>Loading ...</p>;
  }
  return <VirtualScroller get={getDataCSV} dataObject={dataObject} settings={SETTINGS} template={template2D} />

}

export default App;