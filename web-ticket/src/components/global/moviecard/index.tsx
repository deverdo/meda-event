import { Button, message, Modal, Space, Typography } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import ShowtimeSelectButton from "../../chooseShowtime/showtimeSelectButton";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./moviecard.module.css";
export default function MovieCard({
  src,
  title,
  runtime,
  trailerLink,
  scheduleId,
  preview = true,
}: any) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <Modal
        title="Movie Trailer"
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
          src={trailerLink}
          // title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Modal>
      <div className={styles["card-container"]}>
        {
          <>
            <div
              className={styles["image-section"]}
              style={{
                width: 200,
                height: 280,
                borderRadius: 5,
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                boxShadow:
                  "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                overflow: "clip",
              }}
            >
              <div className={styles["content-mask"]}>
                <Space
                  direction="vertical"
                  size={"small"}
                  style={{ width: "100%", padding: "0% 5%" }}
                >
                  
                  <Link to={`/schedule/${scheduleId}`}>
                    <Button
                      block
                      type="primary"
                      size="large"
                      style={{
                        borderRadius: 10,
                        backgroundColor: "transparent",
                        fontWeight: "500",
                        borderWidth: 1,
                        borderColor: "#F56A05",
                        color: "#F56A05",
                      }}
                    >
                      View details
                    </Button>
                  </Link>
                </Space>
              </div>
            </div>
            <div
              style={{
                width: 200,
                display: "flex",
                justifyContent: "start",
                flexDirection: "column",
                marginTop:10
              }}
            >
              <div style={{ fontSize: 16, fontWeight: "bold", marginTop: 5 }}>
                {title}
              </div>

                <Typography.Text
                
                  style={{ 
                
                    marginRight: 10, 
      
                    marginBottom: 5,
      
                    fontSize:13
    
                  }}
                >
                
                  {dayjs(runtime).format("DD/MM/YYYY h:mm A")}
  
                </Typography.Text>
              
            </div>
          </>
        }
      </div>
    </>
  );
}
