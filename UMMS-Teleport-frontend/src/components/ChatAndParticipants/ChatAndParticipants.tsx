import React, { useState, useEffect, useRef } from "react";
import {
  globalActions,
  selectpanel,
} from "../../store/features/global/globalSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  AddNewParticipantsContainer,
  AddParticipantHeader,
  AddParticipantTitle,
  BubbleSender,
  BubbleText,
  BubbleTime,
  ButtonContainer,
  ChatBoxContainer,
  ChatBubble,
  ChatInfo,
  ChatInfoHeading,
  ChatInfoPara,
  CloseButton,
  Container,
  HeaderLeft,
  HeaderLeftHeading,
  HeaderRight,
  HeaderSection,
  Icon,
  Input,
  MessageContanier,
  MicroPhoneIcon,
  MobileRow,
  MoreOptionsContainer,
  NumberInput,
  Option,
  OptionItem,
  OptionItems,
  ParticipantInfo,
  ParticipantInfoLeft,
  ParticipantName,
  ParticipantInfoSubTitle,
  ParticipantRight,
  ParticipantsList,
  SelectParticipantsContainer,
  SendButton,
  SendImage,
  SendMessageTextArea,
  StyledDropdown,
  SystemMessage,
  VideoIcon,
} from "./ChatAndParticipants.styles";
import participantsIcon from "../../assets/icons/primary/participants.png";
import chatIcon from "../../assets/icons/primary/chat.png";
import microPhoneIcon from "../../assets/icons/primary/Microphone.png";
import videoIcon from "../../assets/icons/primary/video.png";
import addUserIcon from "../../assets/icons/Add User.png";
import telephoneIcon from "../../assets/icons/telephone.png";
import SendIcon from "../../assets/icons/white/send.png";
import interpreterIcon from "../../assets/icons/interpreter-.png";
import SendPrimaryIcon from "../../assets/icons/primary/send.png";

import moreIcon from "../../assets/icons/primary/more.png";
import primaryUploadIcon from "../../assets/icons/primary/upload.png";
import primaryVoiceIcon from "../../assets/icons/primary/Voice.png";

import {
  selectCallType,
  selectUnInvitedMembers,
} from "../../store/features/members/membersSlice";
import {
  selectJitsiParticipants,
  selectChatMessages,
  videoCallActions,
} from "../../store/features/videoCall/videoCallSlice";
import { jitsiConferenceRef } from "../../utils/jitsiApi";
import Button from "../Button/Button";
import { AddButton } from "../../pages/PatientIdentifierInformation/PatientIdentifierInformation.styles";
import { Dropdown } from "primereact/dropdown";
import { theme } from "../../styles/theme";

export const ChatAndParticipants = () => {
  const dispatch = useAppDispatch();
  const callType = useAppSelector(selectCallType);
  const unInvitedMembers = useAppSelector(selectUnInvitedMembers);
  const jitsiParticipants = useAppSelector(selectJitsiParticipants);
  const chatMessages = useAppSelector(selectChatMessages);
  const currentPanel = useAppSelector(selectpanel);

  const [addExternalParticipants, setAddExternalParticipants] =
    useState<boolean>(false);
  const [showExternalParticipants, setShowExternalParticipants] =
    useState<boolean>(false);
  const [showAddInterpreter, setShowAddInterpreter] = useState<boolean>(false);
  const [showCallPatient, setShowCallPatient] = useState<boolean>(false);

  const [messageText, setMessageText] = useState<string>("");
  const canSendMessage = messageText.trim().length > 0;

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef(chatMessages.length);

  // Scroll only the chat list. scrollIntoView would also move the outer call
  // container and hide the video grid's top spacing.
  useEffect(() => {
    if (currentPanel === "chat") {
      const chatBox = chatBoxRef.current;
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [currentPanel]);

  // On new message — smooth scroll to bottom
  useEffect(() => {
    if (chatMessages.length > prevMsgCountRef.current) {
      const chatBox = chatBoxRef.current;
      chatBox?.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
    }
    prevMsgCountRef.current = chatMessages.length;
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    if (jitsiConferenceRef.current) {
      try {
        jitsiConferenceRef.current.sendMessage(messageText);
      } catch (err) {
        console.error("Error sending Jitsi message:", err);
      }
    }

    dispatch(
      videoCallActions.handleAddChatMessage({
        sender: "You",
        text: messageText,
        timestamp: Date.now(),
      }),
    );

    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUploadFileReview = () => {
    dispatch(globalActions.handleShowUploadModel(true));
    dispatch(globalActions.handleShowPanel("none"));
    dispatch(globalActions.handleVideolayout("grid"));
  };

  const handleSendFileEMR = () => {
    dispatch(globalActions.handleShowUploadModel(true));
    dispatch(globalActions.handleShowPanel("none"));
    dispatch(globalActions.handleVideolayout("grid"));
  };
  /*
  const handleToggleParticipantAudio = (participantId: string, currentHasAudio: boolean) => {
    if (callType === 'provider' && jitsiConferenceRef.current) {
      if (currentHasAudio) {
        try {
          jitsiConferenceRef.current.muteParticipant(participantId, 'audio');
        } catch (e) {
          console.error("Error muting participant audio:", e);
        }
      }
    }
  };

  const handleToggleParticipantVideo = (participantId: string, currentHasVideo: boolean) => {
    if (callType === 'provider' && jitsiConferenceRef.current) {
      if (currentHasVideo) {
        try {
          jitsiConferenceRef.current.muteParticipant(participantId, 'video');
        } catch (e) {
          console.error("Error muting participant video:", e);
        }
      }
    }
  };
  */

  return (
    <Container>
      <HeaderSection>
        <HeaderLeft>
          <Icon
            width={currentPanel !== "more" ? 26 : 26}
            height={currentPanel !== "more" ? 20 : 7}
            src={
              currentPanel === "participants"
                ? participantsIcon
                : currentPanel === "chat"
                  ? chatIcon
                  : moreIcon
            }
            alt="part"
          />
          <HeaderLeftHeading>
            {currentPanel === "participants"
              ? `Participants (${jitsiParticipants?.length})`
              : currentPanel === "chat"
                ? "Chat"
                : "More Options"}
          </HeaderLeftHeading>
        </HeaderLeft>
        <HeaderRight>
          <CloseButton
            type="button"
            aria-label="Close panel"
            title="Close panel"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(globalActions.handleShowPanel("none"));
            }}
          >
            ×
          </CloseButton>
        </HeaderRight>
      </HeaderSection>
      {currentPanel === "participants" ? (
        <ParticipantsList>
          {callType === "provider" && (
            <>
              <Button
                bgcolor={showCallPatient ? "#D9D9D9" : theme.colors.secondary}
                hoverBg={showCallPatient ? "#D9D9D9" : theme.colors.primary}
                src={telephoneIcon}
                hasIcon
                iconWidth={18}
                iconHeight={18}
                onClick={() => {
                  setShowCallPatient(true);
                  setShowExternalParticipants(false);
                  setShowAddInterpreter(false);
                  setAddExternalParticipants(false);
                }}
                disabled={showCallPatient ? true : false}
              >
                Call Patient
              </Button>
              {showCallPatient && (
                <>
                  <SelectParticipantsContainer>
                    <StyledDropdown>
                      <Dropdown
                        options={unInvitedMembers}
                        optionLabel="name"
                        placeholder="Select an option"
                      />
                    </StyledDropdown>
                    <AddButton>
                      <Icon
                        src={telephoneIcon}
                        alt="people"
                        width={16}
                        height={14}
                      />
                      Call
                    </AddButton>
                  </SelectParticipantsContainer>

                  <ButtonContainer>
                    <Button
                      bgcolor="#D42A2A"
                      hoverBg="#AD1111"
                      onClick={() => setShowCallPatient(false)}
                    >
                      Close
                    </Button>
                  </ButtonContainer>
                </>
              )}
              <Button
                bgcolor={
                  showExternalParticipants ? "#D9D9D9" : theme.colors.secondary
                }
                hoverBg={
                  showExternalParticipants ? "#D9D9D9" : theme.colors.primary
                }
                src={addUserIcon}
                hasIcon
                iconWidth={18}
                iconHeight={18}
                onClick={() => {
                  setShowExternalParticipants(true);
                  setShowAddInterpreter(false);
                  setShowCallPatient(false);
                }}
                disabled={showExternalParticipants ? true : false}
              >
                Add External Participants
              </Button>
              {showExternalParticipants && (
                <>
                  <SelectParticipantsContainer>
                    <StyledDropdown>
                      <Dropdown
                        options={unInvitedMembers}
                        optionLabel="name"
                        placeholder="Select a Participant"
                      />
                    </StyledDropdown>
                    <AddButton>
                      <Icon
                        src={telephoneIcon}
                        alt="people"
                        width={16}
                        height={14}
                      />
                      Call
                    </AddButton>
                  </SelectParticipantsContainer>

                  {addExternalParticipants && (
                    <AddNewParticipantsContainer>
                      <AddParticipantHeader>
                        <AddParticipantTitle>
                          Add New Participant
                        </AddParticipantTitle>
                        <CloseButton
                          width="18px"
                          height="18px"
                          onClick={() => setAddExternalParticipants(false)}
                        >
                          ✕
                        </CloseButton>
                      </AddParticipantHeader>

                      <Input placeholder="Name of Participant" />

                      <MobileRow>
                        <NumberInput type="tel" placeholder="Mobile Number" />

                        <AddButton>
                          <Icon
                            src={telephoneIcon}
                            alt="people"
                            width={16}
                            height={14}
                          />
                          Call
                        </AddButton>
                      </MobileRow>
                    </AddNewParticipantsContainer>
                  )}
                  <ButtonContainer>
                    <Button
                      bgcolor="#D42A2A"
                      hoverBg="#AD1111"
                      onClick={() => {
                        setShowExternalParticipants(false);
                        setAddExternalParticipants(false);
                      }}
                    >
                      Close
                    </Button>
                    {!addExternalParticipants && (
                      <Button
                        bgcolor="#EEF8FF"
                        hoverBg="#F2FAFF"
                        hoverBorder="1px solid #05324E"
                        color={theme.colors.secondary}
                        border="1px solid #B1B1B1"
                        width="120px"
                        onClick={() => setAddExternalParticipants(true)}
                      >
                        + Add More
                      </Button>
                    )}
                  </ButtonContainer>
                </>
              )}
              <Button
                bgcolor={
                  showAddInterpreter ? "#D9D9D9" : theme.colors.secondary
                }
                hoverBg={showAddInterpreter ? "#D9D9D9" : theme.colors.primary}
                src={interpreterIcon}
                hasIcon
                iconWidth={19}
                iconHeight={16}
                onClick={() => {
                  setShowAddInterpreter(true);
                  setShowExternalParticipants(false);
                  setAddExternalParticipants(false);
                  setShowCallPatient(false);
                }}
                disabled={showAddInterpreter ? true : false}
              >
                Add Interpreter
              </Button>
              {showAddInterpreter && (
                <>
                  <SelectParticipantsContainer>
                    <StyledDropdown>
                      <Dropdown
                        options={unInvitedMembers}
                        optionLabel="name"
                        placeholder="Select a Participant"
                      />
                    </StyledDropdown>
                    <AddButton>
                      <Icon
                        src={telephoneIcon}
                        alt="people"
                        width={16}
                        height={14}
                      />
                      Call
                    </AddButton>
                  </SelectParticipantsContainer>

                  <ButtonContainer>
                    <Button
                      bgcolor="#D42A2A"
                      hoverBg="#AD1111"
                      onClick={() => setShowAddInterpreter(false)}
                    >
                      Close
                    </Button>
                  </ButtonContainer>
                </>
              )}
            </>
          )}

          {jitsiParticipants?.map((memeber) => {
            const participantName = memeber?.name
              ?.replace(/\s*\(You\)\s*$/, "")
              .trim();
            const participantRoleLabel =
              memeber.participantType === "provider"
                ? "UMMS"
                : memeber.participantType === "patient"
                  ? "Patient"
                  : "Family / Guest";
            return (
              <ParticipantInfo key={memeber?.id}>
                <ParticipantInfoLeft>
                  <ParticipantName>{participantName}</ParticipantName>
                  <ParticipantInfoSubTitle>
                    {participantRoleLabel}
                  </ParticipantInfoSubTitle>
                </ParticipantInfoLeft>
                <ParticipantRight>
                  <MicroPhoneIcon
                    src={microPhoneIcon}
                    alt="micro-phone"

                    // onClick={() => !isLocal && handleToggleParticipantAudio(memeber?.id, memeber?.hasAudio)}
                  />
                  <VideoIcon
                    src={videoIcon}
                    alt="video-icon"

                    // onClick={() => !isLocal && handleToggleParticipantVideo(memeber?.id, memeber?.hasVideo)}
                  />
                  {/* {!isLocal && callType === "provider" ? ( */}
                  <CloseButton
                    type="button"
                    width="18px"
                    height="18px"
                    $compact
                    aria-label={`Remove ${participantName} from the call`}
                    title={`Remove ${participantName} from the call`}
                    onClick={() => {
                      /*
                        if (jitsiConferenceRef.current) {
                          try {
                            jitsiConferenceRef.current.kickParticipant(memeber?.id);
                          } catch (e) {
                            console.error("Error kicking participant:", e);
                          }
                        }
                        */
                    }}
                  >
                    ×
                  </CloseButton>
                  {/* ) : (
                    <div style={{ width: "18px", height: "18px" }} />
                  )} */}
                </ParticipantRight>
              </ParticipantInfo>
            );
          })}
        </ParticipantsList>
      ) : currentPanel === "chat" ? (
        <>
          <ChatBoxContainer
            ref={chatBoxRef}
            style={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              gap: "8px",
              padding: "12px",
              flex: 1,
              maxHeight: "calc(100% - 130px)",
            }}
          >
            {chatMessages.length === 0 ? (
              <ChatInfo>
                <ChatInfoHeading>Start a Conversation</ChatInfoHeading>
                <ChatInfoPara>
                  Connect with the participant, share key points and get data
                  update
                </ChatInfoPara>
              </ChatInfo>
            ) : (
              chatMessages.map((msg, index) => {
                const isSelf = msg.isOwn || msg.sender === "You";
                const time = new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
                if (msg.eventType === "image-uploaded") {
                  return (
                    <SystemMessage key={index}>
                      <div className="title">Image uploaded</div>
                      <div className="subtitle">
                        {msg.sender} sent image ({time})
                      </div>
                    </SystemMessage>
                  );
                }
                return (
                  <ChatBubble key={index} isSelf={isSelf}>
                    {!isSelf && <BubbleSender>{msg.sender}</BubbleSender>}
                    <BubbleText>{msg.text}</BubbleText>
                    <BubbleTime>{time}</BubbleTime>
                  </ChatBubble>
                );
              })
            )}
          </ChatBoxContainer>
          <MessageContanier>
            <SendMessageTextArea
              placeholder="Write a message......"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <SendButton
              type="button"
              $enabled={canSendMessage}
              disabled={!canSendMessage}
              onClick={handleSendMessage}
              aria-label="Send message"
            >
              <SendImage src={SendIcon} alt="send message" />
            </SendButton>
          </MessageContanier>
        </>
      ) : (
        <MoreOptionsContainer>
          <OptionItems>
            {/* EMR options — provider only */}
            {callType === "provider" && (
              <>
                <OptionItem onClick={handleSendFileEMR}>
                  <Icon
                    src={SendPrimaryIcon}
                    alt="SendPrimaryIcon"
                    width={19}
                    height={18}
                  />
                  <Option>Send a file to EMR</Option>
                </OptionItem>
                <OptionItem onClick={handleUploadFileReview}>
                  <Icon
                    src={primaryUploadIcon}
                    alt="primaryUploadIcon"
                    width={18}
                    height={18}
                  />
                  <Option>Upload File for Review</Option>
                </OptionItem>
              </>
            )}
            <OptionItem
              onClick={() => {
                dispatch(globalActions.handleShowAudioVideoModal(true));
                dispatch(globalActions.handleShowPanel("none"));
              }}
            >
              <Icon
                src={primaryVoiceIcon}
                alt="primaryVoiceIcon"
                width={19}
                height={19}
              />
              <Option>Audio & Video Setting</Option>
            </OptionItem>
          </OptionItems>
        </MoreOptionsContainer>
      )}
    </Container>
  );
};
