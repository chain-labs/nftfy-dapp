import { ethers, providers } from "ethers";
import { ReactChild, useContext, useEffect, useState } from "react";
import Box from "src/components/Box";
import LabelledDateTime from "src/components/LabelledDateTime";
import LabelledInput from "src/components/LabelledInput";
import { StatesContext } from "src/components/StatesContext";
import Text from "src/components/Text";
import useCustomContract from "src/ethereum/useCustomContract";
import theme from "src/styleguide/theme";

const Divider = () => {
  return (
    <Box
      mt="1rem"
      mb="4rem"
      height="1px"
      bg={`${theme.colors["purple-black"]}20`}
    />
  );
};

const Button = ({
  children,
  disabled,
  onClick,
  bg,
  color,
}: {
  disabled?: any;
  onClick?: any;
  bg?: string;
  color?: string;
  children: React.ReactNode;
}) => {
  return (
    <Box
      as="button"
      color={color ?? "black"}
      cursor="pointer"
      px="2rem"
      py="1rem"
      bg={bg ?? "accent-green"}
      border="none"
      borderRadius="4px"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

const AdminComp = ({ contractAddress }: { contractAddress: string }) => {
  const [publicSaleTimestamp, setPublicSaleTimestamp] = useState(0);
  const [releaseAmount, setReleaseAmount] = useState();
  const [revealTimestamp, setRevealTimestamp] = useState(0);
  const [projectURI, setProjectURI] = useState<String>("");
  const [numberOfReserveTokens, setNumberOfReserveTokens] = useState();
  const [addressToTransfer, setAddressToTransfer] = useState<String>("");
  const [balance, setBalance] = useState("");
  const [tokenIDToTransfer, setTokenIDToTransfer] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [totalReleased, setTotalReleased] = useState(0);

  const state = useContext(StatesContext);

  const contract = useCustomContract(
    "Collection",
    contractAddress,
    state.provider
  );

  useEffect(() => {
    const getPendingPayment = async () => {
      const res = await contract?.callStatic?.pendingPayment(
        await state.signer.getAddress()
      );
      return res;
    };
    const getPendingPaymentInETH = async () => {
      const balance = await getPendingPayment();
      try {
        const balanceInETH = ethers.utils.formatUnits(balance, 18);
        setBalance(balanceInETH);
      } catch (err) {
        console.log(err);
      }
    };
    const getTransferTokenID = async () => {
      try {
        const res = await contract?.callStatic?.reserveTokenCounter();

        const tokenID = parseInt(ethers.utils.formatUnits(res, 0)) + 1;
        setTokenIDToTransfer(tokenID);
      } catch (err) {
        // console.log(err);
      }
    };

    const getContractBalance = async () => {
      try {
        const res = await state.provider.getBalance(contractAddress);
        const balance = parseFloat(ethers.utils.formatUnits(res, 18));
        setContractBalance(balance);
      } catch (err) {}
    };

    const getTotalReleased = async () => {
      try {
        const res = await contract?.callStatic?.totalReleased();
        const totalReleased = parseFloat(ethers.utils.formatUnits(res, 18));
        setTotalReleased(totalReleased);
      } catch (err) {}
    };

    getContractBalance();
    getTotalReleased();
    getPendingPaymentInETH();
    getTransferTokenID();
  });

  const handlePublicSaleTimestampUpdate = async () => {
    const res = await contract
      .connect(state.signer)
      .setPublicSaleStartTime(publicSaleTimestamp);
  };

  const handlePause = async () => {
    const res = await contract.connect(state.signer).pause();
    const events = await res.wait().events;
    console.log({ events });
  };
  const handleUnpause = async () => {
    const res = await contract.connect(state.signer).unpause();
    const events = await res.wait().events;
    console.log({ events });
  };

  const handleRelease = async () => {
    const res = await contract.connect(state.signer).release(releaseAmount);
    console.log({ res });
  };

  const handleSetRevealTime = async () => {
    const res = await contract
      .connect(state.signer)
      .setRevealAfterTimestamp(revealTimestamp);
    console.log({ res });
  };

  const handleSetProjectURI = async () => {
    const res = await contract.connect(state.signer).setProjectURI(projectURI);
    console.log({ res });
  };

  const handleSetReserveTokens = async () => {
    const res = await contract
      .connect(state.signer)
      .reserveTokens(numberOfReserveTokens);
    console.log({ res });
  };

  const handleTransferTokens = async () => {
    const res = await contract
      .connect(state.signer)
      .transferReservedToken(addressToTransfer);
    console.log({ res });
  };

  return (
    <Box pt="12rem" px="8rem" pb="4rem">
      <Text fontSize="5.6rem" fontWeight="bold">
        Admin Dashboard
      </Text>
      <Text fontSize="1.6rem" color="grey" fontWeight="thin">
        Contract Address: {contractAddress}
      </Text>
      <Box mt="4rem">
        <Text fontSize="4rem" fontWeight="medium">
          Base Collection
        </Text>
        <Divider />
        <Box row alignItems="center">
          <LabelledDateTime
            label="Public Sale Start Time"
            set={setPublicSaleTimestamp}
            data={publicSaleTimestamp}
          />
          <Box ml="4rem">
            <Button
              disabled={!publicSaleTimestamp || publicSaleTimestamp < 0}
              onClick={handlePublicSaleTimestampUpdate}
            >
              Update
            </Button>
          </Box>
        </Box>
        <Box row>
          <Box mr="2rem">
            <Button bg="primary-red" color="white" onClick={handlePause}>
              Pause
            </Button>
          </Box>
          <Button onClick={handleUnpause}>Unpause</Button>
        </Box>
      </Box>
      <Box mt="4rem">
        <Text fontSize="4rem" fontWeight="medium">
          Payment Splittable
        </Text>
        <Divider />
        <Text fontSize="2rem" fontWeight="bold">
          Total Earnings: {totalReleased + contractBalance} ETH
        </Text>
        <Box row alignItems="center">
          <LabelledInput
            label="Amount to Release (in ETH)"
            set={setReleaseAmount}
            data={releaseAmount}
          />
          <Box ml="4rem">
            <Button onClick={handleRelease}>Release</Button>
          </Box>
        </Box>
        <Text fontSize="1.2rem" fontWeight="regular" row>
          Maximum Release Amount:
          <Text
            fontSize="1.2rem"
            fontWeight="bold"
            ml="1rem"
          >{`${balance} ETH`}</Text>
        </Text>
      </Box>
      <Box mt="4rem">
        <Text fontSize="4rem" fontWeight="medium">
          Revealable
        </Text>
        <Divider />
        <Box row alignItems="center">
          <LabelledDateTime
            label="Set Reveal Time"
            set={setRevealTimestamp}
            data={revealTimestamp}
          />
          <Box ml="4rem">
            <Button
              disabled={!revealTimestamp || revealTimestamp < 0}
              onClick={handleSetRevealTime}
            >
              Update
            </Button>
          </Box>
        </Box>
        <Box row alignItems="center">
          <LabelledInput
            label="Project URI"
            set={setProjectURI}
            data={projectURI}
          />
          <Box ml="4rem">
            <Button
              disabled={projectURI.length === 0}
              onClick={handleSetProjectURI}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
      <Box mt="4rem">
        <Text fontSize="4rem" fontWeight="medium">
          Reservable
        </Text>
        <Divider />
        <Box row alignItems="center">
          <LabelledInput
            label="Number of Tokens to Reserve"
            set={setNumberOfReserveTokens}
            data={numberOfReserveTokens}
          />
          <Box ml="4rem">
            <Button onClick={handleSetReserveTokens}>Set</Button>
          </Box>
        </Box>
        <Box row alignItems="center">
          <LabelledInput
            label="Transfer Tokens to address"
            set={setAddressToTransfer}
            data={addressToTransfer}
          />
          <Box ml="4rem">
            <Button
              disabled={addressToTransfer.length === 0}
              onClick={handleTransferTokens}
            >
              Transfer
            </Button>
          </Box>
        </Box>
        <Text fontSize="1.2rem" fontWeight="medium" row>
          Token ID to transfer:
          <Text fontSize="1.2rem" fontWeight="bold" ml="0.8rem">
            {tokenIDToTransfer}
          </Text>
        </Text>
      </Box>
    </Box>
  );
};

export default AdminComp;
