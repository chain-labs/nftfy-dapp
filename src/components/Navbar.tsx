import { useContext, useEffect, useState } from "react";
import Box from "components/Box";
import Container from "components/Container";
import Text from "components/Text";
import If from "components/If";
import { gsap } from "gsap";
import useEthers from "src/ethereum/useEthers";
import useListeners from "src/ethereum/useListeners";
import useSigner from "src/ethereum/useSigner";
import { StatesContext } from "./StatesContext";

const Navbar = () => {
  const [provider, setProvider, ethers, requestAccount] = useEthers();
  const [signer, setSigner] = useSigner(provider);
  const [address, setAddress] = useState<string>("");
  const state = useContext(StatesContext);

  useListeners(provider, setProvider, setSigner);

  useEffect(() => {
    state.setProvider(provider);
    state.setSigner(signer);
    const getAddress = async () => {
      try {
        const address = await signer?.getAddress();
        setAddress(address);
      } catch (err) {
        console.log(err);
      }
    };
    getAddress();
  }, [signer, provider]);

  return (
    <Box
      row
      justifyContent="flex-end"
      position="absolute"
      px="8rem"
      width="100%"
    >
      <Box
        as="button"
        px="2rem"
        py="1rem"
        bg="white"
        borderColor="primary-blue"
        border="2px solid"
        borderRadius="4px"
        cursor="pointer"
        fontFamily="inherit"
        onClick={() => requestAccount()}
      >
        {address ? `Connected to ${address}` : "Connect Wallet"}
      </Box>
    </Box>
  );
};

export default Navbar;
