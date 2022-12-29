import { BarChartOutlined, CalendarOutlined, ClockCircleOutlined, PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Layout, Row, Typography,Image } from 'antd'
import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom';
import {getCurrentUser,getAllMovies, getEventSchedules } from '../../helpers/httpCalls'
import baseUrl from "../../helpers/httpCalls"
import {BsFillPinMapFill} from 'react-icons/bs'
import "./Dashboard.css"

interface userType {

    firstName:String;
    id: String;
    lastName:String;
    role:String;
    username:String;


}



const Dashboard = () => {

    const [user,setUser] = useState<null | userType >(null)

    const [event,setEvent] = useState<any>(null)

    useEffect(() => {

        getCurrentUser().then(res => {setUser(res.result)}).catch(err => console.log(err))
        // getAllMovies().then(res => {
        //     //console.log(res[0])
        //     setEvent(res[0])
        // }).catch(err => console.log(err))

        getEventSchedules()
            .then(result => {
            
                  
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const eventObj =  {
                    title:result[0].event.title,
                    date:{

                        month:monthNames[new Date(result[0].date).getUTCMonth()],

                        day:new Date(result[0].date).getUTCDate(),

                        year:new Date(result[0].date).getUTCFullYear(),

                        time:new Date(result[0].date).toLocaleTimeString('en-US')

                    },

                    img: `${baseUrl}/images/${result[0].event.posterImg}`

                }

                //window.location.assign(eventObj.img)
                setEvent(eventObj)
            
            }).
            catch(err => console.log(err))

        

    },[])

    return (
        <div

        style={{

            backgroundColor:"#fcfcfc",

            paddingTop:"30px",

            fontFamily: "'SF UI Display',sans-serif"

        }}
        
        >

           {
            
            user == null ?
                 (<>
                 
                 </>) : 
                 (
                 <>
                    
                    <Layout
                        style={styles.userWelcomeCont}
                    >

                        <div   
                         
                         style={{
                            
                            display:"flex",
                            
                            justifyContent:"center",

                            flexDirection:"column",

                            backgroundColor:"white",

                            height:"100%"


                        }}>


                            <Typography.Title

                                level={3}
                            
                                style={{
                            
                                    display:"flex",
                            
                                    flexDirection:"column",
                            
                                    fontWeight:"bold",
                            
                                    
                                                
                            
                                }}
                                
                            >
                                Hey There , {user?.username}
                                
                                <Typography.Text
                                  
                                  style={{

                                        fontSize:"12px",

                                        fontWeight:"light"

                                    }}
                                >

                                    Sell event tickets in ethiopia 

                                </Typography.Text>
                            
                            </Typography.Title>
                            
                        </div>

                    
                    </Layout>

                    <Layout
                        style={styles.contentCont}
                     >
                        <div style={styles.contentTitleCont}>
                                <Typography.Title

                                    level={4}

                                    style={{

                                        fontWeight:"bold"

                                    }}
                                >

                                    Your recent event

                                </Typography.Title>

                        </div>
                        {event == null ? (<></>) : (



                        <Row
                            style={{

                                height:"50%",

                                //backgroundColor:"orange",

                                marginLeft:"5%",

                                marginRight:"5%",

                                //border:"1px solid silver"

                            }}
                            gutter={[30,30]}
                        >
                            
                        <Col
                            span={3}
                            style={{
                                backgroundColor:"white",
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"center",
                                flexDirection:"column"
                            }}
                        >   
                            <Typography.Text
                                style={{
                                    color:"red",
                                    fontSize:"15px"
                                }}
                            >
                                {event.date.month}
                            </Typography.Text>
                            <Typography.Text
                                style={{
                                    color:"black",
                                    fontSize:"17px",
                                    fontWeight:"bold"
                                }}
                            >

                                {event.date.day}  
                            </Typography.Text>

                        </Col>
                        <Col
                            span={2}
                            style={{
                                backgroundColor:"white",
                                display:"flex",
                                alignItems:'center',
                                justifyContent:"center"
                            }}
                        >
                            <Image 
                                src={`${event.img}`}
                                width="fill"
                                height="fill"
                                alt="image loading"
                            />
                            
                        </Col>
                        <Col
                            span={12}
                            style={{
                               // backgroundColor:"gray",
                                display:'flex',
                                flexDirection:"column",
                               


                            }}
                        >   

                            <Layout
                                style={{
                                    backgroundColor:"white",
                                    display:'flex',
                                    justifyContent:"end",

                                }}
                            >
                                <Typography.Text
                                    style={{
                                        
                                        fontWeight:"bold"

                                    }}
                                >

                                    {event.title}
                                </Typography.Text>




                            </Layout>
                            <Layout
                                style={{
                                    //backgroundColor:"yellow",
                                    
                                    

                                }}
                            >
                                {`Starts ${event.date.month} ${event.date.day} , ${event.date.year} at ${event.date.time}`}
                            
                            </Layout>

                            {



                            // <Typography.Text>

                            //     {"title"}
                            
                            // </Typography.Text>
                            // <Typography.Text>
                            
                            //     {`Starts ${event.date.month} ${event.date.day} , ${event.date.year} at ${event.date.time}`}

                            // </Typography.Text>
                            }


                        </Col>
                        <Col
                            span={6}
                            style={{
                                //backgroundColor:"brown"

                            }}
                        ></Col>



                        </Row>
                        )}
                        
                    </Layout>

                    <Layout style={styles.contentCont}>
                        
                        <div style={styles.contentTitleCont}>
                           <Typography.Title

                                level={4}

                                style={{

                                    fontWeight:"bold"

                                }}
                           >

                                How can we help?

                           </Typography.Title>

                        </div>
                          
                        <div
                            style={{
                                height:"60%",

                                width:"90%",

                                backgroundColor:"white",

                                marginLeft:"5%",

                                display:"grid",

                                gridTemplateColumns:"1fr 1fr 1fr 1fr",

                                gap:"10px"

                                
                            }}
                        >
                           <Link to="events/manage" style={styles.howCanWeHelpCardItems} className="howCanWeHelpCardItems">
                                <PlayCircleOutlined 
                                    style={styles.howCanWeHelpCardIcons}
                                />
                            </Link>
                           <Link to="user/manage" style={styles.howCanWeHelpCardItems} className="howCanWeHelpCardItems">
                                <UserOutlined style={styles.howCanWeHelpCardIcons} />
                           </Link>
                           <Link to="schedules/manage" style={styles.howCanWeHelpCardItems} className="howCanWeHelpCardItems">
                                <ClockCircleOutlined style={styles.howCanWeHelpCardIcons}/>
                           </Link>
                           <Link  to="sales-report" style={styles.howCanWeHelpCardItems} className="howCanWeHelpCardItems">
                                <BarChartOutlined style={styles.howCanWeHelpCardIcons}/>
                           </Link>
                        </div>
                    </Layout>
                    
                </>
                )


           } 
        </div>
    )
}


const styles =  {

    userWelcomeCont: {

        height:"12vh",

        backgroundColor:"white",

        marginLeft:"5vw",

        width:"80vw"



        //border:"1px solid silver"

    },

    contentCont:{

        height:"40vh",

        marginLeft:"5vw",

        backgroundColor:"white",

       // border:"1px solid #ebf7f1",

        width:"80vw"

    },

    contentTitleCont: {

        height:"30%",

        backgroundColor:"white",

        marginLeft:"5%",

        display:'flex',

        alignItems:"center"

    },
    howCanWeHelpCardItems: {

        border:"1px solid #f0f2f5",

        display:"flex",

        alignItems:"center",

        justifyContent:"center",

        

    },

    howCanWeHelpCardIcons: {

        fontSize:"150%",

        color:"#61a0ed"

    }



}
export default Dashboard
