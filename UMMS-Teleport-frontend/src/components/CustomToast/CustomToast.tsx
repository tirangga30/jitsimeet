import toast from "react-hot-toast";
import { IconWrapper, Message, ToastContainer } from "./CustomToast.styles";
import successIcon from "../../assets/icons/tick.png";

export const CustomToast = (message: string) => {
  toast.custom(
    () => (
      <ToastContainer>
        <IconWrapper>
          <img src={successIcon} alt="success" />
        </IconWrapper>

        <Message>{message}</Message>
      </ToastContainer>
    ),
    {
      duration: 3000,
      position: "top-center",
      id: "success-toast",
    },
  );
};
