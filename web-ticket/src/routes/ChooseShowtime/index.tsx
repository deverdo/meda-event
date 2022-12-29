import {
  Breadcrumb,
  Button,
  Col,
  Input,
  message,
  Rate,
  Row,
  Space,
  Tag,
  Typography,
  Card,
} from "antd";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import React, { useEffect, useState } from "react";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ImageCard from "../../components/chooseShowtime/imageCard";
import Header from "../../components/global/header";
import useOnFetch from "../../hooks/useOnFetch";
import { buyTicket, buyTicketWitoutSeat, getScheduleById } from "../../utils/http_calls";
import styles from "./schedule.module.css";
import { ClockCircleOutlined, StarOutlined } from "@ant-design/icons";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import ShowtimeSelectButton from "../../components/chooseShowtime/showtimeSelectButton";
import dayjs from "dayjs";
import MoviesPreviewScroll from "../../components/global/moviesPreviewScroll";
import ChooseShowtimeSkeleton from "./chooseShowtimeSkeleton";
import { useAuth } from "../../context/authContext";
import RelatedEventsPreview from "../../components/global/relatedEventsPreview";
import ConfirmOrder2 from "../../components/ChooseSeat/ConfirmOrder2";
import useQuery from "../../hooks/useQuery";
import axios from "axios";

export default function ChooseShowtime() {
  const { Meta } = Card;
  let { id } = useParams();
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const [schedule, setSchedule] = useState<any>();
  const navigate = useNavigate();
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
  // const [phone, setPhone] = useState("");
  const { currentUser, loading, toggleAuthModal, authModalProps } = useAuth();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [modalVisible,setModalVisible] = useState(false)
  const query = useQuery();
  const [buyLoading, setBuyLoading] = useState(false);
  const [showTime,setShowtime] = useState([]);
  const [numberOfTickets,setNumberOfTickets] = useState(1);
  //let totalPrice = 1;
  const [dataObj,setDataObj] = useState({})
  const [totalPrice,setTotalPrice] = useState(0)
  
  async function loadData() {
    await onFetch(async () => await getScheduleById(id), {
      errorCallback: (error: any) => {
        message.error(`${error}`);
        navigate("/404", { replace: true });
      },
      onSuccessCallback: (data: any) => {
        setSchedule(data);
        console.log("------------------ in choose show time---------------")
        console.log(`Show time id ${data?.showTimes[0]?.id}`)
        setShowtime(data?.showTimes[0]?.id)
        console.log(data)
        setTotalPrice(data?.regularTicketPrice * numberOfTickets)
        //totalPrice = data?.regularTicketPrice * numberOfTickets
        console.log(`------------------total price ${totalPrice} -----------------------`)
        let date = new Date(data?.date).toDateString()
        let time = new Date(data?.showTimes[0]?.time).toLocaleTimeString()
        setDataObj(

          {
            EventSchedule: {
              event: {
                title: data?.event?.title
              },
              regularTicketPrice:data?.regularTicketPrice
            },
            eventHall: {
              name:data?.showTimes[0]?.eventHall?.name
            },
            date: date ,
            time: time,
          }
        ) 

        console.log(dataObj)
      

          /*
        data.forEach(sch => {

          console.log(`${new Date(sch.date).getDate()}`)

        })
        */
      },
    });
  }


  // async function createTicket(price: any) {
  //     let res = await buyTicket({
  //       showTimeId: schedule?.showTimes[0]?.id,
  //       seats: selectedSeats.map((e: any) => e.id),
  //       amount: 1,
  //     });
  //     // console.log(res);
  
  //     const PayInfo = {
  //       id: res.id,
  //       quantity: res.amount,
  //       name: `${res.user.firstName + " " + res.user.lastName}`,
  //       price,
  //     };
  
  //     payWithArifPay(PayInfo, res.id);
  //   }



async function createTicket(price:any) {

    try{

      const res =  await buyTicketWitoutSeat({

        showTimeId: schedule?.showTimes[0]?.id,
        
        numberOfTickets: numberOfTickets,

      })


    

      const PayInfo = {
          
          id: res.id,
          
          quantity: res.amount,
          
          name: `${res.user.firstName + " " + res.user.lastName}`,
          
          price,
      
      }

      console.log('-------------about to pay----------------')

      console.log(PayInfo)
      payWithArifPay(PayInfo, res.id);

      
    }catch(err) {

      console.log(err)

    }

}
  

async function payWithArifPay(data: any, ticketId: string) {
      // todo: auth token
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL_BACKEND}/api/arifpay/create`,
          data
        )
        .then((res) => {

          console.log('----------- in pay with arif--------------------')

          //console.log(res.status)
          console.log(res.data.data.paymentUrl);
          window.open(res.data.data.paymentUrl, "_blank");
          navigate({
             pathname: `/tickets/${ticketId}`,
           });
          return;
        })
        .catch((err) => {
          console.log(err);
          message.error("Unknown error");
          console.log(err);
        });
  }
  
  const payAction = async () => {
      

      console.log('------------------------ in pay action-----------------------')
      
      if (
        loading === false &&
        ((currentUser != null &&
          query.get("ref") === "tbot" &&
          currentUser.phoneNumber != query.get("phoneNumber")) ||
          currentUser === null)
      ) {
        toggleAuthModal(true, {
          ...authModalProps,
          phoneNumber: query.get("phoneNumber"),
        });
      } else {
        setBuyLoading(true);
        try {
          await createTicket(totalPrice);
        } catch (error) {
          console.log(error);
  
          message.error(`${error}` as any);
        }
        setBuyLoading(false);
      }

      setBuyLoading(true);

 
     
  }
  /*
  
  

  
    //amount error
    {modalVisible ? (
        <ConfirmOrder2
          onConfirm={payAction}
          onCloseModal={setModalVisible}
          data={showtime}
          paymentInfo={{
            user: currentUser,
            totalPrice: totalPrice * numberOfTickets,
            numberOfTickets: numberOfTickets
          }}
        />
    )}
  };
  
  */
  useEffect(() => {
    window.scrollTo(0,0)
    setSelectedShowtime(null);
    loadData();
  }, [id]);


  return (
    <>
      <Header />

     { modalVisible ? (

          <ConfirmOrder2
            onConfirm={payAction}
            onCloseModal={setModalVisible}
            data={dataObj}
            paymentInfo={{
              
              user: currentUser,
              
              numberOfTickets: numberOfTickets,
              
              setNumberOfTickets:setNumberOfTickets,
              
              totalPrice: totalPrice,
              
              setTotalPrice: setTotalPrice
              
              
            }}
          />
        ) : (<></>)
      }

      <div
        style={{
          flexDirection: "column",
          display: "flex",
          height: "100%",
        }}
      >
        {isLoading ? (
          <ChooseShowtimeSkeleton />
        ) : (
          <>
            <div
              className="container"
              style={{
                margin: "15px 0px",
                flexDirection: "column",
                display: "flex",
                flexGrow: 1,
              }}
            >
              
              <Row className={styles["content-row"]}>
                <Col className={styles["image-col"]}>
                  <ImageCard schedule={schedule} setModalVisible={setModalVisible} />
                </Col>
                <Col lg={14} md={14} sm={24}>
                  <div className={styles["content-container"]}>
                    <Typography.Title level={2}>
                      {schedule?.event?.title}
                    </Typography.Title>
                   
                    <Row
                      style={{ flexDirection: "column", margin: "15px 0px" }}
                    >
                      <Typography.Text
                        strong
                        style={{
                          marginRight: 10,
                          marginBottom: 0,
                          fontSize: 16,
                        }}
                      >
                        {"About this event"}
                      </Typography.Text>
                      <Typography.Text
                        style={{ 
                          marginRight: 10, 
                          
                          marginBottom: 5,
                          
                          fontSize:13
                        
                        }}
                      >
                        {schedule?.event?.synopsis}
                      </Typography.Text>
                    </Row>

                    <Row
                      style={{ flexDirection: "column", marginBottom:"10px" }}
                    >
                      <Typography.Text
                        strong
                        style={{
                          marginRight: 10,
                          marginBottom: 0,
                          fontSize: 16,
                        }}
                      >
                        {"Location"}
                      </Typography.Text>

                      <Typography.Text
                        style={{ 
                          marginRight: 10, 
                          
                          marginBottom: 5,
                          
                          fontSize:13
                        
                        }}
                      >
                        {schedule?.showTimes[0]?.eventHall.name}
                      </Typography.Text>
                    </Row>
                      
                    <Row
                      style={{ flexDirection: "column", marginBottom:"10px" }}
                    >
                      <Typography.Text
                        strong
                        style={{
                          marginRight: 10,
                          marginBottom: 0,
                          fontSize: 16,
                        }}
                      >
                        {"Organizer"}
                      </Typography.Text>
                      <Typography.Text
                        style={{ 
                          marginRight: 10, 
                          
                          marginBottom: 5,
                          
                          fontSize:13
                        
                        }}
                      >
                        {schedule?.event?.eventOrganizer}
                      </Typography.Text>
                    </Row>




                    
                    <Row>
                    <Row style={{ flexDirection: "column", maxWidth: 500 }}>
                     
                     <Typography.Title
                       level={4}
                       style={{
                        marginRight: 10,
                        marginBottom: 0,
                        fontSize: 16,
                       }}
                     >
                       {"Show time"}
                     </Typography.Title>

                     <Typography.Text
                        style={{
                          
                          fontSize:13


                        }}
                     >
                       
                       {`${new Date(schedule?.date).toDateString()} `}
                       {`${new Date(schedule?.showTimes[0]?.time).toLocaleTimeString()}`}
                      

                      </Typography.Text>
                    <span>
                      
                      
                      </span>
                   </Row>


                    </Row>

                  <Row style ={{

                    marginTop: 20,

                    display:"flex",

                    flexDirection:"column",

                  }}>

                      {schedule?.speakers? (
                      <Typography.Text
                        strong
                        style={{
                          marginRight: 10,
                          marginBottom: 10,
                          fontSize: 16,
                        }}
                      >
                        {"Speakers"}
                      </Typography.Text>
                      ) : 
                      (<></>)}
                    <Space 
                      
                      direction="horizontal" 
                      
                      style={{

                        display: "flex",

                        flexDirection: "row",

                        columnGap:"25px"

                      }}
                    
                    >
                      {schedule?.speakers?.map((e: any) => {
                        return (
                          <div>

                          <Card
                            key={e.id}
                            hoverable
                            // style={{ width: 700, wordWrap: 'break-word'}}
                            style={{ width: 100, height: 100 ,marginBottom:0}}
                            cover={
                              <img
                                alt="Speaker_image"
                                src={`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${e.posterImg}`}
                                style={{
                                  
                                  width: 100,

                                  height: 100,

                                  borderRadius:5

                                }}
                              />
                            }
                          >
                          </Card>
                            <Typography.Text
                              strong
                              style={{
                              marginRight: 10,
                              fontSize: 13,
                              fontWeight:"bolder"
                              }}
                            >
                              {e.firstName + " " + e.lastName}
                          </Typography.Text>
                          </div>
                        );
                      })}
                    </Space>
                        
                      </Row>
                   
                  </div>
                  
               
                </Col>
              </Row>








            </div>
          </>
        )}
        {isLoading ? (<></>):<RelatedEventsPreview {...schedule}/>}
      </div>
    </>
  );
}





{
                      
  /*
  
  
 <Space direction="vertical">
   {schedule?.showTimes?.map((e: any) => {
     return (
       <ShowtimeSelectButton
         key={e.id}
         value={e.id}
         select={setSelectedShowtime}
         selected={e.id === selectedShowtime}
         //timeCinema={`${dayjs(`${new Date(schedule.date).toDateString()} ${new Date(e.time).toLocaleDateString()} GMT+0300 (East Africa Time)`)
         //.format("DD/MM/YY")}`}
         //timeCinema={`${dayjs(e.time).format("DD/MM/YYYY h:mm A")} (${
           //e.eventHall.name
         //})`}
         // movieType={e.movieType === "THREE" ? "3D" : "2D"}
         disabled={!e.active}
       />
     );
   })}
 </Space>
  */
  }
/*



  generic content container
  prev position under speakers

     <div
                    className={styles["content-container"]}
                    style={{ margin: "25px 0px" }}
                    >
                  
                    <div style={{ margin: "25px 0px" }}> </div>
                   
                   
                  </div>
*/
/*
Duration contianer
prev position under show time container
 <Row align="middle">

                       <Tag color={"yellow"} style={{ fontSize: 14 }}>
                        <StarOutlined color="gold" />{" "}
                        <strong>{schedule?.movie?.rating}</strong>
                      }
                      </Tag> 
                                            <div 
                         style={{
                          marginTop:"10px",
                         flexDirection: "column",
                         alignItems:"flex-start",
                         display: "flex",
                        flexGrow: 1,
                       }}>


                      <Typography.Text
                        strong
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {"Duration"}
                      </Typography.Text>
                      <Tag color={"yellow"} style={{ fontSize: 14 }}>
                        <ClockCircleOutlined color="gold" />{" "}
                        <strong> {schedule?.event?.runtime} mins</strong>



                      </Tag>
                      </div>
                      
                      
                      
                      <Tag color={"yellow"} style={{ fontSize: 14 }}>
                        <strong>{schedule?.movie?.contentRating}</strong>
                      </Tag> 
                    
                      </Row>
                    


*/

/*
  Tag container 
  prev position under title

   <ErrorBoundary>
                      <Row align="middle">
                        <Typography.Text
                          strong
                          style={{ marginRight: 10, marginBottom: 2 }}
                        >
                          {"Tags"}
                        </Typography.Text>
                        {schedule?.event.tags.map((e: any) => {
                          return (
                            <Tag key={`k ${e}`} color="#EDEDED">
                              <Typography.Text>{e}</Typography.Text>
                            </Tag>
                          );
                        })}
                      </Row>
                    </ErrorBoundary>


*/

/*
<Row
                   style={{
                     flexDirection: "column",
                     maxWidth: 500,
                     marginTop: 30,
                   }}
                 >
                   <Button
                     type="primary"
                     disabled={selectedShowtime === null}
                     onClick={() => {
                       if (!currentUser)
                         return message.error(
                           "You need to login to continue"
                         );

                       if (!isValidPhoneNumber(currentUser?.phoneNumber)) {
                         message.error("Please enter a valid phone number");
                       } else {
                         navigate({
                           pathname: `showtime/${selectedShowtime}`,
                         });
                       }
                     }}
                     style={{
                       borderRadius: 5,
                       fontWeight: "600",
                       minHeight: 40,
                       fontSize: 16,
                     }}
                   >
                     Continue to seat selection
                   </Button>
                 </Row>

  continue to seat selection







*/



  /*
 <Typography.Title
                        level={4}
                        style={{
                          marginRight: 10,
                          marginBottom: 5,
                          // marginTop: 30,
                          fontWeight: "bold",
                        }}
                      >
                        {"Mobile Number"}
                      </Typography.Title>
                      <PhoneInput
                        countrySelectProps={{
                          disabled: true,
                        }}
                        disabled
                        placeholder="Enter phone number"
                        countries={["ET"]}
                        defaultCountry={"ET"}
                        value={currentUser?.phoneNumber}
                        international
                        countryCallingCodeEditable={false}
                        onChange={(e) => {
                          // setPhone(e as any);
                        }}
                        style={{
                          margin: "5px 0px",
                        }}
                      />

  */