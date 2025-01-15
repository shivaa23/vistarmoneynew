import React from "react";
import { AirIndia } from "../../iconsImports";

const BaggageInfoTab = ({ legs }) => {
  return (
    <div>
      <BaggageInfoCard />
    </div>
  );
};

export default BaggageInfoTab;
function BaggageInfoCard({ data }) {
  return (
    <>
      <div
        className="baggage-info ng-scope"
        id="bg0"
        style={{ padding: "15px 0" }}
      >
        <div className="row"></div>
        <div className="baggagerule mgt15">
          <table width="100%" rules="all" border="1">
            <tbody>
              <tr>
                <th>
                  <p className="frtbl_hd">Airline</p>
                </th>
                <th>
                  <p className="frtbl_hd">Check-in Baggage</p>
                </th>
                <th>
                  <p className="frtbl_hd">Cabin Baggage</p>
                </th>
              </tr>
              {/* ngRepeat: baggage in BaggageModel */}
              <tr ng-repeat="baggage in BaggageModel" className="ng-scope">
                <td>
                  <div
                    className="flgi-l"
                    style={{
                      float: "left",
                      width: "32px",
                      marginRight: "10px",
                    }}
                  >
                    <img alt="Flight" src={AirIndia} />
                  </div>
                  <div style={{ float: "left", fontSize: "11px" }}>
                    <p
                      ng-bind="baggage.segDTL | split:'|':0"
                      className="ng-binding"
                    >
                      Air India
                    </p>
                    <p className="ng-binding">AI- 620</p>
                  </div>
                </td>
                <td className="ng-binding">20kgs</td>
                {/* ngIf: (baggage.segDTL | split:'|':1)!='9I' */}
                <td
                  ng-if="(baggage.segDTL | split:'|':1)!='9I'"
                  className="ng-binding ng-scope"
                >
                  7kg
                </td>
                {/* end ngIf: (baggage.segDTL | split:'|':1)!='9I' */}
                {/* ngIf: (baggage.segDTL | split:'|':1)=='9I' */}
              </tr>
              {/* end ngRepeat: baggage in BaggageModel */}
              <tr>
                <td colspan="3">
                  <div className="termsbagg">
                    <ul>
                      <li>
                        Baggage information mentioned above is obtained from
                        airline's reservation system, EaseMyTrip does not
                        guarantee the accuracy of this information.
                      </li>
                      <li>
                        The baggage allowance may vary according to stop-overs,
                        connecting flights. changes in airline rules. etc.
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="row bord-bot5 no-margn mar-to-12"
          style={{ display: "none" }}
        >
          <div className="col-md-3 col-sm-3 col-xs-4 fon13">Airline</div>
          <div className="col-md-3 col-sm-3 col-xs-4 pad-0 fon13">
            Check-in Baggage
          </div>
          <div className="col-md-3 col-sm-3 col-xs-4 fon13">Cabin Baggage</div>
        </div>
        {/* ngRepeat: baggage in BaggageModel */}
        <div
          className="row mar-to-12 no-margn mar-btm ng-scope"
          ng-repeat="baggage in BaggageModel"
          style={{ display: "none" }}
        >
          <div className="col-md-3 col-sm-3 col-xs-4 pad-0 mg-btm mr-tp">
            <div className="col-md-2 col-sm-2 col-xs-12 txt-c airl_sectn ">
              <div className="flgi-l">
                <img alt="Flight" src={AirIndia} />
              </div>
            </div>
            <div className="col-md-9 col-sm-9 pad-lft0 hidden-xs">
              <span
                className="fon11 ng-binding"
                ng-bind="baggage.segDTL | split:'|':0"
              >
                Air India
              </span>
              <br />
              <span
                className="fon11 ng-binding"
                ng-bind="baggage.segDTL | split:'|':1"
              >
                AI
              </span>
              -
              <span
                className="fon11 ng-binding"
                ng-bind="baggage.segDTL | split:'|':2"
              >
                620
              </span>
            </div>
          </div>
          {/*  */}
          <div className="col-md-3 col-xs-4 col-sm-3 pad-0 fon11 mr-tp">
            <strong>
              <span ng-bind="baggage.pxType" className="ng-binding"></span>
            </strong>
            <span ng-bind="baggage.baggWeight" className="ng-binding">
              20
            </span>
            <span ng-bind="baggage.baggUnit | lowercase" className="ng-binding">
              kgs
            </span>
          </div>
          <div className="col-md-3 col-sm-3 col-xs-4 fon11 mr-tp">
            <strong>
              <span ng-bind="baggage.pxType" className="ng-binding"></span>
            </strong>
            <span className="ng-binding">7kg</span>
          </div>
        </div>
      </div>
    </>
  );
}
