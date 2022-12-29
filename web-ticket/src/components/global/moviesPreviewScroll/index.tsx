import { message, Row, Skeleton, Space, Typography } from "antd";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import React, { useEffect, useState } from "react";
import useOnFetch from "../../../hooks/useOnFetch";
import { getMovieSchedules , getMovieSchedulesBasedOnTag} from "../../../utils/http_calls";
import MovieCard from "../moviecard";
import styles from "../../../routes/Landing/landing.module.css";
import dayjs from "dayjs";
const scrollStyle = (theme: any) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
});
export default function MoviesPreviewScroll(eventType:any) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const { error, isLoading, isSuccess, onFetch, result } = useOnFetch();

  //load data without tag
  async function loadData() {
    await onFetch(async () => await getMovieSchedules(), {
      errorCallback: (error: any) => message.error(`${error}`),
      onSuccessCallback: (data: any) => {
        setSchedules(data);
        console.log('------------------------ In movie preview scroll------------------')
       
        console.log(data)
      },
    });
  }

  //load data with tag

async function loadDataWithTag(eventType:any) {

    await onFetch(async () => await getMovieSchedulesBasedOnTag(eventType), {

      errorCallback: (error: any) => message.error(`${error}`),

      onSuccessCallback: (data: any) => {

        console.log('---------------- in success call back---------------')

        console.log(data)

        //setSchedules(data)

      },

    })

}
  useEffect(() => {

    console.log('------------------------------ in movie preview comp (displaying props)-----------------------')
    console.log(eventType?.event?.eventType)
    loadData();
    loadDataWithTag(eventType?.event?.eventType)
  }, []);
  return (
    <div
      className={"container"}
      style={{
        alignItems: "center ",
        flexDirection: "column",
      }}
    >
      {isLoading ? (
        <>
          <Skeleton paragraph={{ rows: 0 }} active />
          <Space
            direction="horizontal"
            size={"large"}
            style={{ marginBottom: 30 }}
          >
            {[1, 2, 3].map((e, index) => (
              <Space key={index} direction="vertical">
                <Skeleton.Image style={{ width: 200, height: 280 }} />
                <Skeleton.Button
                  block
                  active
                  size="small"
                  style={{ width: 100 }}
                ></Skeleton.Button>
                <Skeleton.Button
                  block
                  active
                  size="small"
                  style={{ width: 150 }}
                ></Skeleton.Button>
              </Space>
            ))}
          </Space>
        </>
      ) : (
        <>
        
        <Typography.Text
          
          style={{
            fontWeight: "bold"
          }}
        >
          Happening today
        </Typography.Text>

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
                      runtime={`${e.showTimes[0].time}`}
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
    </div>
  );

}


/*
<Typography.Text
               strong
               style={{
                 marginTop:100,
                 marginRight: 10,
                 marginBottom: 10,
                 fontSize: 16,
               }}
             >
               {"More events"}
 </Typography.Text>

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

*/

/*



 



          <>

        <div
           className={"container"}
           style={{
            alignItems: "center ",
            flexDirection: "column",
          }}
        >

          <Typography.Title level={2} style={{

         

            alignItems:"center",

           

          }}>
             Currently available events
           </Typography.Title>
        </div>
           <div
            style={{
              margin: "15px 0px",
              flexDirection: "row",
              display: "flex",
              justifyContent:"center",
               width:"100vw",
               overflowX: "auto",
             }}
             className="cool-scroll"
           >
             {schedules.length > 0
               ? schedules[index].schedules.map((e: any) => {
                   return (
                     <ErrorBoundary key={e.id}>
                       <MovieCard
                         preview={false}
                         src={`${process.env.REACT_APP_BASE_URL_BACKEND}/images/${e.event.posterImg}`}
                         title={e.event.title}
                         runtime={`${Math.floor(e.event.runtime / 60)}h ${
                           e.event.runtime % 60
                         }min`}
                         trailerLink={e.event.trailerLink}
                         scheduleId={e.id}
                         key={e.id}
                       />
                     </ErrorBoundary>
                   );
                 })
               : null}
           </div>
         </>
       
*/