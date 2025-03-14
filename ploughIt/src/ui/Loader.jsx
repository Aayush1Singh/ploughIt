import React from "react";

function Loader() {
  return (
    <div className="absolute z-1000 h-[calc(100%-5px)] w-[calc(100%-5px)] content-center backdrop-blur-[5px]">
      <div className="flex content-center justify-center">
        <img
          // width="150"
          // height=""
          src="../../public/loading_animation.gif"
        ></img>
        {/* <video
          width="150"
          height="240"
          muted
          autoPlay
          loop
          className="flex justify-center"
        >
          <source src="../../public/loading_animation.gif" />
        </video> */}
      </div>
    </div>
  );
}

export default Loader;
