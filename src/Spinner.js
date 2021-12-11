import React from "react";
import styled from "styled-components";
import DataUsageIcon from '@mui/icons-material/DataUsage';
const Spinner = (props) => {

    return (
      <Outter>
        <DataUsageIcon style={{ color: "#673ab7", fontSize: "150px", opacity: 1 }} />
      </Outter>
    );
}

const Outter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;      // 세로 센터
  justify-content: center;  // 가로 센터
  background-color: #ede2ff;
  opacity: 0.5;
`;

export default Spinner;