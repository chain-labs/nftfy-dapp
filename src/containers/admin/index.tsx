import { ethers, providers } from "ethers";
import { ReactChild, useContext, useEffect, useState } from "react";
import Box from "src/components/Box";
import Modal from "src/components/Modal";
import LabelledDateTime from "src/components/LabelledDateTime";
import LabelledInput from "src/components/LabelledInput";
import { StatesContext } from "src/components/StatesContext";
import Text from "src/components/Text";
import useCustomContract from "src/ethereum/useCustomContract";
import theme from "src/styleguide/theme";
import If from "src/components/If";

const SENTINEL_ADDRESS = "0x0000000000000000000000000000000000000001";

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
  const [presaleTimestamp, setPresaleTimestamp] = useState("");
  const [presaleWhitelists, setPresaleWhitelists] = useState([]);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(0);
  const [addWhitelistModal, setAddWhitelistModal] = useState(false);
  const [presaleWhitelistAdd, setPresaleWhitelistAdd] = useState([]);

  const [whitelist, setWhitelist] = useState<string>("");

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

    const getPresaleWhitelist = async () => {
      try {
        const res = await contract?.callStatic?.getPresaleWhitelists();
        setPresaleWhitelists(res);
      } catch (err) {}
    };

    getContractBalance();
    getTotalReleased();
    getPendingPaymentInETH();
    getTransferTokenID();
    getPresaleWhitelist();
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
    const releaseAmountInWei = ethers.utils
      .parseEther(releaseAmount)
      .toString();
    console.log({ releaseAmountInWei });

    const res = await contract
      .connect(state.signer)
      .release(releaseAmountInWei);
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

  const handleSetPresaleTimestamp = async () => {
    const res = await contract
      .connect(state.signer)
      .setPresaleStartTime(presaleTimestamp);
    console.log({ res });
  };

  const handleTransferTokens = async () => {
    const res = await contract
      .connect(state.signer)
      .transferReservedToken(addressToTransfer);
    console.log({ res });
  };

  const handleAddWhitelist = async () => {
    // console.log("Adding", { presaleWhitelistAdd });
    // const newWhitelist = [...presaleWhitelists, ...presaleWhitelistAdd];
    // setPresaleWhitelists(newWhitelist);
    // try {
    //   const res = await contract
    //     .connect(state.signer)
    //     .presaleWhitelistBatch(presaleWhitelistAdd);
    //   const event = await res.wait().events[0];
    //   console.log({ res, event });
    //   setAddWhitelistModal(false);
    //   setWhitelist("");
    //   setPresaleWhitelistAdd([]);
    // } catch (err) {
    //   console.log(err);
    // }
    const newWhitelist = [...presaleWhitelists, whitelist];
    setPresaleWhitelists(newWhitelist);
    try {
      const res = await contract
        ?.connect(state.signer)
        ?.addWhitelist(whitelist);
      console.log({ res });
      const event = await res.wait();
      console.log({ event });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddWhitelistBatch = async () => {
    console.log("Adding", { presaleWhitelistAdd });
    const newWhitelist = [...presaleWhitelists, ...presaleWhitelistAdd];
    setPresaleWhitelists(newWhitelist);
    try {
      const res = await contract
        .connect(state.signer)
        .presaleWhitelistBatch(presaleWhitelistAdd);
      const event = await res.wait().events[0];
      console.log({ res, event });
      setAddWhitelistModal(false);
      setWhitelist("");
      setPresaleWhitelistAdd([]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveWhitelist = async (index) => {
    const prevAddress =
      index === 0 ? SENTINEL_ADDRESS : presaleWhitelists[index - 1];
    const currentAddress = presaleWhitelists[index];
    const pw = [...presaleWhitelists];
    const newPresaleWhitelists = [...presaleWhitelists];
    newPresaleWhitelists.splice(index, 1);
    setPresaleWhitelists(newPresaleWhitelists);
    try {
      const res = await contract
        .connect(state.signer)
        .removeWhitelist(prevAddress, currentAddress);
      console.log({ res });
      setConfirmDeleteModal(0);
    } catch (err) {
      setPresaleWhitelists(pw);
      console.log({ err });
    }
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
          Presaleable
        </Text>
        <Divider />
        <Text fontSize="2rem" fontWeight="bold">
          Presale Whitelists
        </Text>
        <If
          condition={presaleWhitelists?.length === 0}
          then={
            <Box fontSize="1.6rem" fontWeight="thin">
              No Whitelists
            </Box>
          }
          else={presaleWhitelists?.map((address, index) => (
            <Box key={`${index}-${address}`} row>
              <Text fontSize="1.2rem" fontWeight="regular" minWidth="35rem">
                {`${index + 1}. ${address}`}
              </Text>
              <Box
                color="primary-red"
                fontSize="1.2rem"
                cursor="pointer"
                onClick={() => setConfirmDeleteModal(index + 1)}
                css={`
                  &:hover {
                    text-decoration: underline;
                  }
                `}
              >
                Remove
              </Box>
            </Box>
          ))}
        />
        <Box
          fontSize="1.6rem"
          as="button"
          border="none"
          bg="white"
          color="primary-blue"
          onClick={() => setAddWhitelistModal(true)}
        >
          + Add
        </Box>
        <If
          condition={addWhitelistModal}
          then={
            <Modal>
              <Box>
                <Text fontSize="2.4rem" fontWeight="bold">
                  Add Whitelist
                </Text>
                <LabelledInput
                  label="Address"
                  set={setWhitelist}
                  data={whitelist}
                />
                <Box
                  maxWidth="10rem"
                  py="1rem"
                  borderRadius="4px"
                  center
                  bg="primary-blue"
                  color="white"
                  cursor="pointer"
                  onClick={() => {
                    setPresaleWhitelistAdd([...presaleWhitelistAdd, whitelist]);
                    setWhitelist("");
                  }}
                >
                  Add
                </Box>
                {presaleWhitelistAdd?.map((address, index) => (
                  <Box key={`${index}-${address}`} row mt="1rem">
                    <Text
                      fontSize="1.2rem"
                      fontWeight="regular"
                      minWidth="35rem"
                    >
                      {`${index + 1}. ${address}`}
                    </Text>
                    <Box
                      color="primary-red"
                      fontSize="1.2rem"
                      cursor="pointer"
                      onClick={() => {
                        const p = [...presaleWhitelistAdd];
                        p.splice(index, 1);
                        console.log({ p });
                        setPresaleWhitelistAdd(p);
                      }}
                      css={`
                        &:hover {
                          text-decoration: underline;
                        }
                      `}
                    >
                      Remove
                    </Box>
                  </Box>
                ))}
                <Box row mt="2rem">
                  <Box
                    py="1rem"
                    borderRadius="4px"
                    px="3.2rem"
                    bg="primary-red"
                    color="white"
                    cursor="pointer"
                    onClick={() => setAddWhitelistModal(false)}
                  >
                    Cancel
                  </Box>
                  <Box
                    ml="2rem"
                    py="1rem"
                    borderRadius="4px"
                    px="3.2rem"
                    bg="primary-blue"
                    color="white"
                    cursor="pointer"
                    onClick={handleAddWhitelistBatch}
                  >
                    {`Add`}
                  </Box>
                </Box>
              </Box>
            </Modal>
          }
        />
        <If
          condition={confirmDeleteModal > 0}
          then={
            <Modal>
              <Box center column>
                <Text fontSize="2rem" fontWeight="regular">
                  Are you sure you want to remove this address?
                </Text>
                <Text fontSize="1.2rem" fontWeight="regular">
                  {presaleWhitelists?.[confirmDeleteModal - 1]}
                </Text>
                <Box row between mt="4rem" minWidth="20rem">
                  <Button
                    bg="primary-red"
                    color="white"
                    onClick={() => setConfirmDeleteModal(0)}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="primary-blue"
                    color="white"
                    onClick={() =>
                      handleRemoveWhitelist(confirmDeleteModal - 1)
                    }
                  >
                    Confirm
                  </Button>
                </Box>
              </Box>
            </Modal>
          }
        />
        <Box row alignItems="center" mt="2rem">
          <LabelledDateTime
            label="Set Presale Time"
            set={setPresaleTimestamp}
            data={presaleTimestamp}
          />
          <Box ml="4rem">
            <Button
              disabled={!revealTimestamp || revealTimestamp < 0}
              onClick={handleSetPresaleTimestamp}
            >
              Update
            </Button>
          </Box>
        </Box>
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
