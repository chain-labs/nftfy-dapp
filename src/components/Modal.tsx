import { useEffect } from "react";
import theme from "src/styleguide/theme";
import Box from "./Box";

const Modal = ({ children }) => {
  useEffect(() => {
    return () => {
      document.querySelector("html").style.overflow = "scroll";
    };
  }, []);
  return (
    <Box
      position="fixed"
      bg={`${theme.colors["purple-black"]}40`}
      top="0"
      left="0"
      height="100vh"
      width="100vw"
      overflowY="scroll"
      pb="15rem"
      zIndex={15}
    >
      <Box
        // height="50rem"
        width="80rem"
        bg="white"
        borderRadius="8px"
        margin="auto"
        mt="12rem"
        py="2.8rem"
        px="4rem"
      >
        {children}
      </Box>
    </Box>
  );
};

export default Modal;
