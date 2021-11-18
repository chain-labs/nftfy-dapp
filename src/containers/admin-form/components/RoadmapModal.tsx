import { useState } from "react";
import Box from "src/components/Box";
import LabelledInput from "src/components/LabelledInput";
import LabelledTextarea from "src/components/LabelledTextarea";
import Modal from "src/components/Modal";
import Text from "src/components/Text";
import theme from "src/styleguide/theme";

interface Props {
  roadmap: IRoadmap[];
  setRoadmap: (roadmap: IRoadmap[]) => void;
  setShowRoadmapModal: (showRoadmapModal: boolean) => void;
}

export interface IRoadmap {
  title: string;
  quarter: string;
  description: string;
}

const RoadmapModal = ({ roadmap, setRoadmap, setShowRoadmapModal }: Props) => {
  const [title, setTitle] = useState("");
  const [quarter, setQuarter] = useState("");
  const [description, setDescription] = useState("");

  const onSave = () => {
    const newRoadmap = [...roadmap, { title, quarter, description }];
    setRoadmap(newRoadmap);
    setShowRoadmapModal(false);
    setTitle("");
    setQuarter("");
    setDescription("");
  };

  return (
    <Modal>
      <Text as="h3" textAlign="center" fontWeight="regular" mb="4rem">
        Roadmap Details
      </Text>
      <LabelledInput label="Title" set={setTitle} data={title} />
      <LabelledInput
        set={setQuarter}
        data={quarter}
        label="Quarter"
        placeholder="Enter Estimate quarter for this milestone (eg. Q4 2021)"
      />
      <LabelledTextarea
        label="Description"
        data={description}
        set={setDescription}
      />
      <Box row justifyContent="flex-start">
        <Box
          fontSize="1.6rem"
          bg="primary-red"
          color="white"
          py="1.2rem"
          px="2rem"
          borderRadius="8px"
          mr="2rem"
          cursor="pointer"
          onClick={() => setShowRoadmapModal(false)}
        >
          Cancel
        </Box>
        <Box
          fontSize="1.6rem"
          bg="primary-blue"
          color="white"
          py="1.2rem"
          px="2.4rem"
          borderRadius="8px"
          cursor="pointer"
          onClick={onSave}
        >
          Save
        </Box>
      </Box>
    </Modal>
  );
};

export default RoadmapModal;
