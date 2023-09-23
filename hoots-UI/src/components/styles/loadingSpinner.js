import styled from "styled-components";

export const SpinnerContainerDiv = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  opacity: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
`;

export const LoadingSpinnerDiv = styled.div`
  width: 50px;
  height: 50px;
  border: 10px solid #f3f3f3; /* Light grey */
  border-top: 10px solid #383636; /* Blue */
  border-radius: 50%;
  animation: spinner 1.5s linear infinite;

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
