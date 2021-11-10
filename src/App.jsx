import React from 'react';
import VirtualScroller from './components/virualScroller';
import Testing from './components/testing';
// min: the starting index
// max: the ending index
// start: the inital postion to display
// itemHeight: the height of each row that displays
// amount: the amount that display at a time
// tolerance: the view point's outlet
const SETTINGS = {
    min:1,
    max:100,
    start:1,
    itemHeight:20,
    amount:5,
    tolerance:2
}

const rowTemplate = (item) =>(
    <div className="item" key = {item.index}>{item.text} </div>
)

const getData = (offset,limit) =>{
    const data = [];

    //the default starting index is in setting comparing with offset determins the begging index of the scroller
    const start = Math.max(SETTINGS.min,offset);
    
    //determing where to end offset + limit - 1 will give me the ending index of scroller as long as is not out of bound
    const end = Math.min(offset + limit ,SETTINGS.max);

    //check if the index are valid
    if(start <= end){
        //push all rows into array
        for(let i = start; i<end; i++){
            //each index were cast into a JSON object then push into data
            data.push({index:i,text:`item ${i}`});
        }
    }
    return data;
}
function App(){
    //  return <VirtualScroller settings={SETTINGS} data={getData} row={rowTemplate}/>
    return <Testing/>
}

export default App;