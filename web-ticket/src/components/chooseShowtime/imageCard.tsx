import { Button, message, Modal, Rate, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./showtime.select.module.css";

function ImageCard( {schedule,setModalVisible}: any,) {
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate()
  
  useEffect(() => {

    console.log('---------------------------------- In Image card ------------------------')

    console.log(schedule)

  } , [])


  //onclick event to redirect to choose seat route
  function redirect() {
    
                 
      navigate({
        pathname: `/schedule/${schedule?.id}/showtime/${schedule?.showTimes[0]?.id}`,
      });
      
    }

  //onclick event to open modal
  function showModal() {

    setModalVisible(true)

  } 
  return (
    <>
      <Modal
        title="Event Trailer"
        centered
        visible={visible}
        width={1280}
        destroyOnClose
        footer={[]}
        bodyStyle={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
        onCancel={() => setVisible(false)}
      >
        <iframe
          width="1080"
          height="520"
          src={schedule?.event?.trailerLink}
          //   title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Modal>

      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          width: "200px",
            height: "340px",
          margin: "10px 10px",
        }}
      >
        <div
          //   className={styles["image-section"]}
          style={{
            width: 200,
            height: 280,
            borderRadius: 5,
            backgroundImage: `url(${process.env.REACT_APP_BASE_URL_BACKEND}/images/${schedule?.event?.posterImg})`,
            backgroundSize: "cover",
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            overflow: "clip",
            marginBottom:"15px"
          }}
          className={styles["posterImg"]}
        ></div>

        <div
          
          style={{
            borderRadius: 2,
            backgroundColor: "#f75d1b",
            fontWeight: "500",
            borderWidth: 1,
            borderColor: "#F56A05",
            color: "#F56A05",
            padding:3,
            display:"grid",
            gridTemplateColumns:"1fr 1fr",
            alignContent:"center",
          }}
         
        > 
            


             <Typography.Text style={{

                fontSize:10,

                color:"white",

                display:"flex",
                
                flexDirection:"row",

                alignItems:"center",

                justifyContent:"center",

                marginRight:2

             }}>
                    <span> 3 Tickets | </span> 
                       
                    <span>{  3 * schedule?.regularTicketPrice} birr</span>

              </Typography.Text>
            

              <Button block style={{
                  
                  backgroundColor:"yellow",

                  borderColor:"yellow",

                  borderRadius:5,

                  color:"black"
                
              }}

                onClick={schedule?.event?.eventType != "movie"? showModal : redirect}

                
                >

                <span style={{

                  color:"black",

                  fontWeight:"bold"

                }}>

                  Buy

                </span>

              </Button>
        </div>
      </div>
    </>
  );
}

/*
  block
          size="large"

*/

export default ImageCard;
