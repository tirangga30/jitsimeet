import Modal from "react-modal";
import { ModelHeader, ModelHeaderTitle } from "./Modal.styles";
import type { ReactNode } from "react";
import { Icon } from "../ChatAndParticipants/ChatAndParticipants.styles";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
  id: string;
  background: string;
  headerIcon?: string;
  closeOnBackdropClick?: boolean;
};

const AppModal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "840px",
  height = "400px",
  id,
  background = "#FFFFFF61",
  headerIcon,
  closeOnBackdropClick = true,
}: Props) => {
  // animation variants for modal content
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const modalTransition = {
    duration: 0.25,
    ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number],
  };

  // animation variants for overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Clean width and height inputs (if they are percentages or absolute pixels)
  const resolvedWidth = width.includes("%") ? width : `min(${width}, 92vw)`;
  const resolvedHeight = height.includes("%") ? height : `min(${height}, 88dvh)`;

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          id={id}
          isOpen={isOpen}
          ariaHideApp={false}
          onRequestClose={onClose}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={closeOnBackdropClick}
          style={{
            content: {
              width: resolvedWidth,
              height: resolvedHeight,
              margin: "auto",
              background: "transparent",
              borderRadius: "4px",
              padding: "0px",
              border: "none",
              zIndex: 1000,
              overflow: "hidden",
              inset: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            overlay: {
              background: "transparent",
              zIndex: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100dvh",
              backgroundColor: background,
              zIndex: 999,
            }}
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Modal content */}
          <motion.div
            key="content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={modalTransition}
            style={{
              width: "100%",
              height: "100%",
              background: "white",
              borderRadius: "14px",
              boxShadow: "0 20px 60px rgba(16, 27, 75, 0.28)",
              padding: "0px",
              position: "relative",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <ModelHeader $isprimaryBackground={false}>
              <ModelHeaderTitle>
                {headerIcon && (
                  <Icon
                    src={headerIcon}
                    alt="people"
                    height={20}
                    width={26}
                    style={{ flexShrink: 0 }}
                  />
                )}
                {title}
              </ModelHeaderTitle>

              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer"
                onClick={onClose}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </ModelHeader>

            {children}
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default AppModal;
