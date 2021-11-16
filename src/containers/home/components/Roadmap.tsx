import { useState } from "react";
import Box from "src/components/Box";
import Text from "src/components/Text";
import theme from "src/styleguide/theme";
import RoadmapModal, { IRoadmap } from "./RoadmapModal";

const Roadmap = ({
  roadmap,
  setRoadmap,
}: {
  roadmap: IRoadmap[];
  setRoadmap: (IRoadmap) => void;
}) => {
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  return (
    <Box row>
      <Text fontSize="18px" fontWeight="thin" color="grey" minWidth="20rem">
        ROADMAP
      </Text>
      <Box>
        {roadmap.map((rm) => (
          <>
            <Box key={rm.title} maxWidth="60rem" mb="2rem">
              <Text fontSize="2rem" mb="1.rem">
                {rm.title}
              </Text>
              <Text fontSize="1.6rem" mb="1.2rem">
                {rm.quarter}
              </Text>
              <Text fontSize="1.4rem">{rm.description}</Text>
            </Box>
            <Box
              height="0.1rem"
              width="150%"
              mb="2rem"
              bg={`${theme.colors["secondary-black"]}10`}
              mt="2rem"
            />
          </>
        ))}
        <Text
          as="h4"
          color="primary-blue"
          cursor="pointer"
          onClick={() => setShowRoadmapModal(true)}
        >
          + Add Roadmap
        </Text>
        <Box display={showRoadmapModal ? "block" : "none"}>
          <RoadmapModal {...{ roadmap, setRoadmap, setShowRoadmapModal }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Roadmap;
