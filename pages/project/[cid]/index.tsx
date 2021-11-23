import React from "react";
import Head from "next/head";
import ProjPageComp from "src/containers/projectpage";
import { useRouter } from "next/router";

const ProjectPage = () => {
  const router = useRouter();
  const { cid } = router.query;
  return (
    <React.Fragment>
      {/* <Head>
				<title>Warrior</title>
			</Head> */}
      {cid ? <ProjPageComp cid={cid?.toString()} /> : ""}
    </React.Fragment>
  );
};

export default ProjectPage;
