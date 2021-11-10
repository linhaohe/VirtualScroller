import React,{useEffect,useState} from "react";
import {csv} from "d3";
import data from "./data.csv";


function Testing(){
  const [dataObject,setdataObject] = useState();
  useEffect(() => {
    csv(data).then(data=>{
      setdataObject(data);
    })
  }, []);
    console.log(dataObject);
    return <h1> Hello </h1>
}

export default Testing;