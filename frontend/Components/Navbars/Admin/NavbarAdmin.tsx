import { Col, Layout, Menu, Row ,Button, Typography } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined,PlusOutlined, BorderBottomOutlined  } from "@ant-design/icons";
import styles from "./navbar.admin.module.css";
import { Link, Navigate } from "react-router-dom";
import NavbarProfile from "./NavbarProfile";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function NavbarAdmin({
  collapsed,
  toggle,
}: {
  collapsed: boolean;
  toggle: any;
}) {
  return (
    <Header style={{ 
        
        padding: 0 ,
        
        backgroundColor:"white",
        
        borderBottom:"1px solid #f5f7f6",



    }}>
      
      <Row
        gutter={[10,10]}

         
   
        
      >
        
        <Col
          
          flex="auto"

          span="2"

          offset={1.5}

          style={{

           marginLeft:"40px",

           marginTop:"10px",

            display:"flex",

            alignItems:"center",

            //justifyContent:"center",

          }}

          

        
        >

        
          <Link to="/admin">
          
          
            <Typography.Title
                level={2}
                style={{

                  color:"orange",

                  fontWeight:650,

                  display:"flex",

                  flexDirection:"row",

                  justifyContent:"center",

                  gap:"5px"

                }}
              >

                  meda

              <Typography.Text
                  
                    style={{
                      color:"orange",

                      fontWeight:300
                        
                    }}
                    type="warning"
                  >
                    ticket
              </Typography.Text>
              </Typography.Title>
          </Link>

   
            

        </Col>
         
   
        
       
        
      
       
        

        <Col flex="auto">
        
        </Col>
        <Col >

            <Link to="events/add">
            
              <Button
                
                danger={true}
                
                shape="round"
                
                icon={
                  <PlusOutlined 
                      style={{

                        fontSize:"15px"

                      }}
                  />

                }

                size="middle"

          
              >
                
                <Typography.Text
                  strong
                  style={{

                    color:"red"

                  }}
                >
                  Create
                </Typography.Text>

              </Button>

            </Link>
        
        </Col>
        <Col 
          style={{
            marginRight:"20px"
          }}
        > 
          <NavbarProfile />
        </Col>
      </Row>
    </Header>
  );
}
