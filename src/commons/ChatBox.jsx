import React from "react";
import { chat } from "../iconsImports";

const ChatBox = () => {
  // const navigate = useNavigate();
  // function openForm() {
  //   document.getElementById("myForm").style.display = "block";
  // }
// a

  return (
    <div>
      
      <a
        href="https://wa.me/918447445497?text=I'm%20interested%20in%20IMPS Guru"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={chat}
          type="button"
          className="open-button-wp"
          alt="chat box"
          // onClick={() => {
          //   //openForm();
          //   navigate("whatsapp://send?abid=8745095350&text=Hello%2C%20World!");
          // }}
          width="50px"
        />
      </a>
    </div>
  );
};

export default ChatBox;
