import { Breadcrumb, Layout, Menu, Typography } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
  PlayCircleOutlined,
  AliyunOutlined,
  FieldTimeOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import styles from "./admin.module.css";
import React, { createElement, useState } from "react";
import NavbarAdmin from "../../Components/Navbars/Admin/NavbarAdmin";
import { Link, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function Admin(props: any) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      <Layout >
        <NavbarAdmin collapsed={collapsed} toggle={toggle} />
      </Layout>
      <Layout>

      
        <Sider trigger={null} breakpoint="lg" collapsible collapsed={collapsed} theme="light">
        

          <Menu theme="light" mode="inline">

          <Menu.Item style={{color:"grey"}}>
          {collapsed ? (
            <MenuUnfoldOutlined className={styles.trigger} onClick={toggle} />
          ) : (
            <MenuFoldOutlined className={styles.trigger} onClick={toggle} />
          )}
        </Menu.Item>
          <Menu.Item key="manage-users" icon={<UserOutlined />}>
                <Link to="user/manage">{"Users"}</Link>
              </Menu.Item>
            <Menu.Item
               key="manage-ticketRedeemers"
               icon={<UsergroupAddOutlined />}
               title={"Ticket Redeemers"}
               >
              <Link to="ticket-redeemer/manage">{"Ticket redemmers"}</Link>
            </Menu.Item>
            <Menu.Item 
              key="manage-events"
              icon={<PlayCircleOutlined />}
              title={"Events"}
              
              >
                <Link to="events/manage">{"Events"}</Link>
              </Menu.Item>

              <Menu.Item 
                key="manage-venues"
                icon={<AliyunOutlined />}
                title={"Venues"}
              >
                <Link to="venues/manage">{"Venue"}</Link>
              </Menu.Item>

              <Menu.Item 
                key="manage-schedule"     
                icon={<FieldTimeOutlined />}
                title={"Event Schedule"}
                >
                <Link to="schedules/manage">{"Schedule"}</Link>
              </Menu.Item>

              <Menu.Item key="sales-report" icon={<BarChartOutlined />}>
              <Link to="sales-report">{"Sales Report"}</Link>
            </Menu.Item>

              {/*<SubMenu key="users" icon={<UserOutlined />} title={"Users"}>
                <Menu.Item key="register-users">
                  <Link to="user/register">{"Register"}</Link>
                </Menu.Item>
                <Menu.Item key="manage-users">
                  <Link to="user/manage">{"Manage"}</Link>
                </Menu.Item>
    </SubMenu>*/}
  {

/*


            <SubMenu
              key="ticketRedeemers"
              icon={<UsergroupAddOutlined />}
              title={"Ticket Redeemers"}
            >
              <Menu.Item key="register-ticketRedeemers">
                <Link to="ticket-redeemer/register">{"Register"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-ticketRedeemers">
                <Link to="ticket-redeemer/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
*/

  }


      {/**
       


            <SubMenu
              key="events"
              icon={<PlayCircleOutlined />}
              title={"Events"}
            >
              <Menu.Item key="add-events">
                <Link to="events/add">{"Add"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-events">
                <Link to="events/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="venues" icon={<AliyunOutlined />} title={"Venues"}>
              <Menu.Item key="add-venues">
                <Link to="venues/add">{"Add"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-venues">
                <Link to="venues/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="schedule"
              icon={<FieldTimeOutlined />}
              title={"Event Schedule"}
            >
              <Menu.Item key="add-schedule">
                <Link to="schedules/add">{"Create"}</Link>
              </Menu.Item>
              <Menu.Item key="manage-schedule"     icon={<FieldTimeOutlined />}
              title={"Event Schedule"}>
                <Link to="schedules/manage">{"Manage"}</Link>
              </Menu.Item>
            </SubMenu>
       */




      }
           
          </Menu>
        </Sider>
        <Layout  style={{

          backgroundColor:"white"

        }} >
          
          <Content
    
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Admin;
