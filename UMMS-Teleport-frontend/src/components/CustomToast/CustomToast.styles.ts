import styled from "styled-components";

export const ToastContainer = styled.div`
  min-width: 520px;
  max-width: 700px;
  background: #eef8f2;
  border: 2px solid #2e8b57;
  border-radius: 6px;
  padding: 18px 28px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  animation: slideDown 0.25s ease;

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #4caf50;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 28px;
    height: 28px;
  }
`;

export const Message = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #0f6b56;
  text-align: center;
`;
