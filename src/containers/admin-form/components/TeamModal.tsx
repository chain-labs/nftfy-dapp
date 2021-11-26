import { useState } from "react";
import Box from "src/components/Box";
import LabelledInput from "src/components/LabelledInput";
import LabelledTextarea from "src/components/LabelledTextarea";
import Modal from "src/components/Modal";
import Text from "src/components/Text";
import theme from "src/styleguide/theme";

interface Props {
  team: ITeam[];
  setTeam: (team: ITeam[]) => void;
  setShowTeamModal: (showTeamModal: boolean) => void;
}

export enum SocialMedia {
  "Twitter" = "Twitter",
  "Facebook" = "Facebook",
  "Discord" = "Discord",
  "Instagram" = "Instagram",
  "Linkedin" = "Linkedin",
}

export interface ISocialLinks {
  socialMedia: SocialMedia;
  url: string;
}

export interface ITeam {
  name: string;
  position: string;
  description: string;
  social: ISocialLinks[];
}

const socialLinks: ISocialLinks[] = [
  { socialMedia: SocialMedia.Twitter, url: "" },
  { socialMedia: SocialMedia.Facebook, url: "" },
  { socialMedia: SocialMedia.Discord, url: "" },
  { socialMedia: SocialMedia.Instagram, url: "" },
  { socialMedia: SocialMedia.Linkedin, url: "" },
];

const TeamModal = ({ team, setTeam, setShowTeamModal }: Props) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [social, setSocial] = useState<ISocialLinks[]>([]);
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [discord, setDiscord] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const onSave = () => {
    document.querySelector("html").style.overflow = "scroll";
    const newSocial = [...social];
    if (twitter) {
      newSocial.push({ socialMedia: SocialMedia.Twitter, url: twitter });
    }
    if (facebook) {
      newSocial.push({ socialMedia: SocialMedia.Facebook, url: facebook });
    }
    if (discord) {
      newSocial.push({ socialMedia: SocialMedia.Discord, url: discord });
    }
    if (instagram) {
      newSocial.push({ socialMedia: SocialMedia.Instagram, url: instagram });
    }
    if (linkedin) {
      newSocial.push({ socialMedia: SocialMedia.Linkedin, url: linkedin });
    }

    const newTeam = [
      ...team,
      { name, position, description, social: newSocial },
    ];
    setTeam(newTeam);
    setShowTeamModal(false);
    setName("");
    setPosition("");
    setDescription("");
    setSocial([]);
  };

  return (
    <Modal>
      <Text as="h3" textAlign="center" fontWeight="regular" mb="4rem">
        Team Details
      </Text>
      <LabelledInput label="Name" set={setName} data={name} />
      <LabelledInput
        set={setPosition}
        data={position}
        label="Position"
        placeholder="Enter Position in the team (eg. Artist)"
      />
      <LabelledTextarea
        label="Description"
        data={description}
        set={setDescription}
      />
      <Text color="grey" fontSize="1.6rem" mb="1.2rem">
        Social Media Links
      </Text>
      <LabelledInput label="Twitter" set={setTwitter} data={twitter} />
      <LabelledInput label="Facebook" set={setFacebook} data={facebook} />
      <LabelledInput label="Discord" set={setDiscord} data={discord} />
      <LabelledInput label="Instagram" set={setInstagram} data={instagram} />
      <LabelledInput label="Linkedin" set={setLinkedin} data={linkedin} />
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
          onClick={() => {
            document.querySelector("html").style.overflow = "scroll";
            setShowTeamModal(false);
          }}
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

export default TeamModal;
