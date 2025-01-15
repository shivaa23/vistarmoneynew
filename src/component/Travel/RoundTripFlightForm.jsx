import React from "react";

const RoundTripFlightForm = () => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="search-pan row mx-0 theme-border-radius">
          <div className="col-12 col-lg-4 col-xl-2 ps-0 mb-2 mb-xl-0 pe-0 pe-lg-2">
            <div className="form-group">
              <label for="exampleDataList1" className="form-label">
                Depart From
              </label>
              <input
                className="form-control"
                list="datalistOptions3"
                id="exampleDataList1"
                placeholder="New Delhi"
              />
              <datalist id="datalistOptions3">
                <option value="San Francisco"></option>
                <option value="New York"></option>
                <option value="Seattle"></option>
                <option value="Los Angeles"></option>
                <option value="Chicago"></option>
              </datalist>
            </div>
          </div>
          <div className="col-12 col-lg-4 col-xl-2 ps-0 mb-2 mb-xl-0 pe-0 pe-lg-2">
            <div className="form-group">
              <label for="exampleDataList3" className="form-label">
                Arrival To
              </label>
              <input
                className="form-control"
                list="datalistOptions4"
                id="exampleDataList3"
                placeholder="London"
              />
              <datalist id="datalistOptions4">
                <option value="San Francisco"></option>
                <option value="New York"></option>
                <option value="Seattle"></option>
                <option value="Los Angeles"></option>
                <option value="Chicago"></option>
              </datalist>
            </div>
          </div>
          <div className="col-12 col-lg-4 col-xl-3 ps-0 mb-2 mb-xl-0 pe-0 pe-lg-0 pe-xl-2">
            <div className="form-group">
              <label className="form-label">
                Departure Date - Arrival Date
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Wed 2 Mar  -  Fri 11 Apr"
              />
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-3 ps-0 mb-2 mb-lg-0 mb-xl-0 pe-0 pe-lg-2">
            <div className="form-group border-0">
              <label className="form-label">Traveller's </label>
              <div className="dropdown" id="myDD2">
                <button
                  className="dropdown-toggle form-control"
                  type="button"
                  id="travellerInfoOneway51"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="text-truncate">
                    2 adults - 1 childeren - 1 Infants
                  </span>
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="travellerInfoOneway51"
                >
                  <ul className="drop-rest">
                    <li>
                      <div className="d-flex small">Adults</div>
                      <div className="ms-auto input-group plus-minus-input">
                        <div className="input-group-button">
                          <button
                            type="button"
                            className="circle"
                            data-quantity="minus"
                            data-field="onewayAdult"
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                        </div>
                        <input
                          className="input-group-field"
                          type="number"
                          name="onewayAdult"
                          value="0"
                        />
                        <div className="input-group-button">
                          <button
                            type="button"
                            className="circle"
                            data-quantity="plus"
                            data-field="onewayAdult"
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex small">Child</div>
                      <div className="ms-auto input-group plus-minus-input">
                        <div className="input-group-button">
                          <button
                            type="button"
                            className="circle"
                            data-quantity="minus"
                            data-field="onewayChild"
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                        </div>
                        <input
                          className="input-group-field"
                          type="number"
                          name="onewayChild"
                          value="0"
                        />
                        <div className="input-group-button">
                          <button
                            type="button"
                            className="circle"
                            data-quantity="plus"
                            data-field="onewayChild"
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex small">Infants</div>
                      <div className="ms-auto input-group plus-minus-input">
                        <div className="input-group-button">
                          <button
                            type="button"
                            className="circle"
                            data-quantity="minus"
                            data-field="onewayInfant"
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                        </div>
                        <input
                          className="input-group-field"
                          type="number"
                          name="onewayInfant"
                          value="0"
                        />
                        <div className="input-group-button">
                          <button
                            type="button"
                            className="circle"
                            data-quantity="plus"
                            data-field="onewayInfant"
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xl-2 px-0">
            <button
              type="submit"
              className="btn btn-search"
              onclick="window.location.href='#';"
            >
              <span className="fw-bold">
                <i className="bi bi-search me-2"></i>Search
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTripFlightForm;
