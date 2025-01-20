import React, { useEffect } from "react";
import { Div } from "./ProfileMini";
import styled from "styled-components";
const Div2 = styled(Div)`
  width: 500px;
  transform: translate(-70%, 0);
  width: 15rem;
`;

function NotificationTab({ setOpenNotification }) {
  useEffect(() => {
    document.addEventListener(
      "click",
      function (event) {
        // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
        if (
          !event.target.matches(".button-close-notification") ||
          !event.target.closest(".button-close-notification")
        ) {
          console.log(event.target.matches(".button-close-profile"));
          setOpenNotification(false);
        }
      },
      true
    );
  });
  return (
    <Div2 className="notificationPopup">
      <div>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis ipsam
        accusamus ab deleniti totam, ipsa architecto amet, expedita inventore a
        consequuntur temporibus ratione eveniet possimus at necessitatibus non
        officiis accusantium.
      </div>
      <button>Load More</button>
    </Div2>
  );
}

export default NotificationTab;
