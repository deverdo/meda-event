import React from "react";
import styles from "./showtime.select.module.css";
import { ClockCircleOutlined } from "@ant-design/icons";
import colors from "../../constants/colors";
import { Typography } from "antd";
interface Props {
  value: string;
  disabled?: boolean;
  select: Function;
  selected: boolean;
  timeCinema:string;
  // movieType:string;
}
export default function ShowtimeSelectButton({value,select,selected,disabled=false,timeCinema}:Props) {
  return (
    <Typography.Text
    style={{ 
      marginRight: 10, 
      
      marginBottom: 5,
      
      fontSize:13
    
    }}
  >
    {timeCinema}
  </Typography.Text>
  );
}


/*
  prev showtimeSelectButton comp content

   <div
    onClick={()=>{
        select(value);
    }}
      className={styles["button-container"]}
      style={{
        ...(selected ? { borderColor: colors.PRIMARY, color: "black" } : {}),
        ...(disabled ? { backgroundColor: "grey" } : {}),
        height: 10
    }}
    >
      <div style={{ minWidth: 150 ,height:10}}>
        <ClockCircleOutlined /> {timeCinema}
      </div>
      <div style={{ padding: "0px 10px" }}>{movieType}</div> 
      </div>


*/