import ChangePassword from "../container/system/User/ChangePassword";

import CandidateInfo from "../container/Candidate/CandidateInfo";
import ManageCvCandidate from "../container/Candidate/ManageCvCandidate";

const candidateRoutes = [
  {
    path: "info",
    element: <CandidateInfo />,
  },
  {
    path: "changepassword",
    element: <ChangePassword />,
  },
  {
    path: "cv-post",
    element: <ManageCvCandidate />,
  },
];

export default candidateRoutes;
