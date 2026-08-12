import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
const Loader = ({ loader }) => {
      
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <TailSpin
        height="80"
        width="80"
        color="#764ba2"
        ariaLabel="tail-spin-loading"
        visible={loader}
      />
    </div>
  );
};
export default Loader;
