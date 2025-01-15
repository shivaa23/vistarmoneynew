import React from "react";
import { useEffect } from "react";
import { decodeFareRule } from "../../utils/FlightUtil";
import { useState } from "react";
import { useMemo } from "react";

const FareDetailRulesTab = ({ data }) => {
  const [fareRules, setFareRules] = useState();

  useEffect(() => {
    const d = decodeFareRule(data.FareRule);
    setFareRules(d);
    return () => {};
  }, [data]);

  const fareComponent = useMemo(() => {
    return (
      <div style={{ padding: "15px 0" }}>
        {/*fare detail start */}
        <div class="fare-deta-sec" id="fr0">
          <div class="row no-margn mar-to-12">
            <div class="col-md-3 col-sm-12 border-b2">
              {/* passender details row */}
              <div class="hz3 border-bot4 d-flex justify-content-between">
                <div class="fon12 fw">1 x Adult</div>
                <div class="txt-al-rt">
                  <span class="fa blacknew_Rs padd-rit3"></span>
                  <span
                    ng-bind="CurrencyDisplayRate(fm.bscFre)"
                    class="fon12 ng-binding"
                  >
                    4022
                  </span>
                </div>
              </div>

              {/* fare details row */}
              <div class="hz3 border-bot4 d-flex justify-content-between">
                <div class="fon12">
                  <strong>Total (Base Fare)</strong>{" "}
                </div>
                <div class="txt-al-rt">
                  <span class="fa blacknew_Rs padd-rit3"></span>
                  <span
                    ng-bind="CurrencyDisplayRate(TotalBaseFair)"
                    class="fon12 ng-binding"
                  >
                    {data?.Fare?.BasicFare}
                  </span>
                </div>
              </div>
            </div>

            {/* ##################################################### */}
            {/* second column --------------------------------------- */}
            {/* ##################################################### */}
            <div class="col-md-9 col-sm-12 pad-0 pad-btmm">
              <div class="bood mg-btm">
                <div class="row">
                  <div class="col-md-6 col-sm-6 pad-top-bot txt-d4 txt-c">
                    Fare Rules
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 hei txt-c mg-btm m-10">
                    <div
                      class="nonRefund ng-binding ng-scope"
                      ng-bind="Refundable"
                      ng-if="RF_Fare==false"
                    >
                      Non-Refundable
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12" id="newFareRule">
                    {/*Cancel new panel*/}
                    <div class="fareRuls">
                      <table width="100%" rules="all" border="1">
                        <tbody>
                          <tr>
                            <th>
                              <p class="frtbl_hd">Time Frame to cancel</p>
                              <p class="frtbl_sml">
                                Before scheduled departure time
                              </p>
                            </th>
                            <th>
                              <p class="frtbl_hd">Airline Fees</p>
                              <p class="frtbl_sml">per passenger</p>
                            </th>
                            <th>
                              <p class="frtbl_hd ng-binding">EMT Fees</p>
                              <p class="frtbl_sml">per passenger</p>
                            </th>
                          </tr>
                          {fareRules &&
                            fareRules["CANCEL-BEF"]?.length > 0 &&
                            fareRules["CANCEL-BEF"].map((item, index) => {
                              return (
                                <tr
                                  ng-repeat="lc in CanLCPOBJ.LCP"
                                  class="ng-scope"
                                >
                                  <td ng-bind="lc.CD" class="ng-binding">
                                    {item.message}
                                  </td>
                                  <td>
                                    <span class="frl_rs blacknew_Rs"></span>
                                    <span
                                      ng-bind="CurrencyDisplayRate(lc.CP)"
                                      class="ng-binding"
                                    >
                                      {item.charge}
                                    </span>
                                  </td>
                                  <td>
                                    <span class="frl_rs blacknew_Rs"></span>
                                    <span
                                      ng-bind="CurrencyDisplayRate(EmtServiceFee)"
                                      class="ng-binding"
                                    >
                                      {fareRules["EMTFee"]}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    {/*Cancel new panel end*/}
                    {/*reschedule new panel*/}
                    <div class="fareRuls">
                      <table
                        width="100%"
                        rules="all"
                        border="1"
                        style={{ border: "1px solid #ddd" }}
                      >
                        <tbody>
                          <tr>
                            <th>
                              <p class="frtbl_hd">Time Frame to reschedule</p>
                              <p class="frtbl_sml">
                                Before scheduled departure time
                              </p>
                            </th>
                            <th>
                              <p class="frtbl_hd">Airline Fees</p>
                              <p class="frtbl_sml">per passenger</p>
                            </th>
                            <th>
                              <p class="frtbl_hd ng-binding">EMT Fees</p>
                              <p class="frtbl_sml">per passenger</p>
                            </th>
                          </tr>
                          {/* ngRepeat: lc in CanLCPOBJ.LCP */}
                          {fareRules &&
                            fareRules["CHANGE-BEF"]?.length > 0 &&
                            fareRules["CHANGE-BEF"].map((item, index) => {
                              return (
                                <tr
                                  ng-repeat="lc in CanLCPOBJ.LCP"
                                  class="ng-scope"
                                >
                                  <td ng-bind="lc.RD" class="ng-binding">
                                    {item.message}
                                  </td>
                                  <td class="ng-binding">
                                    <span class="frl_rs blacknew_Rs"></span>
                                    {item.charge}
                                  </td>
                                  <td class="ng-binding">
                                    <span class="frl_rs blacknew_Rs"></span>{" "}
                                    {fareRules["EMTFee"]}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    {/*reschedule new panel end*/}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12 terms-h">
                    Terms &amp; Conditions
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="terms mar10">
                      <ul style={{ display: "none" }}>
                        {/*li>Penalty is subject to 4 hours prior to departure and no changes are allowed after that.</li*/}
                        <li>The charges will be on per passenger per sector</li>
                        <li>
                          Rescheduling Charges = Rescheduling/Change Penalty +
                          Fare Difference (if applicable)
                        </li>
                        <li>
                          Partial cancellation is not allowed on the flight
                          tickets which are book under special discounted fares
                        </li>
                        <li>
                          In case, the customer have not cancelled the ticket
                          within the stipulated time or no show then only
                          statutory taxes are refundable from the respective
                          airlines
                        </li>
                        <li>For infants there is no baggage allowance</li>
                        <li>
                          In certain situations of restricted cases, no
                          amendments and cancellation is allowed
                        </li>
                        <li>
                          Penalty from airlines needs to be reconfirmed before
                          any cancellation or amendments
                        </li>
                        <li>
                          Penalty changes in airline are indicative and can be
                          changed without any prior notice
                        </li>
                      </ul>
                      <ul>
                        <li class="ng-binding">
                          Total Rescheduling Charges Airlines Rescheduling fees
                          Fare Difference if applicable + EMT Fees.
                        </li>
                        <li>
                          The airline cancel reschedule fees is indicative and
                          can be changed without any prior notice by the
                          airlines..
                        </li>
                        <li>
                          EaseMyTrip does not guarantee the accuracy of cancel
                          reschedule fees.
                        </li>
                        <li>
                          Partial cancellation is not allowed on the flight
                          tickets which are book under special round trip
                          discounted fares.
                        </li>
                        <li>
                          Airlines doesnt allow any additional baggage allowance
                          for any infant added in the booking
                        </li>
                        <li>
                          In certain situations of restricted cases, no
                          amendments and cancellation is allowed
                        </li>
                        <li>
                          Airlines cancel reschedule should be reconfirmed
                          before requesting for a cancellation or amendment
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [data?.Fare?.BasicFare, fareRules]);

  return <>{fareComponent}</>;
};

export default FareDetailRulesTab;
