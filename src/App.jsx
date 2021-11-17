import React, { useEffect, useState } from "react";
import VirtualScroller from "./components/VirtualScroller";
import { csv } from "d3";
import csvdata from "./components/data.csv";
import './index.css';

var SETTINGS = {
  //height of each box
  itemHeight: 24,
  //min Width
  minWidth: 97,
  //width given to each character
  itemWidth: 9,
  //the extra amount that were load in
  tolerance: 5,
  //the amount of row to be display
  maxRow: 20,
  //index to start
  startIndex: 0,
  amount: 17
};

//construct the columns of each row
const rowTemplate2D = (row, rowIndex) => {
  let indents = [];
  
  for (let i = 0; i < row.length; i++) {
    let width = row[i].length *SETTINGS.itemWidth;
    width = width > SETTINGS.minWidth ? width:SETTINGS.minWidth;
    indents.push(<td key={`${rowIndex}` + `${i}`}><div className="textBox" style={{ height: SETTINGS.itemHeight, width: width }}>{row[i]}</div></td>);
  }
  return indents;
}

const headerTemplate = (item) =>{
  if(typeof item === 'undefined'){
    return <tr></tr>
  }
  return <tr key='0'>{item.map(target => <th key={`${target}`}>
    <div className="textBox" style={{ height: SETTINGS.itemHeight  }}>{target}</div>
  </th>)}</tr>
}
//Consturct the entire table as a 2D array
const template2D = (item) => {
  var indents = [];
    for(let i=1; i< item.length; i++){
      indents.push(<tr key={i} style={{ height: SETTINGS.itemHeight }}>
        {rowTemplate2D(item[i], i)}
      </tr>)
    }
  return <table>
            <thead>
              {headerTemplate(item[0])}
            </thead>
            <tbody>
              {indents}
            </tbody>
         </table>;
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

const getTotalWidth = (item) =>{
  let totalWidth = 0;
  for(let i=0; i<item.length; i++){
    let itemWidth = item[i].length * SETTINGS.itemWidth;
      if(itemWidth < SETTINGS.minWidth){
        itemWidth = SETTINGS.minWidth;
      }
    totalWidth = totalWidth + itemWidth;
  }
  return totalWidth;
}

function App() {
  const [dataObject, setdataObject] = useState();
  //Get the data from the local CSV files
  useEffect(() => {
    csv(csvdata).then(data => {
      //Put them into a 2D array where each row is the row and colum is the field
      let data2D = data.map(tag => Object.values(tag));
      data2D.unshift(data.columns);
      setdataObject(data2D);
    })
  }, []);

  //handle is cause where data retrive is null
  if (!dataObject) {
    return <p>Loading ...</p>;
  }
  let totalWidth = getTotalWidth(dataObject[0]);
  SETTINGS = {...SETTINGS,
              totalWidth:totalWidth,
              avergeWidth:Math.floor(totalWidth/dataObject.length)
            }
  
              console.log(dataObject[0].length)
  return <VirtualScroller get={getDataCSV} dataObject={dataObject} settings={SETTINGS} template={template2D} />

}

export default App;