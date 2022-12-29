import { Col, message, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import Header from "../../components/global/header";
import useOnFetch from "../../hooks/useOnFetch";
import { getMovieSchedules } from "../../utils/http_calls";
import LandingSkeleton from "./landingSkeleton";
import dayjs from "dayjs";
import styles from "./landing.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MovieCard from "../../components/global/moviecard";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";

function Landing() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();
  async function loadData() {
    await onFetch(async () => await getMovieSchedules(), {
      errorCallback: (error: any) => message.error(`${error}`),
      onSuccessCallback: (data: any) => {
        console.log("----------------- in landing page--------------")
        data.forEach((sch:any) => {

          console.log(`${new Date(sch.date)}`)
        })
        setSchedules(data);
      },
    });
  }
  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginTop:50
        }}
        data-testid="lan"
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
          }}
        >
          Events Happening Now 
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: "500",
          }}
        >
          Buy Event tickets in Ethiopia
        </div>
      </div>
      {isLoading ? (
        <LandingSkeleton />
      ) : schedules.length < 1 ? 
        (
          <div
            
            style={{

              backgroundColor: "white",

              display:"flex",

              height:"100px",

              justifyContent:"center",

              alignItems:"center"

            }}
          > 
            There are no events Happening right now

          </div>
        ) : (
        <>
          <Row
            justify="center"
            style={{
              margin: "15px 0px",
            }}
          >
            {schedules.map((e, i) => {
              let day = dayjs(e.date);
              return (
                <div
                  className={
                    i === index
                      ? styles["calender-active"]
                      : styles["calender-not-active"]
                  }
                  key={`k ${new Date(e.date).getDay()}`}
                  onClick={() => {
                    setIndex(i);
                  }}
                >
                  <div className={styles["top-row"]}>
                    <div className={styles["text"]}>{day.format("ddd")}</div>
                  </div>
                  <div className={styles["middle-row"]}>
                    <div className={styles["text"]}>{day.format("DD")}</div>
                  </div>
                  <div className={styles["bottom-row"]}>
                    <div className={styles["text"]}>{day.format("MMM")}</div>
                  </div>
                </div>
              );
            })}
          </Row>

          <Row
            className={"container"}
            justify="center"
            style={{
              margin: "15px 0px",
              flexDirection: "row",
              display: "flex",
            }}
          >
            {schedules.length > 0
              ? schedules[index].schedules.map((e: any) => {
                  return (
                    <ErrorBoundary key={e.id}>
                      <MovieCard
                        src={`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${e.event.posterImg}`}
                        title={e.event.title}
                        runtime={`${e.date}`}
                        trailerLink={e.event.trailerLink}
                        scheduleId={e.id}
                      />
                    </ErrorBoundary>
                  );
                })
              : null}
          </Row>
        </>
      )}
    </>
  );
}

export default Landing;
