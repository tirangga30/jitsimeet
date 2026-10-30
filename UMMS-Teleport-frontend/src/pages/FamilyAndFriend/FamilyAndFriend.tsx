import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  PageWrapper,
  TitleSection,
  BadgeIconContainer,
  PageHeading,
  PageSubheading,
  MainCard,
  StepHeader,
  StepBadge,
  StepTextGroup,
  StepTitle,
  StepSubtitle,
  TableContainer,
  StyledTable,
  TableHead,
  HeadRow,
  HeadCell,
  TableBody,
  BodyRow,
  BodyCell,
  CheckBoxLabel,
  CheckBoxInput,
  DeleteIconButton,
  AddNewButton,
  ButtonBar,
  SendButton,
  CancelButton,
  SuccessView,
  SuccessCheckCircle,
  SuccessHeading,
  SuccessSubheading,
  FormGrid,
  FormField,
  FieldLabel,
  InputWrapper,
  StyledModalInput,
  StyledModalSelect,
  PhoneInputWrapper,
  ErrorText,
  ModalSubmitBar,
  AddParticipantButton,
} from "./FamilyAndFriend.styles";
import PageDecorations from "../../components/PageDecorations/PageDecorations";
import AppModal from "../../components/Modal/Modal";
import {
  DeleteButtonGroup,
  DeleteContainer,
  DeleteDescription,
  DeleteTitle,
} from "../../components/Modal/Modal.styles";
import { Button } from "../../components";
import { errorMessage, SuccessMessage } from "../../utils/toasters";
import { formatTime } from "../../utils/utils";
import type { MemberFormInputType, MembersType } from "../../types/members";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  membersActions,
  selectInviteBatchId,
} from "../../store/features/members/membersSlice";

export const FamilyAndFriend = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const inviteBatchId = useAppSelector(selectInviteBatchId);

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm<MemberFormInputType>();

  const [showModel, setShowModel] = useState<boolean>(false);
  const [showDeleteModel, setShowDeleteModel] = useState<boolean>(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number>(0);
  const [showInvitationView, setShowInvitationView] = useState<boolean>(false);
  const [isSendingInvitation, setIsSendingInvitation] = useState<boolean>(false);

  const [friendAndFamilyData, setFriendAndFamilyData] = useState<MembersType[]>([
    {
      id: 1,
      name: "Simon",
      relation: "Father",
      mobile: "638 - 733 - 839",
      email: "name.surename@domain.com",
      checked: false,
    },
    {
      id: 2,
      name: "Daniel Lawrence",
      relation: "Friend",
      mobile: "638 - 733 - 839",
      email: "name.surename@domain.com",
      checked: false,
    },
    {
      id: 3,
      name: "Simon",
      relation: "Father",
      mobile: "638 - 733 - 839",
      email: "name.surename@domain.com",
      checked: false,
    },
    {
      id: 4,
      name: "Daniel Lawrence",
      relation: "Friend",
      mobile: "638 - 733 - 839",
      email: "name.surename@domain.com",
      checked: false,
    },
    {
      id: 5,
      name: "Simon",
      relation: "Father",
      mobile: "638 - 733 - 839",
      email: "name.surename@domain.com",
      checked: false,
    },
    {
      id: 6,
      name: "Daniel Lawrence",
      relation: "Friend",
      mobile: "638 - 733 - 839",
      email: "name.surename@domain.com",
      checked: false,
    },
    {
      id: 7,
      name: "Simon",
      relation: "Father",
      mobile: "638 - 733 - 839",
      email: "name.surename@domain.com",
      checked: false,
    },
    {
      id: 8,
      name: "Daniel Lawrence",
      relation: "Friend",
      mobile: "638 - 733 - 839",
      email: "name.surename@domain.com",
      checked: false,
    },
  ]);

  const handleAddMember: SubmitHandler<MemberFormInputType> = (data) => {
    setShowModel(false);
    reset();
    const newMember: MembersType = {
      id: Date.now(),
      name: data.name,
      relation: data.relation || "Family",
      mobile: String(data.mobile),
      email: data.email,
      checked: true,
    };
    setFriendAndFamilyData((prev) => [...prev, newMember]);
    SuccessMessage("New Member Added Successfully");
  };

  const handleDeleteConfirm = () => {
    if (deleteMemberId) {
      setFriendAndFamilyData((prev) => prev.filter((item) => item.id !== deleteMemberId));
      setDeleteMemberId(0);
      setShowDeleteModel(false);
    }
  };

  const handleSelectedInvitationMembers = (memberId: number, val: boolean) => {
    setFriendAndFamilyData((prev) =>
      prev.map((mem) =>
        mem.id === memberId
          ? { ...mem, checked: val, inviteTime: formatTime(new Date()) }
          : mem,
      ),
    );
  };

  const handleSendInvitation = async () => {
    const filterCheckedMembers = friendAndFamilyData.filter((mem) => mem.checked === true);
    const filterUnCheckedMembers = friendAndFamilyData.filter((mem) => mem.checked === false);

    dispatch(
      membersActions.handleInvitedMembers({
        invitedMembers: filterCheckedMembers,
        unInvitedMembers: filterUnCheckedMembers,
      }),
    );

    if (!filterCheckedMembers.length) {
      errorMessage("Please select at least one member to invite.");
      return;
    }

    setIsSendingInvitation(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/invitations/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: id || "5080483241",
            members: filterCheckedMembers.map((m) => ({
              name: m.name,
              relation: m.relation,
              mobile: m.mobile,
              email: m.email,
              type: "family",
            })),
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to create invitations");
      }

      const data = await res.json();

      dispatch(
        membersActions.setMeetingMeta({
          inviteBatchId: data.inviteBatchId,
          roomId: data.roomId,
          meetingUrl: data.meetingUrl,
          inviteStatus: data.status,
        }),
      );

      setShowInvitationView(true);
    } catch {
      errorMessage("Unable to send invitation, please try again.");
    } finally {
      setIsSendingInvitation(false);
    }
  };

  const handleCancel = () => {
    if (!showInvitationView) {
      navigate(`/patient-identifier-information/${id || "5080483241"}`);
    } else {
      setShowInvitationView(false);
    }
  };

  // Poll for invite acceptance once invitations are dispatched
  useEffect(() => {
    if (!showInvitationView || !inviteBatchId || !id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/invitations/status?inviteBatchId=${inviteBatchId}`,
        );
        if (!res.ok) return;

        const data = await res.json();

        if (data.status === "accepted" && data.meetingUrl) {
          dispatch(
            membersActions.setMeetingMeta({
              inviteBatchId,
              roomId: data.roomId,
              meetingUrl: data.meetingUrl,
              inviteStatus: data.status,
            }),
          );

          clearInterval(interval);
          navigate(`/${id}/connecting`);
        }
      } catch {
        // Silently retry on next tick
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [showInvitationView, inviteBatchId, id, navigate, dispatch]);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100%" }}>
      <PageDecorations />

      <PageWrapper>
        {/* Title Section with Teal People Badge */}
        <TitleSection>
          <BadgeIconContainer>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </BadgeIconContainer>
          <PageHeading>Connect with Family or Friends</PageHeading>
          <PageSubheading>Invite your family or friends to stay connected with this patient.</PageSubheading>
        </TitleSection>

        {/* Main Card */}
        <MainCard>
          {!showInvitationView ? (
            <>
              {/* Step 1 Section */}
              <StepHeader>
                <StepBadge>1</StepBadge>
                <StepTextGroup>
                  <StepTitle>Step 1</StepTitle>
                  <StepSubtitle>
                    Choose who you want to invite . Select from given contacts or add new contact.
                  </StepSubtitle>
                </StepTextGroup>
              </StepHeader>

              {/* Table of contacts */}
              <TableContainer>
                <StyledTable>
                  <TableHead>
                    <HeadRow>
                      <HeadCell style={{ width: "70px" }}>Invite</HeadCell>
                      <HeadCell>Name</HeadCell>
                      <HeadCell>Relation</HeadCell>
                      <HeadCell>Phone Number</HeadCell>
                      <HeadCell>Email Address</HeadCell>
                      <HeadCell style={{ width: "80px", textAlign: "center" }}>Remove</HeadCell>
                    </HeadRow>
                  </TableHead>
                  <TableBody>
                    {friendAndFamilyData.map((member) => (
                      <BodyRow key={member.id}>
                        <BodyCell>
                          <CheckBoxLabel>
                            <CheckBoxInput
                              checked={member.checked}
                              onChange={(e) =>
                                handleSelectedInvitationMembers(member.id, e.target.checked)
                              }
                            />
                          </CheckBoxLabel>
                        </BodyCell>
                        <BodyCell style={{ fontWeight: 600 }}>{member.name}</BodyCell>
                        <BodyCell>{member.relation}</BodyCell>
                        <BodyCell>{member.mobile}</BodyCell>
                        <BodyCell style={{ color: "#475569" }}>{member.email}</BodyCell>
                        <BodyCell style={{ textAlign: "center" }}>
                          <DeleteIconButton
                            type="button"
                            aria-label={`Remove ${member.name}`}
                            onClick={() => {
                              setDeleteMemberId(member.id);
                              setShowDeleteModel(true);
                            }}
                          >
                            <svg viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" fill="#EF4444" />
                              <path d="M15 9L9 15M9 9l6 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </DeleteIconButton>
                        </BodyCell>
                      </BodyRow>
                    ))}
                  </TableBody>
                </StyledTable>
              </TableContainer>

              <AddNewButton type="button" onClick={() => setShowModel(true)}>
                + Add New
              </AddNewButton>

              {/* Step 2 Section */}
              <div style={{ marginTop: "32px" }}>
                <StepHeader>
                  <StepBadge>2</StepBadge>
                  <StepTextGroup>
                    <StepTitle>Step 2</StepTitle>
                    <StepSubtitle>
                      Click on the Send invitation Button to send your guests a Link Via SMS Text Message & email
                    </StepSubtitle>
                  </StepTextGroup>
                </StepHeader>

                <ButtonBar>
                  <SendButton
                    type="button"
                    onClick={handleSendInvitation}
                    disabled={isSendingInvitation}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    {isSendingInvitation ? "Sending..." : "Send Invitation"}
                  </SendButton>

                  <CancelButton type="button" onClick={handleCancel}>
                    Cancel
                  </CancelButton>
                </ButtonBar>
              </div>
            </>
          ) : (
            <SuccessView>
              <SuccessCheckCircle>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </SuccessCheckCircle>
              <SuccessHeading>Invitations sent successfully!</SuccessHeading>
              <SuccessSubheading>
                Your video call will begin as soon as the first person joins.
              </SuccessSubheading>

              <div style={{ marginTop: "24px" }}>
                <CancelButton type="button" onClick={handleCancel}>
                  Cancel and Return
                </CancelButton>
              </div>
            </SuccessView>
          )}
        </MainCard>

        {/* Delete Member Confirmation Modal */}
        <AppModal
          id="deleteMember"
          title="Delete Member"
          background="rgba(16, 27, 75, 0.55)"
          onClose={() => setShowDeleteModel(false)}
          isOpen={showDeleteModel}
          width="420px"
          height="260px"
        >
          <DeleteContainer>
            <DeleteTitle>Are you sure?</DeleteTitle>
            <DeleteDescription>
              Do you really want to delete this contact? This action cannot be undone.
            </DeleteDescription>
            <DeleteButtonGroup>
              <Button
                bgcolor="#E53945"
                hoverBg="#CE2C38"
                color="#FFFFFF"
                padding="12px 24px"
                width="140px"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
              <Button
                bgcolor="#009F95"
                hoverBg="#007F78"
                color="#FFFFFF"
                padding="12px 24px"
                width="140px"
                onClick={() => setShowDeleteModel(false)}
              >
                Cancel
              </Button>
            </DeleteButtonGroup>
          </DeleteContainer>
        </AppModal>

        {/* Add Family and Friends Modal */}
        <AppModal
          id="addFamilyAndFriendsModal"
          title="Add Family and Friends"
          isOpen={showModel}
          onClose={() => {
            setShowModel(false);
            reset();
            clearErrors();
          }}
          background="rgba(16, 27, 75, 0.55)"
          width="640px"
          height="420px"
        >
          <form onSubmit={handleSubmit(handleAddMember)}>
            <FormGrid>
              {/* Participant Name */}
              <FormField>
                <FieldLabel>Participant Name</FieldLabel>
                <InputWrapper>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <StyledModalInput
                    placeholder="John Martin"
                    {...register("name", { required: "Name is required" })}
                  />
                </InputWrapper>
                {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
              </FormField>

              {/* Phone Number */}
              <FormField>
                <FieldLabel>Phone Number</FieldLabel>
                <PhoneInputWrapper>
                  <Controller
                    name="mobile"
                    control={control}
                    rules={{ required: "Phone number is required" }}
                    render={({ field: { onChange, value, onBlur, ref } }) => (
                      <PhoneInput
                        value={value ? String(value) : ""}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                        defaultCountry="US"
                        placeholder="Enter phone number"
                      />
                    )}
                  />
                </PhoneInputWrapper>
                {errors.mobile && <ErrorText>{errors.mobile.message}</ErrorText>}
              </FormField>

              {/* Email Address */}
              <FormField>
                <FieldLabel>Email Address</FieldLabel>
                <InputWrapper>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <StyledModalInput
                    placeholder="test@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                </InputWrapper>
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
              </FormField>

              {/* Select Relation */}
              <FormField>
                <FieldLabel>Select Relation</FieldLabel>
                <InputWrapper>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  <StyledModalSelect {...register("relation", { required: "Relation is required" })}>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </StyledModalSelect>
                </InputWrapper>
                {errors.relation && <ErrorText>{errors.relation.message}</ErrorText>}
              </FormField>
            </FormGrid>

            <ModalSubmitBar>
              <AddParticipantButton type="submit">
                Add Participant
              </AddParticipantButton>
            </ModalSubmitBar>
          </form>
        </AppModal>
      </PageWrapper>
    </div>
  );
};

export default FamilyAndFriend;
