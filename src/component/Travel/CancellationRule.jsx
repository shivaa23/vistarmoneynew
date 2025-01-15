import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { decodeFareRule } from "../../utils/FlightUtil";
import { useMemo } from "react";

const CancellationRule = ({ data }) => {
  const [cancelRules, setCancelRules] = useState();

  useEffect(() => {
    const d = decodeFareRule(data.FareRule);
    setCancelRules(d);
    return () => {};
  }, [data]);

  const cancellationComponent = useMemo(() => {
    return (
      <div style={{ padding: "15px 0" }}>
        <div class="col-md-12 col-md-offset-2 col-sm-12 pad-0 pad-btmm">
          <div class="bood mg-btm">
            <div class="row">
              <div class="col-md-6 col-sm-6 pad-top-bot txt-d4 txt-c">
                Fare Rules
              </div>
              <div class="col-md-6 col-sm-6 col-xs-12 hei txt-c mg-btm m-10">
                <div>Non-Refundable</div>
              </div>
            </div>
            <div class="row">
              <div
                class="col-md-12"
                style={{ display: "block" }}
                id="newFareRule"
              >
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
                          <p class="frtbl_hd">EMT Fees</p>
                          <p class="frtbl_sml">per passenger</p>
                        </th>
                      </tr>
                      {cancelRules &&
                        cancelRules["CANCEL-BEF"]?.length > 0 &&
                        cancelRules["CANCEL-BEF"].map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.message}</td>
                              <td>
                                <span class="frl_rs blacknew_Rs"></span>
                                <span>{item.charge}</span>
                              </td>
                              <td>
                                <span class="frl_rs blacknew_Rs"></span>
                                <span>{cancelRules["EMTFee"]}</span>
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
                          <p class="frtbl_hd">EMT Fees</p>
                          <p class="frtbl_sml">per passenger</p>
                        </th>
                      </tr>
                      {cancelRules &&
                        cancelRules["CHANGE-BEF"]?.length > 0 &&
                        cancelRules["CHANGE-BEF"].map((item, index) => {
                          return (
                            <tr index={index}>
                              <td>{item.message}</td>
                              <td>
                                <span class="frl_rs blacknew_Rs"></span>
                                <span>{item.charge}</span>
                              </td>
                              <td>
                                <span class="frl_rs blacknew_Rs"></span>
                                <span>{cancelRules["EMTFee"]}</span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
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
                      Rescheduling Charges = Rescheduling/Change Penalty + Fare
                      Difference (if applicable)
                    </li>
                    <li>
                      Partial cancellation is not allowed on the flight tickets
                      which are book under special discounted fares
                    </li>
                    <li>
                      In case, the customer have not cancelled the ticket within
                      the stipulated time or no show then only statutory taxes
                      are refundable from the respective airlines
                    </li>
                    <li>For infants there is no baggage allowance</li>
                    <li>
                      In certain situations of restricted cases, no amendments
                      and cancellation is allowed
                    </li>
                    <li>
                      Penalty from airlines needs to be reconfirmed before any
                      cancellation or amendments
                    </li>
                    <li>
                      Penalty changes in airline are indicative and can be
                      changed without any prior notice
                    </li>
                  </ul>
                  <ul>
                    <li>
                      Total Rescheduling Charges Airlines Rescheduling fees Fare
                      Difference if applicable + EMT Fees.
                    </li>
                    <li>
                      The airline cancel reschedule fees is indicative and can
                      be changed without any prior notice by the airlines..
                    </li>
                    <li>
                      EaseMyTrip does not guarantee the accuracy of cancel
                      reschedule fees.
                    </li>
                    <li>
                      Partial cancellation is not allowed on the flight tickets
                      which are book under special round trip discounted fares.
                    </li>
                    <li>
                      Airlines doesnt allow any additional baggage allowance for
                      any infant added in the booking
                    </li>
                    <li>
                      In certain situations of restricted cases, no amendments
                      and cancellation is allowed
                    </li>
                    <li>
                      Airlines cancel reschedule should be reconfirmed before
                      requesting for a cancellation or amendment
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [cancelRules]);

  // ##########################################
  // ---------------- RETURN -----------------
  // ##########################################
  return <>{cancellationComponent}</>;
};

export default CancellationRule;
