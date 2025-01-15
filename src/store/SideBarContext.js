import React from "react";

const SideBarContext = React.createContext({
  actIndex: 0,
  setActiveIndex: (val) => {},
});

export const SideBarContextProvider = (props) => {
  const inititalIndex = localStorage.getItem("index");
  const inititalSubIndex = localStorage.getItem("subIndex");
  const [actIndex, setActIndex] = React.useState({
    index: inititalIndex,
    subIndex: inititalSubIndex,
  });

  const indexHandler = (index, subIndex = -1) => {
    setActIndex({
      index: index,
      subIndex: subIndex,
    });
    localStorage.setItem("index", index);
    localStorage.setItem("subIndex", subIndex);
  };
  const contextValue = {
    actIndex: actIndex,
    setActiveIndex: indexHandler,
  };

  return (
    <SideBarContext.Provider value={contextValue}>
      {props.children}
    </SideBarContext.Provider>
  );
};

export default SideBarContext;
