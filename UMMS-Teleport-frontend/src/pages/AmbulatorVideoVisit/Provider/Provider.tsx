import {
  ProviderContainer,
  ProviderHeader,
  PatientSection,
  PatientCard,
  PatientPhoto,
  PatientDetails,
  Details,
  DetailValue,
  ActionButtons,
  PatientInfoSection,
  InfoGrid,
  InfoItem,
  StatusBadge,
  Section,
  DataTable,
  ButtonSuccess,
  Title,
  UserSection,
  PatientInfo,
  ModalOverlay,
  ModalContent,
  ModalIcon,
  ModalQuestion,
  ModalButtonsContainer,
  TableContainer,
  EmptyTableCell,
  ParticipantModalBody,
  ParticipantSearch,
  ParticipantSearchField,
  ParticipantTableContainer,
  ParticipantTable,
  ParticipantTableRow,
  ParticipantModalActions,
  FamilyParticipantForm,
  FamilyParticipantField,
  FamilyParticipantActions,
  EditFamilyButton,
  DeviceConfirmationBody,
  DeviceConfirmationQuestion,
  DeviceConfirmationActions,
} from "./Provider.styles";
import { useState, useEffect, type FormEvent } from "react";
import logo from "../../../assets/img/newlogo.png";
import userImg from "../../../assets/img/profile.jpg";
import tigerLogo from "../../../assets/icons/tiger-logo.svg";
import sendIcon from "../../../assets/icons/send.png";
import sendWhiteIcon from "../../../assets/icons/sendwhite.png";
import nurseIcon from "../../../assets/icons/nurse.png";
import wireIcon from "../../../assets/icons/wire.png";
import searchIcon from "../../../assets/icons/Search.png";
import pencilIcon from "../../../assets/icons/pencil.png";

import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  membersActions,
  selectInviteBatchId,
  selectMeetingUrl,
} from "../../../store/features/members/membersSlice";
import { errorMessage, SuccessMessage } from "../../../utils/toasters";
import { Button } from "../../../components";
import AppModal from "../../../components/Modal/Modal";
import { theme } from "../../../styles/theme";
import {
  useGetPatientQuery,
  useUpdatePatientMutation,
} from "../../../store/services/patientApi";
import { formatDOB } from "../../../utils/utils";
import Loader from "../../../components/Loader/Loader";
import {
  useGetProvidersQuery,
  useUpdateProviderMutation,
} from "../../../store/services/providerApi";
import {
  useCreateFamilyFriendsMutation,
  useUpdateFamilyFriendsMutation,
} from "../../../store/services/familyApi";
import {
  useCreateInvitationMutation,
  useGetActiveInvitationQuery,
} from "../../../store/services/invitation";
import type { FamilyAndFriends, Patient } from "../../../types/patients";
import { CustomToast } from "../../../components/CustomToast/CustomToast";
import NotFound from "../../NotFound/NotFound";

const EMPTY_FAMILY_PARTICIPANT = {
  name: "",
  phone: "",
  email: "",
  relation: "Friend",
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return fallback;
  }

  const { data } = error as { data?: unknown };
  if (!data || typeof data !== "object" || !("message" in data)) {
    return fallback;
  }

  const { message } = data as { message?: unknown };
  if (typeof message !== "string") return fallback;

  const normalizedMessage = message.toLowerCase();
  if (
    normalizedMessage.includes("email") &&
    normalizedMessage.includes("unique")
  ) {
    return "This email address is already in use.";
  }
  if (
    normalizedMessage.includes("phone") &&
    normalizedMessage.includes("unique")
  ) {
    return "This phone number is already in use.";
  }

  return message;
};

const Provider = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reduxMeetingUrl = useAppSelector(selectMeetingUrl);
  const inviteBatchId = useAppSelector(selectInviteBatchId);

  const [isCreatingInvitation, setIsCreatingInvitation] =
    useState<boolean>(false);
  const [roomName, setRoomName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [showFamilyParticipantModal, setShowFamilyParticipantModal] =
    useState(false);
  const [showDeviceConfirmation, setShowDeviceConfirmation] = useState(false);
  const [isDisassociating, setIsDisassociating] = useState(false);
  const [participantSearch, setParticipantSearch] = useState("");
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>();
  const [familyParticipant, setFamilyParticipant] = useState(
    EMPTY_FAMILY_PARTICIPANT,
  );
  const [editingFamilyMemberId, setEditingFamilyMemberId] = useState<
    string | undefined
  >();
  const [isSavingFamilyMember, setIsSavingFamilyMember] = useState(false);
  const [, setWaitingGuests] = useState<string[]>([]);
  const {
    data: patientResponse,
    error: patientError,
    isError: isPatientError,
    isLoading,
    isFetching,
    refetch,
  } = useGetPatientQuery(id as string);
  const rawPatientResponse: unknown = patientResponse;
  const data =
    rawPatientResponse && typeof rawPatientResponse === "object"
      ? (rawPatientResponse as Patient)
      : undefined;
  const isPatientNotFound =
    isPatientError &&
    patientError &&
    typeof patientError === "object" &&
    "status" in patientError &&
    patientError.status === 404;
  const {
    data: activeInvitation,
    isError: isActiveInvitationError,
    isLoading: isRestoringInvitation,
  } = useGetActiveInvitationQuery(id as string);
  const { data: providers } = useGetProvidersQuery();
  const [updateProvider] = useUpdateProviderMutation();
  const [createFamilyFriends] = useCreateFamilyFriendsMutation();
  const [updateFamilyFriends] = useUpdateFamilyFriendsMutation();
  const [createInvitation] = useCreateInvitationMutation();
  const [updatePatient, { isLoading: isUpdatingPatient }] =
    useUpdatePatientMutation();
  useEffect(() => {
    if (isActiveInvitationError) void refetch();
  }, [isActiveInvitationError, refetch]);

  useEffect(() => {
    if (
      !activeInvitation ||
      inviteBatchId ||
      activeInvitation.status === "concluded" ||
      activeInvitation.status === "expired"
    )
      return;

    dispatch(
      membersActions.setMeetingMeta({
        inviteBatchId: activeInvitation.inviteBatchId,
        roomId: activeInvitation.roomId,
        meetingUrl: activeInvitation.meetingUrl,
        inviteStatus: activeInvitation.status as
          | "waiting"
          | "accepted"
          | "expired",
      }),
    );
    setRoomName(activeInvitation.roomId);
  }, [activeInvitation, dispatch, inviteBatchId]);

  const assignedProviderIds = new Set(
    data?.providers.map(({ id }) => id) ?? [],
  );
  const visibleProviders = (providers ?? []).filter((provider) => {
    if (assignedProviderIds.has(provider.id)) return false;

    const searchTerm = participantSearch.trim().toLowerCase();
    if (!searchTerm) return true;

    return [
      provider.firstName,
      provider.lastName,
      provider.department,
      provider.providerType,
      provider.location,
      provider.designation,
    ].some((value) => value?.toLowerCase().includes(searchTerm));
  });

  const closeParticipantModal = () => {
    setShowParticipantModal(false);
    setParticipantSearch("");
    setSelectedParticipantId(undefined);
  };

  const handleAddParticipant = async (providerId: string) => {
    const updateProviderIds =
      data?.providers.map((provider) => provider.id) ?? [];

    try {
      await updatePatient({
        id: id as string,
        body: {
          providerIds: [...updateProviderIds, providerId],
        },
      }).unwrap();
      SuccessMessage("Provider added successfully");
      closeParticipantModal();
    } catch (error) {
      errorMessage(getApiErrorMessage(error, "Unable to add the provider."));
    }
  };

  const closeFamilyParticipantModal = () => {
    setShowFamilyParticipantModal(false);
    setFamilyParticipant(EMPTY_FAMILY_PARTICIPANT);
    setEditingFamilyMemberId(undefined);
  };

  const openAddFamilyParticipantModal = () => {
    setEditingFamilyMemberId(undefined);
    setFamilyParticipant(EMPTY_FAMILY_PARTICIPANT);
    setShowFamilyParticipantModal(true);
  };

  const openEditFamilyParticipantModal = (person: FamilyAndFriends) => {
    setEditingFamilyMemberId(person.id);
    setFamilyParticipant({
      name: `${person.firstName} ${person.lastName}`,
      phone: person.phone,
      email: person.email,
      relation: person.relation,
    });
    setShowFamilyParticipantModal(true);
  };

  const handleAddFamilyParticipant = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!data || isSavingFamilyMember) return;

    const [firstName, ...lastNameParts] = familyParticipant.name
      .trim()
      .split(/\s+/);
    const lastName = lastNameParts.join(" ");

    if (!firstName || !lastName) {
      errorMessage("Enter the participant's first and last name.");
      return;
    }

    const familyBody = {
      firstName,
      lastName,
      phone: familyParticipant.phone.trim(),
      email: familyParticipant.email.trim(),
      relation: familyParticipant.relation,
    };

    setIsSavingFamilyMember(true);
    try {
      if (editingFamilyMemberId) {
        await updateFamilyFriends({
          id: editingFamilyMemberId,
          patientId: data.id,
          body: familyBody,
        }).unwrap();
        SuccessMessage("Family member updated successfully");
      } else {
        const createdFamilyMember = await createFamilyFriends({
          ...familyBody,
          status: "-",
        }).unwrap();
        const familyIds = data.families.map((family) => family.id);
        await updatePatient({
          id: data.id,
          body: { familyIds: [...familyIds, createdFamilyMember.id] },
        }).unwrap();
        SuccessMessage("Family member added successfully");
      }
      closeFamilyParticipantModal();
    } catch (error) {
      console.error(error);
      errorMessage(
        getApiErrorMessage(
          error,
          "Unable to save the family member. Please try again.",
        ),
      );
    } finally {
      setIsSavingFamilyMember(false);
    }
  };

  const handleDisassociateDevice = async () => {
    if (!data || isDisassociating) return;

    setIsDisassociating(true);
    try {
      await updatePatient({
        id: data.id,
        body: { deviceAssociated: "No" },
      }).unwrap();
      SuccessMessage("Device disassociated successfully");
      setShowDeviceConfirmation(false);
    } catch (error) {
      console.error(error);
      errorMessage(
        getApiErrorMessage(
          error,
          "Unable to disassociate the device. Please try again.",
        ),
      );
    } finally {
      setIsDisassociating(false);
    }
  };
  const getCurrentTimeFormatted = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes}${ampm}`;
  };

  const handleSendInvite = async (
    participant: {
      id: string;
      firstName: string;
      lastName: string;
      designation?: string;
      relation?: string;
      phone: string;
      email: string;
    },
    isProvider: boolean,
  ) => {
    if (isCreatingInvitation) return;
    setIsCreatingInvitation(true);

    const timeStr = getCurrentTimeFormatted();
    try {
      const relationVal = isProvider
        ? participant.designation || "MD"
        : participant.relation || "Friend";
      const inviteData = await createInvitation({
        patientId: id as string,
        roomId: roomName,
        inviteBatchId: inviteBatchId || undefined,
        members: [
          {
            name: `${participant.firstName} ${participant.lastName}`,
            relation: relationVal,
            phone: participant.phone,
            email: participant.email,
            id: participant.id,
            type: isProvider ? "provider" : "family",
            status: `Invited ${timeStr}`,
          },
        ],
      }).unwrap();

      dispatch(
        membersActions.setMeetingMeta({
          inviteBatchId: inviteData.inviteBatchId,
          roomId: inviteData.roomId,
          meetingUrl: inviteData.meetingUrl,
          inviteStatus: "waiting",
        }),
      );

      SuccessMessage(
        `Invitation dispatched to ${participant.firstName} ${participant.lastName}`,
      );
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsCreatingInvitation(false);
    }
  };

  const handleStartCallClicked = () => {
    const callUrl =
      reduxMeetingUrl ||
      (() => {
        const jitsiDomain =
          import.meta.env.VITE_JITSI_DOMAIN || "meet.bulmartech.com";
        const domainPrefix = jitsiDomain.startsWith("http")
          ? jitsiDomain
          : `https://${jitsiDomain}`;
        return `${domainPrefix}/${roomName}`;
      })();

    const roomMatch = callUrl.match(
      /(?:https?:\/\/[^/]+\/|room=)([^?&/]+)/,
    );
    const actualRoom = roomMatch ? roomMatch[1] : roomName;

    const jwtMatch = callUrl.match(/[?&]jwt=([^&]+)/);
    const jwt = jwtMatch ? jwtMatch[1] : "";

    const providerCallUrl = `/${id || "5080483241"}/video-call?room=${encodeURIComponent(actualRoom)}&moderator=true&participantType=provider&inviteBatchId=${encodeURIComponent(inviteBatchId || "")}&jwt=${encodeURIComponent(jwt)}`;
    const waitingRoomUrl = `/invite/accept?inviteBatchId=${encodeURIComponent(inviteBatchId || "provider-batch")}&role=provider&room=${encodeURIComponent(actualRoom)}&meetingUrl=${encodeURIComponent(providerCallUrl)}`;
    navigate(waitingRoomUrl, { replace: true });
  };

  const handleSendToTiger = () => {
    CustomToast("The meeting link sent to Tiger successfully");
  };
  useEffect(() => {
    const randomRoomId = `umms-visit-${Math.random().toString(36).substring(2, 11)}`;
    setRoomName(randomRoomId);
  }, []);

  useEffect(() => {
    if (!inviteBatchId || !data) return;

    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
    const ws = new WebSocket(`${wsUrl}/ws?inviteBatchId=${inviteBatchId}`);

    ws.onmessage = async (event) => {
      const message: {
        event:
          | "guest_waiting"
          | "guest_joined"
          | "participant_left"
          | "participant_disconnected";
        inviteBatchId: string;
        guestName: string;
        inviteId: string;
      } = JSON.parse(event.data);

      if (
        message.event === "participant_left" ||
        message.event === "participant_disconnected"
      ) {
        void refetch();
        return;
      }

      const timeStr = getCurrentTimeFormatted();

      if (
        message.event !== "guest_waiting" &&
        message.event !== "guest_joined"
      ) {
        return;
      }

      const status =
        message.event === "guest_waiting"
          ? `Waiting ${timeStr}`
          : `Joined ${timeStr}`;

      setWaitingGuests((prev) =>
        prev.includes(message.guestName) ? prev : [...prev, message.guestName],
      );

      const provider = data.providers.find(
        (p) => p.inviteId === message.inviteId,
      );

      if (provider) {
        await updateProvider({
          id: provider.id,
          patientId: data.id,
          body: {
            status,
            invite: true,
          },
        }).unwrap();
      }

      const family = data.families.find((f) => f.inviteId === message.inviteId);

      if (family) {
        await updateFamilyFriends({
          id: family.id,
          patientId: data.id,
          body: {
            status,
            invite: true,
          },
        }).unwrap();
      }
    };

    ws.onerror = () => console.error("WS error");

    return () => ws.close();
  }, [inviteBatchId, data, refetch, updateProvider, updateFamilyFriends]);

  if (isLoading) return <Loader />;
  if (isPatientNotFound) {
    return (
      <NotFound
        errorCode="404 — Patient Not Found"
        title="Patient not found"
        description="We couldn't find a patient matching this ID. Please check the patient ID and try again."
      />
    );
  }
  return (
    <ProviderContainer>
      {/* Header */}
      <ProviderHeader>
        <img src={logo} alt="Logo" width={250} />
      </ProviderHeader>
      {/* Patient Info Section */}
      <PatientSection>
        <PatientCard>
          <PatientPhoto>
            <img src={data?.imageUrl ?? userImg} alt="Patient" />
          </PatientPhoto>
          <PatientDetails>
            <Details>
              <div>
                <strong>Name</strong>
                <DetailValue>
                  {data?.firstName + " " + data?.lastName}
                </DetailValue>
              </div>
              <div>
                <strong>Gender</strong>{" "}
                <DetailValue>{data?.gender}</DetailValue>
              </div>
              <div>
                <strong>Age</strong> <DetailValue>{data?.age}.Y.O.</DetailValue>
              </div>
              <div>
                <strong>Date of Birth</strong>
                <DetailValue>{formatDOB(data?.dob)}</DetailValue>
              </div>
              <div>
                <strong>MRN</strong> <DetailValue>{data?.MRN}</DetailValue>
              </div>
              <div>
                <strong>CBEN</strong> <DetailValue>{data?.CBEN}</DetailValue>
              </div>
            </Details>
            <ActionButtons>
              <Button
                bgcolor={theme.colors.green}
                hoverBg={theme.colors.darkgreen}
                color={theme.colors.white}
                onClick={() => setShowModal(true)}
              >
                Join to Start Visit
              </Button>

              <Button
                bgcolor="#F2FAFF"
                hoverBg="#FFF1F1"
                hoverBorder=" 1px solid #FF5454"
                color="#333"
                hasIcon
                iconWidth={24}
                iconHeight={16}
                src={tigerLogo}
                border="1px solid #ADAFB0"
                onClick={handleSendToTiger}
              >
                Send to Tiger
              </Button>
            </ActionButtons>
          </PatientDetails>
        </PatientCard>
      </PatientSection>

      {/* Patient Info Status */}
      <PatientInfo>
        <Title>PATIENT INFO</Title>
        <PatientInfoSection>
          <InfoGrid>
            <InfoItem>
              <label>Patient Name</label>
              <span>{data?.firstName + " " + data?.lastName}</span>
            </InfoItem>
            <InfoItem>
              <label>Current Status</label>
              <StatusBadge>{data?.currentStatus}</StatusBadge>
            </InfoItem>
            {/* <InfoItem>
              <label>Device Associated</label>
              <StatusYes>{data?.deviceAssociated}</StatusYes>
            </InfoItem> */}
            <InfoItem>
              <Button
                bgcolor={theme.colors.red}
                hoverBg={theme.colors.darkred}
                color={theme.colors.white}
                border="1px solid #ffffff"
                onClick={() => setShowDeviceConfirmation(true)}
              >
                De-associate Device
              </Button>
            </InfoItem>
          </InfoGrid>
        </PatientInfoSection>
      </PatientInfo>

      <UserSection>
        <Section>
          <Title>PROVIDERS & STAFF</Title>
          <Section>
            <TableContainer>
              <DataTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Tiger Invite</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.providers.length ? (
                    data?.providers.map((provider, idx) => (
                      <tr key={idx}>
                        <td>{provider.firstName + " " + provider.lastName}</td>
                        <td>{provider.designation}</td>
                        <td>{provider.status}</td>
                        <td>
                          <ButtonSuccess
                            disabled={
                              isFetching ||
                              isCreatingInvitation ||
                              isRestoringInvitation
                            }
                            type={provider.invite ? "resend" : "send"}
                            onClick={() => handleSendInvite(provider, true)}
                          >
                            {provider.invite ? "Resend" : "Send"}
                            {!provider.invite ? (
                              <img src={sendWhiteIcon} alt="Send" />
                            ) : (
                              <img src={sendIcon} alt="Send" />
                            )}
                          </ButtonSuccess>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <EmptyTableCell colSpan={4}>
                        No data found
                      </EmptyTableCell>
                    </tr>
                  )}
                </tbody>
              </DataTable>
            </TableContainer>

            <Button
              bgcolor={theme.colors.green}
              onClick={() => setShowParticipantModal(true)}
              margin="12px 0 0 0"
            >
              + Add Others
            </Button>
          </Section>
        </Section>

        <Section>
          <Title>FAMILY & FRIENDS</Title>
          <Section>
            <TableContainer>
              <DataTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relation</th>
                    <th>Status</th>
                    <th>Invite</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.families.length ? (
                    data?.families.map((person, idx) => (
                      <tr key={idx}>
                        <td>
                          <EditFamilyButton
                            type="button"
                            onClick={() =>
                              openEditFamilyParticipantModal(person)
                            }
                            aria-label={`Edit ${person.firstName} ${person.lastName}`}
                          >
                            <img src={pencilIcon} alt="" aria-hidden="true" />
                          </EditFamilyButton>
                          {person.firstName + " " + person.lastName}
                        </td>
                        <td>{person.relation}</td>
                        <td>{person.status}</td>
                        <td>
                          <ButtonSuccess
                            disabled={
                              isFetching ||
                              isCreatingInvitation ||
                              isRestoringInvitation
                            }
                            type={person.invite ? "resend" : "send"}
                            onClick={() => handleSendInvite(person, false)}
                          >
                            {person.invite ? "Resend" : "Send"}
                            {!person.invite ? (
                              <img src={sendWhiteIcon} alt="Send" />
                            ) : (
                              <img src={sendIcon} alt="Send" />
                            )}
                          </ButtonSuccess>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <EmptyTableCell colSpan={4}>
                        No data found
                      </EmptyTableCell>
                    </tr>
                  )}
                </tbody>
              </DataTable>
            </TableContainer>
            <Button
              bgcolor={theme.colors.green}
              onClick={openAddFamilyParticipantModal}
              margin="12px 0 0 0"
            >
              + Add Others
            </Button>
          </Section>
        </Section>
      </UserSection>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalIcon>
              <img src={nurseIcon} alt="Nurse Icon" />
            </ModalIcon>
            <ModalQuestion>
              Is this a visit for the UMMS Virtual Nursing program?
            </ModalQuestion>

            <ModalButtonsContainer>
              <Button
                bgcolor={theme.colors.green}
                hoverBg={theme.colors.darkgreen}
                onClick={() => {
                  setShowModal(false);
                  handleStartCallClicked();
                }}
              >
                Yes, I am a Virtual Nurse
              </Button>

              <Button
                bgcolor="#FFEEEE"
                hoverBg="#FFEEEE"
                color="#D42A2A"
                border="1px solid #FDC6C6"
                hoverBorder="1px solid #D42A2A"
                onClick={() => {
                  setShowModal(false);
                  handleStartCallClicked();
                }}
              >
                No, I'm not
              </Button>
            </ModalButtonsContainer>
          </ModalContent>
        </ModalOverlay>
      )}

      <AppModal
        id="add-umms-participant-modal"
        isOpen={showParticipantModal}
        onClose={closeParticipantModal}
        title="Add an UMMS Participant"
        width="min(760px, calc(100vw - 32px))"
        height="460px"
        background="rgba(0, 0, 0, 0.5)"
      >
        <ParticipantModalBody>
          <ParticipantSearchField>
            <img src={searchIcon} alt="" aria-hidden="true" />
            <ParticipantSearch
              type="search"
              value={participantSearch}
              onChange={(event) => setParticipantSearch(event.target.value)}
              placeholder="Search for Provider and Staff"
              aria-label="Search UMMS providers and staff"
            />
          </ParticipantSearchField>
          <ParticipantTableContainer>
            <ParticipantTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Provider Type</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {visibleProviders.length ? (
                  visibleProviders.map((provider) => (
                    <ParticipantTableRow
                      key={provider.id}
                      $isSelected={selectedParticipantId === provider.id}
                      onClick={() => setSelectedParticipantId(provider.id)}
                    >
                      <td>
                        {provider.firstName} {provider.lastName}
                      </td>
                      <td>{provider.department}</td>
                      <td>{provider.providerType}</td>
                      <td>{provider.location}</td>
                    </ParticipantTableRow>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No providers or staff found.</td>
                  </tr>
                )}
              </tbody>
            </ParticipantTable>
          </ParticipantTableContainer>
          <ParticipantModalActions>
            <Button
              bgcolor={theme.colors.green}
              hoverBg={theme.colors.darkgreen}
              disabled={!selectedParticipantId}
              isLoading={isUpdatingPatient}
              onClick={() => {
                if (selectedParticipantId) {
                  handleAddParticipant(selectedParticipantId);
                }
              }}
            >
              Add UMMS Participant
            </Button>
          </ParticipantModalActions>
        </ParticipantModalBody>
      </AppModal>

      <AppModal
        id="add-family-participant-modal"
        isOpen={showFamilyParticipantModal}
        onClose={closeFamilyParticipantModal}
        title={
          editingFamilyMemberId
            ? "Edit Family and Friend"
            : "Add Family and Friends"
        }
        width="min(625px, calc(100vw - 32px))"
        height="455px"
        background="rgba(0, 0, 0, 0.5)"
      >
        <FamilyParticipantForm onSubmit={handleAddFamilyParticipant}>
          <FamilyParticipantField>
            <label htmlFor="family-participant-name">Participant Name</label>
            <input
              id="family-participant-name"
              value={familyParticipant.name}
              onChange={(event) =>
                setFamilyParticipant((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              required
            />
          </FamilyParticipantField>
          <FamilyParticipantField>
            <label htmlFor="family-participant-phone">Phone Number</label>
            <input
              id="family-participant-phone"
              type="tel"
              value={familyParticipant.phone}
              onChange={(event) =>
                setFamilyParticipant((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              required
            />
          </FamilyParticipantField>
          <FamilyParticipantField>
            <label htmlFor="family-participant-email">Email Address</label>
            <input
              id="family-participant-email"
              type="email"
              value={familyParticipant.email}
              onChange={(event) =>
                setFamilyParticipant((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />
          </FamilyParticipantField>
          <FamilyParticipantField>
            <label htmlFor="family-participant-relation">Select Relation</label>
            <select
              id="family-participant-relation"
              value={familyParticipant.relation}
              onChange={(event) =>
                setFamilyParticipant((current) => ({
                  ...current,
                  relation: event.target.value,
                }))
              }
            >
              <option>Friend</option>
              <option>Parent</option>
              <option>Sibling</option>
              <option>Spouse</option>
              <option>Child</option>
              <option>Guardian</option>
              <option>Other</option>
            </select>
          </FamilyParticipantField>
          <FamilyParticipantActions>
            <Button
              type="submit"
              bgcolor={theme.colors.green}
              hoverBg={theme.colors.darkgreen}
              disabled={isSavingFamilyMember}
              isLoading={isSavingFamilyMember}
            >
              {editingFamilyMemberId ? "Save Changes" : "+ Add Participant"}
            </Button>
          </FamilyParticipantActions>
        </FamilyParticipantForm>
      </AppModal>

      <AppModal
        id="disassociate-device-modal"
        isOpen={showDeviceConfirmation}
        onClose={() => !isDisassociating && setShowDeviceConfirmation(false)}
        title=""
        width="min(600px, calc(100vw - 32px))"
        height="330px"
        background="rgba(0, 0, 0, 0.5)"
      >
        <DeviceConfirmationBody>
          <img src={wireIcon} alt="Wire Icon" />
          <DeviceConfirmationQuestion>
            Are you sure you want to De-associate the device?
          </DeviceConfirmationQuestion>
          <DeviceConfirmationActions>
            <Button
              bgcolor={theme.colors.green}
              hoverBg={theme.colors.darkgreen}
              disabled={isDisassociating}
              isLoading={isDisassociating}
              onClick={handleDisassociateDevice}
            >
              Yes
            </Button>
            <Button
              bgcolor="#FFEEEE"
              hoverBg="#FFEEEE"
              color="#D42A2A"
              border="1px solid #FDC6C6"
              hoverBorder="1px solid #D42A2A"
              disabled={isDisassociating}
              onClick={() => setShowDeviceConfirmation(false)}
            >
              No
            </Button>
          </DeviceConfirmationActions>
        </DeviceConfirmationBody>
      </AppModal>
    </ProviderContainer>
  );
};

export default Provider;
