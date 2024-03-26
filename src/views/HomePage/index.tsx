import { WaveformGenerator } from "../../features/WaveformGenerator";
import { MainContainer } from "./styled";

const HomePage: React.FC = () => {
  return (
    <MainContainer>
      <h1>Mix Review Software!</h1>
      <WaveformGenerator />
    </MainContainer>
  );
};

export default HomePage;
