import styled from "styled-components";

export const PlayerSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const PlayerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 50px 0;
`;

export const FormContainer = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 50px 0;
`;

export const FileInfoWindow = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin: 30px 0;
  font-size: 16px;
  color: #dddddd;
  font-family: monospace;
`;

export const CurrentTimeWindow = styled.div`
  margin: 30px 0;
  font-size: 25px;
  color: #dddddd;
  font-family: monospace;
`;

export const Button = styled.button`
  border: none;
  border-radius: 20px;
  font-size: 16px;
  padding: 10px 20px;
  color: black;
  background-color: #dddddd;

  &:hover {
    cursor: pointer;
    background-color: #bbbbbb;
  }
`;
