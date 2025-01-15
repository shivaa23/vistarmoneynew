export const primaryColor = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return "#FC4A1A ";
  }
};
export const primaryLight = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return "#00693E";
  }
};
export const primaryLightest = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return "#baa7d1";
  }
};
export const secondaryColor = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return "#004792";
  }
};

export const getHoverActive = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return "#231942";
  }
};
export const getHoverInActive = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return "#4045A1";
  }
};

export const getTableHeadRowColor = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return "#4CAF50";
  }
};

export const getEnv = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return "DilliPay";
  }
};
export const blackColor = () => {
  return "#1a1a1a";
};
export const whiteColor = () => {
  return "#f5f5f5";
};

// user icon bg color change functions . . . .
export const getUserColor = (role) => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    if (role === "Asm") {
      return "#1C2E46";
    } else if (role === "ZSM") {
      return "#FFC0CB";
    } else if (role === "Ad") {
      return "#16BA75";
    } else if (role === "Md") {
      return "#beb83a";
    } else if (role === "Ret") {
      return "#f48f26";
    } else if (role === "Dd") {
      return "#4F46E5";
    } else if (role === "Api") {
      return "#FF3B30";
    }
  } else if (process.env.REACT_APP_TITLE === "PaisaKart") {
    if (role === "Asm") {
      return "#f48f26";
    } else if (role === "Ad") {
      return "#3f3f3f";
    } else if (role === "Ret") {
      return "#dc5f5f";
    } else if (role === "Dd") {
      return "#0437F2";
    } else if (role === "Api") {
      return "#ff9800";
    }
  } else if (process.env.REACT_APP_TITLE === "MoneyOddr") {
    if (role === "Asm") {
      return "#f48f26";
    } else if (role === "Ad") {
      return "#3f3f3f";
    } else if (role === "Ret") {
      return "#dc5f5f";
    } else if (role === "Dd") {
      return "#00BF78";
    } else if (role === "Api") {
      return "#ff9800";
    }
  }
};

export const randomColors = () => {
  // Array containing both light and dark colors
  var colors = [
    // "rgba(255, 99, 132, 0.2)",  // Light red
    // "rgba(54, 162, 235, 0.2)",  // Light blue
    // "rgba(255, 206, 86, 0.2)",  // Light yellow
    // "rgba(75, 192, 192, 0.2)",  // Light teal
    // "rgba(153, 102, 255, 0.2)", // Light purple
    "rgba(255, 99, 132, 0.8)", // Dark red
    "rgba(54, 162, 235, 0.8)", // Dark blue
    "rgba(255, 206, 86, 0.8)", // Dark yellow
    "rgba(75, 192, 192, 0.8)", // Dark teal
    "rgba(153, 102, 255, 0.8)", // Dark purple
  ];

  // Selecting random color
  var random_color = colors[Math.floor(Math.random() * colors.length)];
  return random_color;
};

export const getStatusColor = (status) => {
  const st = status?.toLowerCase();
  if (st === "total") {
    return "#4045A1";
  }
  if (st === "success" || st === "paid") {
    return "#00bf78";
  }
  if (st === "pending" || st === "post") {
    return "#FFCC56";
  }
  if (st === "failed") {
    return "#DC5F5F";
  }
  if (st === "refund") {
    return "#9F86C0";
  } else {
    return "#DC5F5F";
  }
};

export const getFirmAddress = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return `Plot No.5 , Second Floor ,Pocket-5, Rohini Sector 24, New Delhi 110085`;
  }
};
export const getFirmContact = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return `+91 9355128199`;
  }
};
export const getFirmEmail = () => {
  if (process.env.REACT_APP_TITLE === "DilliPay") {
    return `support@dillipay.com`;
  }
};

export const getPriorityBg = (priority) => {
  if (priority === "HIGH") {
    return "#f98f90";
  }
  if (priority === "MEDIUM") {
    return "#fbd288";
  }
  if (priority === "LOW") {
    return "#fbd48d";
  }
};
export const getPriorityColor = (priority) => {
  if (priority === "HIGH") {
    return "#440304";
  }
  if (priority === "MEDIUM") {
    return "#ae3e07";
  }
  if (priority === "LOW") {
    return "#452d02";
  }
};
