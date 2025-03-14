import React, { useState } from "react";
import ProfileMini from "./ProfileMini";
import NotificationTab from "./NotificationTab";
import styled from "styled-components";
import Logout from "@/services/Logout";
const Button = styled.button`
  box-shadow: 0 0;
  background-color: transparent;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  font-size: 1rem;
`;

const Div = styled.div`
  display: flex;
  gap: 1rem;
`;
function MainNav() {
  const [isOpenProfile, setOpenProfile] = useState(false);
  const [isOpenNotificaton, setOpenNotification] = useState(false);
  return (
    <Div>
      <Button
        className={"button-close-profile"}
        onClick={() => {
          setOpenProfile((isOpenProfile) => !isOpenProfile);
        }}
      >
        B
      </Button>
      <Button
        className={"button-close-notification"}
        onClick={() => {
          setOpenNotification((isOpenNotificaton) => !isOpenNotificaton);
        }}
      >
        🔔
      </Button>
      <Logout></Logout>
      {isOpenNotificaton && (
        <NotificationTab setOpenNotification={setOpenNotification} />
      )}
      {isOpenProfile && <ProfileMini setOpenProfile={setOpenProfile} />}
    </Div>
  );
}

export default MainNav;
