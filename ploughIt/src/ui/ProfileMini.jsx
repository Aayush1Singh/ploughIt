import { useEffect, useRef } from "react";
import styled from "styled-components";
const Image = styled.div`
  width: 10px;
`;
const Button = styled.button`
  &:hover {
    background-color: #eee;
  }
  height: 3rem;
  background-color: white;
  border-width: 0;
  border-bottom: 2px solid;
  padding: 1rem;
`;
export const Div = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 15%;
  transform: translate(-90%, 0);
  border: solid 1px;
  border-radius: 4px;
  width: 8rem;
`;
function ProfileMini({ setOpenProfile }) {
  const modalRef = useRef();
  useEffect(() => {
    document.addEventListener(
      "click",
      function (event) {
        // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
        if (
          !event.target.matches(".button-close-profile") ||
          !event.target.closest(".button-close-profile")
        ) {
          console.log(event.target.matches(".button-close-profile"));
          setOpenProfile(false);
        }
      },
      true
    );
  }, [setOpenProfile]);
  return (
    <Div className={"profilePopup"}>
      <Image></Image>
      <Button>Settings</Button>
      <Button>UpdateProfile</Button>
      <Button>SignOut</Button>
    </Div>
  );
}

export default ProfileMini;
