import styled from "styled-components";
import { device } from "../../styles/breakpoints";

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0px;
  box-sizing: border-box;
  display: flex;
`;

export const TakePictureContainer = styled.div<{
  $hasPhoto: boolean;
  gap: string;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ $hasPhoto }) => ($hasPhoto ? "flex-start" : "center")};
  gap: ${({ gap }) => gap};
  box-sizing: border-box;
  padding: ${({ $hasPhoto }) => ($hasPhoto ? "12px 0 20px" : "20px")};

  @media ${device.mobile} {
    padding: ${({ $hasPhoto }) => ($hasPhoto ? "8px 0 12px" : "12px")};
    gap: 8px;
  }
`;

export const SwiperWrapper = styled.div`
  width: 100%;
  max-width: 720px;

  .emr-swiper {
    width: 100%;
    overflow: visible;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const PreviewContainer = styled.div<{ $isSent?: boolean }>`
  position: relative;
  width: calc(100% - 90px);
  height: clamp(160px, 28vh, 260px);
  margin: 0 auto;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: ${({ $isSent }) => ($isSent ? "5px solid #FBBC05" : "")};
  box-sizing: border-box;

  @media ${device.tablet} {
    width: calc(100% - 60px);
    height: clamp(140px, 25vh, 220px);
    padding: 10px;
  }

  @media ${device.mobile} {
    width: calc(100% - 24px);
    height: clamp(130px, 22vh, 190px);
    padding: 8px;
  }
`;

export const CapturedImage = styled.img<{ $hasMaxHeight?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
`;

export const ModelBody = styled.div<{ $hasPhoto?: boolean }>`
  width: 100%;
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: ${({ $hasPhoto }) => ($hasPhoto ? "flex-start" : "center")};
  overflow: hidden;

  @media ${device.tablet} {
    padding: 14px;
  }

  @media ${device.mobile} {
    padding: 10px;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const SuccessBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  img {
    width: 18px;
    height: 18px;
  }
`;

export const SuccessMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 2px solid #57b447;
  border-radius: 6px;
  padding: 8px 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  white-space: nowrap;

  span {
    color: #2e7d32;
    font-size: clamp(11px, 1.5vw, 13px);
    font-weight: 600;
  }

  img {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  @media ${device.mobile} {
    padding: 6px 10px;
    gap: 6px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media ${device.mobile} {
    gap: 10px;
  }
`;

export const ModelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.secondary};
  padding: 15px;

  @media ${device.mobile} {
    padding: 12px;
  }
`;

export const ModelHeaderTitle = styled.p`
  font-style: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

export const ModelBodyTitle = styled.h1`
  font-size: clamp(28px, 6vw, 50px) !important;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

export const ModelBodySubTitle = styled.h1`
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.weight.bold};
  font-size: clamp(16px, 3vw, 24px);
`;

export const ModelFooter = styled.div`
  display: flex;
  justify-content: center;
`;

export const ModalBodypardonInterruption = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;

  @media ${device.mobile} {
    gap: 14px;
    padding: 14px;
  }
`;

export const ModelBodyPara = styled.p`
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(14px, 2.5vw, 20px);
`;

export const ModelPara = styled.p`
  font-weight: ${({ theme }) => theme.weight.normal};
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(14px, 2vw, 16px);
`;

export const ORText = styled.span`
  color: #959595;
  font-weight: ${({ theme }) => theme.weight.bold};
  font-size: ${({ theme }) => theme.typography.small};
`;

export const UploadText = styled.span`
  color: #646465;
  font-weight: ${({ theme }) => theme.weight.normal};
  font-size: ${({ theme }) => theme.typography.body};
  width: 100%;
  max-width: 300px;
  text-align: center;

  @media ${device.mobile} {
    max-width: 240px;
    font-size: 13px;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CapturedImageProps {}
