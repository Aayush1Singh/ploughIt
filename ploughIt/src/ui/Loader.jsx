import React from "react";

function Loader() {
  return (
    <div className="inset w-100% absolute z-1000 flex size-full h-screen content-center justify-center bg-center backdrop-blur-[3px]">
      <div className="flex size-full h-screen w-[100%] content-center items-center justify-center backdrop-blur-[1px]">
        <img
          width="150"
          height="240"
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
