import { ConsoleSqlOutlined } from "@ant-design/icons";
import { Card, Col, InputNumber, Row, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import "./confirmOrder.css";
import styles from "../../routes/ChooseShowtime/schedule.module.css";
const HorizontalLine = () => {
  return (
    <div
      style={{
        height: "2px",
        margin: "auto",
        width: "80%",
        marginBlock: "10px",
        backgroundColor: "#C4C9DF",
      }}
    />
  );
};


let Cont:React.CSSProperties = {


  display:"grid",

  gridTemplateColumns:"repeat(12,1fr)",

  gap:5,

  alignItems:"center",

  marginTop:20,

  marginBottom:10

}

let fieldCont:React.CSSProperties = {
                           
  marginBottom: 0,
  
  fontSize: 14,

  gridColumnStart:2,

  gridColumnEnd:6,

  fontWeight:"20px"
}

let valueCont:React.CSSProperties = {
                            
  marginBottom: 0,

  fontSize: 12,
  
  gridColumnStart:6,

  gridColumnEnd:12
  
}

let HeaderCont:React.CSSProperties = {

  display:"grid",

  gridTemplateColumns:"repeat(12,1fr)",

  gap:5,

  alignItems:"center",

  marginBottom:10,

  backgroundColor: "rgb(231, 242, 255)",

  height:"70px"

}


let HeaderText:React.CSSProperties = {

  marginBottom: 0,
  fontSize: 17,
  gridColumnStart:2,

  gridColumnEnd:12

}


function ConfirmOrder({ onConfirm, onCloseModal, data, paymentInfo }: any) {
  // Event Title
  // Time and date
  // Venue
  // Seats and  Number of Seats
  // customer
  // phone number
  // Total price

  console.log(`----------------------------- in confirm order-----------------`)

  console.log(data)

  const eventTitle = data?.EventSchedule?.event?.title;
  const venue = data?.eventHall?.name;
  const date = data?.date;
  const time = data?.time;
  const { numberOfTickets, user , setNumberOfTickets ,totalPrice , setTotalPrice} = paymentInfo;
  //const totalPrice = data?.totalPrice
 
  const singlePrice = data?.EventSchedule?.regularTicketPrice;
  //const [totalPrice,setTotalPrice] = useState(singlePrice * numberOfTickets)
  useEffect(() => console.log(), []);

  return (
   
        <div className="confirm-container" style={{
        

        }}>
          <div className="details" style={{

            display:"grid",

            gridTemplateColumns:"repeat(1fr)",

            overflow: "hidden",

            paddingBottom:20,

          

          }}>

            

                <div
                  style={HeaderCont}
                >
                
                    <Typography.Text
                                
                                strong

                                style={HeaderText}
                              >
                                {"Confirm your order before payment"}
                    </Typography.Text>
                      
                </div>



            
            <div>


            <div style={Cont}>


                
                <Typography.Text
                              strong
                              style={fieldCont}
                            >
                              {"Event"}
                  </Typography.Text>
                  <Typography.Text
                              strong
                              style={valueCont}
                            >
                            {eventTitle}
                  </Typography.Text>
                
                

                  
              </div>

              


             

            <div style={Cont}>

            <Typography.Text
                          strong
                          style={fieldCont}
                        >
                          {"Time & Date"}
              </Typography.Text>
              <Typography.Text
                          strong
                          style={valueCont}
                        >
                        {date}  {time}
              </Typography.Text>
            
            
            </div>

              
              

              <div style={Cont}>

                      <Typography.Text
                                strong
                                style={fieldCont}
                              >
                                {"Venue"}
                      </Typography.Text>
                    
                      <a
                        href="https://bit.ly/3LAhxLN"
                       
                        target="_blank"
                        rel="noreferrer"

                        style={valueCont}
                      >
                        <Typography.Text
                               strong
                                style={{
                                    marginBottom: 0,
                                    fontSize: 12,
                                    
                                    
                                  }}
                              >
                                {venue}
                      </Typography.Text>
                      </a>
                    

              </div>


              <HorizontalLine />

              <div  style={Cont}>

                       
                

                <Typography.Text
                              strong
                              style={fieldCont}
                            >
                              {"Customer"}
                  </Typography.Text>
                  <Typography.Text
                              strong
                              style={valueCont}
                            >
                            {user?.firstName} {user?.lastName}
                  </Typography.Text>
                
                
                </div>

              </div>

              <div  style={Cont}>

              

                <Typography.Text
                              strong
                              style={fieldCont}
                            >
                              {"Phone"}
                  </Typography.Text>
                  <Typography.Text
                              strong
                              style={valueCont}
                            >
                            {user?.phoneNumber}
                  </Typography.Text>
                
                
                </div>

                
              
              

              <div style={Cont}>
                 

                  <Typography.Text
                                strong
                                style={fieldCont}
                              >
                                {"Single Ticket Price"}
                    </Typography.Text>
                    <Typography.Text
                                strong
                                style={valueCont}
                              >
                              {singlePrice} Birr
                    </Typography.Text>
                  
                  
               


              </div>

              
              <div  style={Cont}>

                 
                  <Typography.Text
                                strong
                                style={fieldCont}
                              >
                                {"Number of Tickets"}
                    </Typography.Text>
                    <InputNumber
                        style={valueCont}
                        defaultValue={numberOfTickets} 
                        min={1} 
                        onChange={(e:any) => {
                          
                          console.log(singlePrice)
                          console.log(numberOfTickets)
                          //paymentInfo.setTotalPrice(singlePrice * numberOfTickets)
                          setNumberOfTickets(e)
                          setTotalPrice(singlePrice * e)
                          //setTotalPrice(singlePrice * numberOfTickets)
                          
                        
                      }}/>
                  
                  


              </div>

              <HorizontalLine />
              <div  style={Cont}>


                 

                  <Typography.Text
                                strong
                                style={fieldCont}
                              >
                                {"Total Price"}
                    </Typography.Text>
                    <Typography.Text
                               strong
                                style={valueCont}
                              >
                              {totalPrice} Birr
                    </Typography.Text>
                  
                  
                  

              </div>

              <div>



              <div onClick={onConfirm} className="payButton">
                  <div
                    style={{
                      flex: 1,
                      textAlign: "end",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >

                  <Typography.Text style={{

                  fontSize:12,

                  color:"white",

                      display:"flex",

                      flexDirection:"row",

                      alignItems:"center",

                      justifyContent:"center",

                      marginRight:2

                  }}>

                        {numberOfTickets} Ticket(s) | {totalPrice} Birr

                  </Typography.Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                      backgroundColor: "#FFEC00",
                      border: "none",
                      borderRadius: "3px",
                      height: "35px",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    Pay
                  </div>

                </div>
                  <button
                  onClick={() => onCloseModal(false)}
                  style={{
                    border: "none",
                    margin: "auto",
                    color: "#FF5858",
                    display: "block",
                    marginTop: "20px",
                    fontWeight: "600",
                    backgroundColor: "transparent",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

              </div>
              </div>

                </div>

              
         
          
            
  );
}

export default ConfirmOrder;




















