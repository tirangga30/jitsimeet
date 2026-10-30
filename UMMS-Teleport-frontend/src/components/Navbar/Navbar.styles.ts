import styled from "styled-components";
import { CommonIcon } from "../Icon/Icon.styles";

export const Nav = styled.nav<{ $isCall?: boolean }>`
  position: relative;
  height: ${({ $isCall }) => ($isCall ? "clamp(60px, 8vh, 76px)" : "64px")};
  padding: 0 clamp(16px, 2.5vw, 28px);
  background: ${({ $isCall, theme }) =>
    $isCall ? theme.colors.navy : theme.colors.white};
  border: ${({ $isCall, theme }) =>
    $isCall ? "none" : `1px solid ${theme.colors.border}`};
  border-radius: ${({ $isCall }) => ($isCall ? "0" : "14px")};
  margin: ${({ $isCall }) => ($isCall ? "0" : "14px 24px 0 24px")};
  box-shadow: ${({ $isCall }) =>
    $isCall ? "none" : "0 4px 16px rgba(16, 27, 75, 0.04)"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  transition: all 0.2s ease;

  /* Safe areas */
  padding-left: max(env(safe-area-inset-left), 20px);
  padding-right: max(env(safe-area-inset-right), 20px);

  @media (max-width: 768px) {
    margin: ${({ $isCall }) => ($isCall ? "0" : "10px 12px 0 12px")};
    padding: 0 14px;
    height: 56px;
  }
`;

export const NavBrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Logo = styled.img`
  height: 38px;
  max-width: 180px;
  object-fit: contain;
`;

export const Version = styled.span<{ $isCall?: boolean }>`
  color: ${({ $isCall, theme }) =>
    $isCall ? theme.colors.white : theme.colors.secondaryText};
  font-size: 13px !important;
  font-weight: 500;
  letter-spacing: 0.2px;
`;

export const HelpButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E7F8F8;
  color: #007F78;
  border: 1px solid #B8EBE6;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #D4F2EE;
    border-color: #009F95;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 159, 149, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const HelpIconCircle = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #009F95;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const MenuBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: clamp(16px, 4vw, 50px);
  align-items: center;
`;

export const MenuItem = styled.div<{ $active?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(3px, 0.8vh, 6px);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition:
    opacity 0.15s ease,
    background 0.15s ease;
  opacity: ${({ $active }) => ($active ? 0.6 : 1)};

  &:hover {
    opacity: 0.7;
  }
`;

export const MenuLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: #e2e2e2;
`;

export const MenuIcon = styled(CommonIcon).attrs<{
  width: number;
  height: number;
}>((props) => ({
  width: props.width || 0,
  height: props.height || 0,
}))`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  object-fit: contain;
`;

export const NavCenter = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
`;

export const NavTimerLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #c8c6c4;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const NavTimerValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #c8c6c4;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
`;

export const Badge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #d42a2a;
  color: #ffffff;
  border-radius: 50%;
  font-size: 9px;
  font-weight: bold;
  height: 16px;
  min-width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  box-sizing: border-box;
  border: 1.5px solid ${({ theme }) => theme.colors.secondary};
  pointer-events: none;
`;

/* ── More dropdown ───────────────────────────────────────────────── */

export const MoreDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 220px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
  z-index: 9999;
  overflow: hidden;
  animation: fadeSlideIn 0.15s ease;

  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const MoreDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px;
  font-size: 13px;
  font-weight: 500;
  color: #1a2e3a;
  cursor: pointer;
  transition: background 0.12s ease;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f6fb;
    color: #0e4b71;
  }

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
    opacity: 0.75;
  }
`;

export const MoreAnchor = styled.div`
  position: relative;
`;
