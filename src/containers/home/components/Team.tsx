import { useState } from "react";
import Box from "src/components/Box";
import Text from "src/components/Text";
import theme from "src/styleguide/theme";
import TeamModal, { ITeam } from "./TeamModal";

const Team = ({
  team,
  setTeam,
}: {
  team?: ITeam[];
  setTeam?: (ITeam) => void;
}) => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  console.log(team);

  return (
    <Box row>
      <Text fontSize="18px" fontWeight="thin" color="grey" minWidth="20rem">
        TEAM
      </Text>
      <Box>
        {team?.map((t) => (
          <>
            <Box key={t.name} maxWidth="60rem" mb="2rem">
              <Text fontSize="2rem" mb="1.rem">
                {t.name}
              </Text>
              <Text fontSize="1.6rem" mb="1.2rem">
                {t.position}
              </Text>
              <Text fontSize="1.4rem">{t.description}</Text>
            </Box>
            {t.social.map((s) => (
              <Box key={`${t.name}${s.socialMedia}`} row alignItems="center">
                <Text textTransform="capitalize" fontSize="1.4rem">
                  {s.socialMedia}
                </Text>
                <a href={s.url}>
                  <Text fontSize="1.2rem" ml="1.2rem" color="primary-blue">
                    {s.url}
                  </Text>
                </a>
              </Box>
            ))}
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
          onClick={() => {
            document.querySelector("html").style.overflow = "hidden";
            setShowTeamModal(true);
          }}
        >
          + Add Team
        </Text>
        <Box display={showTeamModal ? "block" : "none"}>
          <TeamModal {...{ team, setTeam, setShowTeamModal }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Team;
