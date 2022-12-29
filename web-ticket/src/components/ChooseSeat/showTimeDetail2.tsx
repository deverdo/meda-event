import { Row, Col, Typography, Space, Radio, Form, InputNumber } from "antd";
import dayjs from "dayjs";
import React from "react";
import { SeatType } from "../../constants/setType";
interface Props {
  showtime: any;
  currentHall: string;
  setCurrentHall: Function;
  setNumberOfTickets:Function;
}

const seatOptions = [
  { label: "Regular", value: SeatType.Regular },
  { label: "VIP", value: SeatType.Vip },
];


function Summary({
  showtime,
  currentHall,
  setCurrentHall,
  setNumberOfTickets
}: Props) {

  const flexer:React.CSSProperties = {
    display: "flex",
    flexDirection:"column"
  }
  return (

    <Row>

        <div
          style = {flexer}
        >
          <Typography.Text strong style={regularTextStyle}>
            {"Event"}
          </Typography.Text>
          <Typography.Text style={{ ...regularTextStyle, marginBottom: 5 }}>
            {showtime?.EventSchedule?.event?.title}
          </Typography.Text>

        </div>



    </Row>


  )

}
export default function ShowtimeDetail2({
  showtime,
  currentHall,
  setCurrentHall,
  setNumberOfTickets
}: Props) {

  return (
    
    <Summary 
      showtime={showtime}
      currentHall={currentHall}
      setCurrentHall={setCurrentHall}
      setNumberOfTickets={setNumberOfTickets}
    />

    

  )
}


function PrevContent({
  showtime,
  currentHall,
  setCurrentHall,
  setNumberOfTickets
}: Props) {

  return (
    <Row>
    <Col flex={1} style={{ flexDirection: "column", display: "flex" }}>
      <Typography.Text strong style={regularTextStyle}>
        {"Event"}
      </Typography.Text>
      <Typography.Text style={{ ...regularTextStyle, marginBottom: 5 }}>
        {showtime?.EventSchedule?.event?.title}
      </Typography.Text>
      <div style={{

        display:"flex",

        flexDirection:"column"

      }}>


        <Typography.Text
          strong
          style={regularTextStyle}
        >
          {"Number of tickets"}
        </Typography.Text>
        
        <InputNumber 
          onChange={e => setNumberOfTickets(e)}
          defaultValue={1}
          min={1}
          />
      
      </div>
      <Col flex={1} style={{ flexDirection: "column", display: "flex" }}>
        <Typography.Text strong style={{ ...regularTextStyle }}>
          {"Showtime"}
        </Typography.Text>
        <Space direction="horizontal">
          <Typography.Text
            style={{
              ...regularTextStyle,
              padding: "5px 10px",
              borderRadius: 5,
              border: "1px solid #c3cad2",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {`${dayjs(showtime?.EventSchedule?.date).format(
              "dddd"
            )}, ${dayjs(showtime?.EventSchedule?.date).format(
              "DD"
            )}`.toUpperCase()}
          </Typography.Text>
          <Typography.Text
            style={{
              ...regularTextStyle,
              padding: "5px 10px",
              borderRadius: 5,
              fontSize: 14,
              border: "1px solid #c3cad2",
            }}
          >
            {dayjs(showtime?.time).format("h:mm A")}
          </Typography.Text>
        </Space>
      </Col>
    </Col>
    <Col flex={1} style={{ flexDirection: "column", display: "flex",marginTop:10   }}>
      <Typography.Text strong style={regularTextStyle}>
        {"Venue"}
      </Typography.Text>
      <Typography.Text style={{ ...regularTextStyle }}>
        {showtime?.eventHall?.name}
      </Typography.Text>
      <Col flex={1} style={{ flexDirection: "column", display: "flex" }}>
        <Typography.Text strong style={{ ...regularTextStyle }}>
          {"Seat Type"}
        </Typography.Text>
        <div>
          <Radio.Group
            // options={seatOptions}
            onChange={(e) => {
              setCurrentHall(e.target.value);
            }}
            value={currentHall}
            optionType="default"
            buttonStyle="solid"
          >
            <Radio.Button
              style={{
                borderTopLeftRadius: "5px",
                borderBottomLeftRadius: "5px",
              }}
              value={seatOptions[0].value}
            >
              {seatOptions[0].label}
            </Radio.Button>
            {/* <Radio.Button
              style={{
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
              }}
              value={seatOptions[1].value}
            >
              {seatOptions[1].label}
            </Radio.Button> */}
          </Radio.Group>
          <Row>



          </Row>
        </div>
      </Col>
    </Col>
  </Row>
);

}
const regularTextStyle = {
  marginRight: 10,
  marginBottom: 5,
  fontSize: 16,
};
