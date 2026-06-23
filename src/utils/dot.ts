export const defineDotState = (status: Business["status"]) => {
  switch (status) {
    case "active":
      return "green";
    case "inactive":
      return "black";
    case "suspended":
      return "yellow";
  }
};

export const defineProductDotState = (status: ProductStatusValue) => {
  switch (status) {
    case "available":
      return "green";
    case "low":
      return "yellow";
    case "outOfStock":
      return "red";
    case "suspended":
      return "black";
  }
};
