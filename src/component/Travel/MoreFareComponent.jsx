import React from "react";

const MoreFareComponent = () => {
  return (
    <>
      <div className="corulmain morefarediv" id="frOption0">
        <div className="dmflex">
          <MoreFareCard />
          <MoreFareCard />
        </div>
      </div>
    </>
  );
};

export default MoreFareComponent;

function MoreFareCard() {
  return (
    <div className="corboxuli">
      <label className="container-heduredi">
        <div className="hedule">Comfort</div>
        <div className="heduredi">
          <div className="clr"></div>
          <div className="nw-far-oth">
            <input type="radio" id="fr10" name="fr1" />
            <span className="checkmark-heduredi"></span>
            <div className="crossmn"></div>
            <div className="price-tbe">
              {/* <span className="reuinrli blacknew_Rs"></span> */}
              <span className="pricr-nerw exPrc">&nbsp; ₹ 4791</span>
            </div>
          </div>
        </div>

        <ul
          style={{
            textAlign: "left",
          }}
        >
          <li>
            <i className="tickicon"></i>
            <span className="fremrtxt">Cabin baggage included</span>
          </li>
          <li>
            <i className="tickicon"></i>
            <span className="fremrtxt">Check-in baggage included</span>
          </li>
          <li>
            <i className="tickicon"></i>
            <span className="fremrtxt">Non refundable</span>
          </li>
          <li>
            <i className="tickicon"></i>
            <span className="fremrtxt">Date change fees apply</span>
          </li>
        </ul>
      </label>
    </div>
  );
}
