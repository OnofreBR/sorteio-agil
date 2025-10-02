import { Navigate, useParams } from "react-router-dom";

const RedirectOldContest = () => {
  const { lottery, contest } = useParams();
  return <Navigate to={`/${lottery}/concurso-${contest}`} replace />;
};

export default RedirectOldContest;
