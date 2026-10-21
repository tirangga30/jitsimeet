import styled from "styled-components";
import { CommonIcon } from "../Icon/Icon.styles";

export const Nav = styled.nav`
  position: relative;
  height: clamp(60px, 8vh, 90px);
  padding: 0 clamp(12px, 2vw, 32px);
  background: ${({ theme }) => theme.colors.secondary};

  display: flex;
  align-items: center;
  justify-content: space-between;

  /* Safe areas (for newer iPads with rounded corners) */
  padding-left: max(env(safe-area-inset-left), 2vw);
  padding-right: max(env(safe-area-inset-right), 2vw);
`;

export const Logo = styled.img`
  height: 85%;
  object-fit: contain;
`;

export const Version = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.8em !important;
  opacity: 0.8;
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
