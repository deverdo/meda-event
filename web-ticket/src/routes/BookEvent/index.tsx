import {
    Row,
    Breadcrumb,
    Skeleton,
    Typography,
    Space,
    message,
    Col,
    Card,
    Radio,
    Button,
    Form,
    InputNumber,
  } from "antd";
  import axios from "axios";
  import dayjs from "dayjs";
  import { relative } from "path";
  import React, { useEffect, useLayoutEffect, useState } from "react";
  import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
  import ConfirmOrder from "../../components/ChooseSeat/ConfirmOrder";
  import ConfirmOrder2 from "../../components/ChooseSeat/ConfirmOrder2"
  import SeatMap from "../../components/ChooseSeat/SeatMap/seatMap";
  import SeatPreview from "../../components/ChooseSeat/SeatMap/SeatPreview";
  import SeatsDetail from "../../components/ChooseSeat/seatsDetail";
  import ShowtimeDetail from "../../components/ChooseSeat/showtimeDetail";
  import ShowtimeDetail2 from "../../components/ChooseSeat/showTimeDetail2";
  
  import Header from "../../components/global/header";
  import colors from "../../constants/colors";
  import { SeatType } from "../../constants/setType";
  import { useAuth } from "../../context/authContext";
  import { SeatSelectionProvider } from "../../context/seatContext";
  import useOnFetch from "../../hooks/useOnFetch";
  import useQuery from "../../hooks/useQuery";
  import "../ChooseSeat/style.css";
  import {
    baseUrl,
    buyTicket,
    getShowtimeWithHallById,
  } from "../../utils/http_calls";
  import styles from "../ChooseSeat/choose.set.module.css";
  import ChooseSeatSkeleton from "../ChooseSeat/chooseSeatSkeletion";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";

  export default function ChooseSeat() {
    let { id, st } = useParams();
    const location = useLocation();
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    const [showtime, setShowtime] = useState<any>();
    const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
    const [currentHall, setCurrentHall] = useState(SeatType.Regular);
    const [buyLoading, setBuyLoading] = useState(false);
    const query = useQuery();
    const { currentUser, loading, toggleAuthModal, authModalProps, login } =
      useAuth();
    const [totalPrice, setTotalPrice] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [numberOfTickets,setNumberOfTickets] = useState(1)
  
    async function loadData() {
      await onFetch(async () => await getShowtimeWithHallById(st), {
        errorCallback: (error: any) => {
          message.error(`${error}`);
          navigate("/404", { replace: true });
        },
        onSuccessCallback: (data: any) => {
          console.log('show time infox')
            setShowtime(data);
            setTotalPrice(data.EventSchedule.regularTicketPrice)
          console.log(data);
        },
      });
    }
    useEffect(() => {
      setShowtime(null);
      loadData();
    }, []);
  
    const navigate = useNavigate();
  
    //amount error
    async function createTicket(price: any) {
      let res = await buyTicket({
        showTimeId: st,
        seats: selectedSeats.map((e: any) => e.id),
        amount: 1,
      });
      // console.log(res);
  
      const PayInfo = {
        id: res.id,
        quantity: res.amount,
        name: `${res.user.firstName + " " + res.user.lastName}`,
        price,
      };
  
      payWithArifPay(PayInfo, res.id);
    }
  
    async function payWithArifPay(data: any, ticketId: string) {
      // todo: auth token
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL_BACKEND}/api/arifpay/create`,
          data
        )
        .then((res) => {
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
  
    useEffect(() => {
      if (currentUser === null && loading === false) {
        toggleAuthModal(true, {
          ...authModalProps,
          phoneNumber: query.get("phoneNumber"),
        });
      } else if (
        currentUser != null &&
        loading === false &&
        query.get("ref") === "tbot" &&
        currentUser.phoneNumber != query.get("phoneNumber")
      ) {
        toggleAuthModal(true, {
          ...authModalProps,
          phoneNumber: query.get("phoneNumber"),
        });
      } else {
        toggleAuthModal(false, { ...authModalProps, phoneNumber: null });
      }
    }, [currentUser, loading]);
  
    function isSeatSelected(seat: any) {
      return selectedSeats.find((e: any) => e.id === seat.id) ? true : false;
    }
  
    const toggleSelectSeat = (seat: any) => {
      if (isSeatSelected(seat)) {
        // Remove seat
        let valueList = [...selectedSeats];
        const seatToBeRemovedIdx = valueList.findIndex((e) => e.id === seat.id);
        valueList.splice(seatToBeRemovedIdx, 1);
        setSelectedSeats(valueList);
      } else {
        // Select seat
        setSelectedSeats([...selectedSeats, seat]);
      }
    };
  
    const [selectedSeats, setSelectedSeats] = useState<any>([]);
    
  
    /*
    useLayoutEffect(() => {
      var sum = 0;
      selectedSeats.forEach((e: any) => {
        if (e.seatType === SeatType.Regular) {
          sum += showtime?.EventSchedule.regularTicketPrice ?? 0;
        } else {
          // sum += showtime?.CinemaMovieSchedule.vipTicketPrice ?? 0;
        }
      });
  
      setTotalPrice(sum);
    }, [selectedSeats]);
  
    */
    const payAction = async () => {
    
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
    };
  
    return (
      <>
        <Header />
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
        ) : (
          <></>
        )}
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <SeatSelectionProvider
            value={{
              regularTicketPrice: showtime?.EventSchedule.regularTicketPrice ?? 0,
              // vipTicketPrice: showtime?.EventSchedule.vipTicketPrice ?? 0,
              selectedSeats,
              totalPrice,
              toggleSelect: toggleSelectSeat,
              isSeatSelected,
            }}
          >
            {isLoading ? (
              <ChooseSeatSkeleton />
            ) : (
              <Row
                style={{
                  flexDirection: "column",
                  flexGrow: 1,
                  // paddingLeft: "30px",
                  width: "100%",
                  paddingBlock: "20px",
                  maxWidth: "1280px",
                  margin: "auto",
                  marginTop: "20px",
                }}
              >
                <Row align="middle">
                  <img
                    src="/images/logo.png"
                    style={{
                      width: 50,
                      height: 50,
                      marginRight: 5,
                    }}
                    alt=""
                  />
                  <Breadcrumb
                    separator={">"}
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    <Breadcrumb.Item key="home">
                      <Link to="/">Meda|Ticket</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item key={pathSnippets[2]}>
                      <Link to={`/${pathSnippets[0]}/${pathSnippets[1]}`}>
                        {showtime?.EventSchedule?.event?.title}
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item key={pathSnippets[3]}>
                      <Link
                        to={`/${pathSnippets[0]}/${pathSnippets[1]}/${pathSnippets[2]}/${pathSnippets[3]}`}
                      >
                        {"book event"}
                      </Link>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </Row>
                <Row className={styles["seat-selection-container"]}>
                  <ShowtimeDetail2
                    showtime={showtime}
                    currentHall={currentHall}
                    setCurrentHall={setCurrentHall}
                    setNumberOfTickets={setNumberOfTickets}
                  />
                </Row>
                
               
           
  
                {/* <Row className={styles["content-container"]} style={{}}>
                  <SeatsDetail showtime={showtime} />
                </Row> */}
                <Row
                  className={styles["content-row"]}
                  style={{ flexDirection: "column" }}
                >
                  <Row style={{
                     color: "red" ,
                     display:"flex",
                     justifyContent:"center",
                     alignItems:"center"
                     }}>Tickets are non refundable</Row>
                  <Row style={{
                    
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center"
                  }}>
                    <Row
                      style={{
                        backgroundColor: colors.PRIMARY,
                        padding: "10px 15px",
                        borderRadius: 5,
                        marginBottom: "50px",
                      }}
                      justify="space-between"
                      align="middle"
                    >
                      <Typography.Text
                        strong
                        style={{ color: "white", fontSize: 16 }}
                      >
                        {numberOfTickets} Tickets | {totalPrice * numberOfTickets} Birr
                      </Typography.Text>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#FFEC00",
                          borderRadius: 5,
                          color: "black",
                          fontWeight: "bold",
                          fontSize: 16,
                          minWidth: 100,
                          padding: 0,
                        }}
                        loading={buyLoading}
                        onClick={() => {
                          if (numberOfTickets <= 0) {
                          
                            message.error("Please correct the number of tickets field input");
                            return;
                          } else {
                            window.scrollTo(0, 0);
                            setModalVisible(true);
                          }
                        }}
                      >
                        Pay
                      </Button>
                    </Row>
                  </Row>
                </Row>
              </Row>
            )}
          </SeatSelectionProvider>
        </div>
      </>
    );
  }
  
  const regularTextStyle = {
    marginRight: 10,
    marginBottom: 5,
    fontSize: 16,
  };
  

  /*
  hidden container 
  pre position above the pay button component
       <Row
                  style={{
                    margin: "25px 0px",
                    padding: "25px",
                    display: "flex",
                    overflow: "hidden",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                
                </Row>



  */