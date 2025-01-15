import React from "react";
import { useState } from "react";


const SideNavButton = ({ UnderlineRequired = true, nav }) => {
  const [isHover, setIsHover] = useState(false);

  return <div>hello</div>;
};

export default SideNavButton;

{
  /* <Grid
item
xs={4}
sm={2}
md={2}
lg={1.9}
className="animate-category"
sx={{ mr: 1, mb: 1 }}
>
<Link to={nav.to} style={{ textDecoration: "none" }}>
  <div
    className={
      UnderlineRequired
        ? "text-center parent-circular-button-div  pt-2 pb-2 m-1 "
        : "text-center parent-circular-button-div pt-2 pb-2 m-1 "
    }
    // onClick={}
    onMouseOver={() => {
      setIsHover(true);
    }}
    onMouseLeave={() => {
      setIsHover(false);
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        //   className={isHover ? "nav-cat-bg-hover" : "nav-cat-bg"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={getNavImg(nav.title)}
          alt={nav.title}
          style={{ width: "60%" }}
        />
      </span>
      <span
        style={{
          fontSize: "16px",
          color: isHover ? "" : "#000",
          fontWeight: "600",
          marginTop: "12px",
        }}
      >
        {nav.title}
      </span>
    </div>
  </div>
</Link>
</Grid> */
}
