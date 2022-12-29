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
  import { getMovieSchedules, getScheduleById } from "../../utils/http_calls";
  import styles from "./schedule.module.css";
  import { ClockCircleOutlined, CodepenOutlined, StarOutlined } from "@ant-design/icons";
  import "react-phone-number-input/style.css";
  import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
  import ShowtimeSelectButton from "../../components/chooseShowtime/showtimeSelectButton";
  import dayjs from "dayjs";
  import MoviesPreviewScroll from "../../components/global/moviesPreviewScroll";
  import ChooseShowtimeSkeleton from "../ChooseShowtime/chooseShowtimeSkeleton";
  import { useAuth } from "../../context/authContext";
  import "./Index.css";
  import styled from 'styled-components'
import { url } from "inspector";
  
  type Seats = {
    name: string;
  };

  
export default function ShowEvent({event}:any) {

 let selectedShowtime = event.schedules[0].showTimes[0].id
  const { currentUser, loading, toggleAuthModal, authModalProps } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
 
    console.log(event.schedules[0])

    //console.log(`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${event.event.posterImg}`)
  },[])



  
  
const BackgroundImage = styled.h1`
  background: url(${process.env.REACT_APP_BASE_URL_BACKEND}/images/${event.schedules[0].event.posterImg});
  background-size: cover;
`;

/*
<div className="ch-top-left">
<img
  className="chebelew"
  src={`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${event.schedules[0].event.posterImg}`}
  alt=""
/>
</div>
<img
  className="chebelew"
  src={`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${event.schedules[0].event.posterImg}`}
  alt=""
/>

*/
  return (
    <div style={{

      borderBottom: "1px solid white"

    }}>
        <div className="ch-top">
          <div className="ch-top-left">
          
            <img
              className="chebelew"
              src={`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${event.schedules[0].event.posterImg}`}
              alt=""
            />
            
          </div>
          <div className="ch-top-right">
            <h2 className="ch-title">{event?.schedules[0].event.title}</h2>
            <div className="ch-section">
              <h3 className="ch-section-title">Organizer </h3>
              <p className="ch-section-desc">
                {event?.schedules[0].event.eventOrganizer}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
              <div className="ch-section">
                <h3 className="ch-section-title">Address</h3>
                <a
                  href="https://bit.ly/3LAhxLN"
                  className="ch-section-desc-href"
                  target="_blank"
                  rel="noreferrer"
                >
                  {event?.schedules[0].showTimes[0].eventHall.name}
                </a>
              </div>
              <div className="ch-section">
                <h3 className="ch-section-title">Date</h3>
                <p className="ch-section-desc">
                  {new Date(
                    event?.schedules[0].showTimes[0].time
                  ).toDateString()}
                </p>
              </div>
              <div className="ch-section">
                <h3 className="ch-section-title">Time</h3>
                <p className="ch-section-desc">
                  {new Date(
                    event?.schedules[0].showTimes[0].time
                  ).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="ch-section">
              <h3 className="ch-section-title">Synopsis</h3>
              <p className="ch-section-desc">
                {event?.schedules[0].event.synopsis}
              </p>

              <Button
                type="primary"
                disabled={selectedShowtime === null}
                onClick={() => {
                  if (!currentUser) {
                    toggleAuthModal(true, {
                      ...authModalProps,
                    });
                    return message.error("You need to login to continue");
                  }

                  if (!isValidPhoneNumber(currentUser?.phoneNumber)) {
                    message.error("Please enter a valid phone number");
                  } else {
                    navigate({
                      pathname: `event/${event.schedules[0].id}/showtime/${event.schedules[0].showTimes[0].id}`,
                    });
                  }
                }}
                style={{
                  borderRadius: 5,
                  fontWeight: "600",
                  minHeight: 40,
                  fontSize: 16,
                  paddingLeft: "40px",
                  paddingRight: "40px",
                }}
              >
                Buy Ticket
              </Button>
            </div>
          </div>
          <span className="scrollDown"></span>
        </div>

    </div>
  )

}
