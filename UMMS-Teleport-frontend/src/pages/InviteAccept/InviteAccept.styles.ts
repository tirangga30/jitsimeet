import styled from "styled-components";
import bgImage from "../../assets/img/9508803_26807 1.png";

export const InviteAcceptContainer = styled.div`
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url(${bgImage});
  background-color: ${({ theme }) => theme.colors.primary};
  background-blend-mode: multiply;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;
export const Card = styled.div`
  width: 100%;
  max-width: 520px;
  backdrop-filter: blur(12px);
  padding: 30px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Logo = styled.img`
  width: 260px;
  margin-bottom: 20px;
`;
export const Heading = styled.h1`
  color: #ffffff;
  font-size: ${({ theme }) => theme.typography.large};
  font-weight: 700;
  margin-bottom: 25px;
  letter-spacing: 1px;
`;
export const TimerBox = styled.div.attrs<{
  isMobile: boolean;
}>((props) => ({
  isMobile: props.isMobile,
}))`
  width: 100%;
  height: 220px;

  background: #a1cfe5;
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: ${({ isMobile }) => (isMobile ? "center" : "space-between")};
  border: 4px solid white;
  padding: 20px 10px;

  margin-bottom: 25px;
`;
// export const TimerText = styled.div.attrs<{
//   danger: string;
// }>((props) => ({
//   danger: props.danger
// }))`
//   font-size: 80px;
//   font-weight: 700;
//   color: ${({ danger }) => (danger ? "red" : "#0b2a3c")};  padding: 20px;
// `;
export const TimerText = styled.div`
  font-size: 80px;
  font-weight: 700;
  padding: 20px;
`;
export const Illustration = styled.img`
  height: 100%;
  object-fit: contain;
`;
export const Message = styled.p`
  color: #dbeaf3;
  font-size: 16px;
  margin-bottom: 20px;
`;
export const Footer = styled.div<{ $isMobile?: boolean }>`
  text-align: ${({ $isMobile }) => ($isMobile ? "left" : "center")};
  align-items: ${({ $isMobile }) => ($isMobile ? "flex-start" : "center")};
  width: 100%;
  color: #bcd6e3;
  font-size: 14px;
  margin-top: 10px;

  p {
    margin: 20px 0;
    text-decoration: underline;
  }
`;
