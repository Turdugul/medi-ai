import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (type, message) => {
  const options = { autoClose: 3000, position: "bottom-right" }; 

  switch (type) {
    case "success":
      toast.success(` ${message}`, options);
      break;
    case "error":
      toast.error(` ${message}`, options);
      break;
    case "info":
      toast.info(` ${message}`, options);
      break;
    default:
      toast(message, options); 
  }
};
