"use client";
import { Button, Container } from "../../components";
import {
  AddNewButton,
  BodyCell,
  BodyRow,
  BodyRowWithCenter,
  BodySection,
  CheckBoxInput,
  CheckBoxWrapper,
  CheckMark,
  ErrorText,
  FooterSection,
  Form,
  FormGroup,
  FormWrapper,
  HeadCell,
  HeadRow,
  Icon,
  Input,
  InvitationHeading,
  InvitationSection,
  InvitationSubHeading,
  Label,
  ModelBody,
  ModelFooter,
  ModelPrimaryButton,
  PageWrapper,
  Paragraph,
  StepSection,
  StepSpan,
  StyledPhoneInput,
  StyledTable,
  TableBody,
  TableContainer,
  TableHead,
  TickIcon,
} from "./FamilyAndFriend.styles";
import peopleIcon from "../../assets/icons/people.png";
import crossIcon from "../../assets/icons/icons8-cross-48.png";

import inviteIcon from "../../assets/icons/invite.svg";
import tickIcon from "../../assets/icons/tick.png";

import { useEffect, useState } from "react";
import { formatTime } from "../../utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { errorMessage, SuccessMessage } from "../../utils/toasters";
import type { MemberFormInputType, MembersType } from "../../types/members";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  membersActions,
  selectInviteBatchId,
} from "../../store/features/members/membersSlice";
import "react-phone-number-input/style.css";
import {
  HeaderLeft,
  HeaderMainHeading,
  HeaderMid,
  HeaderRight,
  HeaderSection,
} from "../BandScan/BandScan.styles";
import AppModal from "../../components/Modal/Modal";
import {
  DeleteButtonGroup,
  DeleteContainer,
  DeleteDescription,
  DeleteTitle,
} from "../../components/Modal/Modal.styles";

export const FamilyAndFriend = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm<MemberFormInputType>();
  const inviteBatchId = useAppSelector(selectInviteBatchId);

  const [showModel, setShowModel] = useState<boolean>(false);
  const [showDeleteModel, setShoDeleteModel] = useState<boolean>(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number>();
  const [showInvitationView, setShowInvitationView] = useState<boolean>(false);
  const [isSendingInvitation, setIsSendingInvitation] = useState<boolean>(false);

  const [friendAndFamilyData, setFriendAndFamilyData] = useState<MembersType[]>(
    [
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
    ],
  );

  const handleAddMember: SubmitHandler<MemberFormInputType> = (data) => {
    setShowModel(false);
    reset();
    const memberId = friendAndFamilyData.length;
    const newMember: MembersType = {
      id: memberId + 1,
      name: data.name,
      relation: data.relation,
      mobile: String(data.mobile),
      email: data.email,
      checked: false,
    };
    const updatedMembers: MembersType[] = [...friendAndFamilyData, newMember];
    setFriendAndFamilyData(updatedMembers);
    SuccessMessage("New Member Added Succussfully");
  };
  const handleDeleteConfirm = () => {
    if (deleteMemberId) {
      handleRemoveMember(deleteMemberId);
    }
  };
  const handleRemoveMember = (id: number) => {
    const updateMember = friendAndFamilyData.filter((item) => item.id !== id);
    setFriendAndFamilyData(updateMember);
    setDeleteMemberId(0);
    setShoDeleteModel(false);
  };
  const handleSelectedInvaitationMembers = (id: number, val: boolean) => {
    const updatedMembers = friendAndFamilyData.map((mem) => {
      if (mem.id === id) {
        return { ...mem, checked: val, inviteTime: formatTime(new Date()) };
      } else {
        return mem;
      }
    });
    setFriendAndFamilyData(updatedMembers);
  };
  const handleSendInvitation = async () => {
    const filterCheckedMembers = friendAndFamilyData.filter(
      (mem) => mem.checked === true,
    );
    const filterUnCheckedMembers = friendAndFamilyData.filter(
      (mem) => mem.checked === false,
    );

    dispatch(
      membersActions.handleInvitedMembers({
        invitedMembers: filterCheckedMembers,
        unInvitedMembers: filterUnCheckedMembers,
      }),
    );

    if (!filterCheckedMembers.length) {
      errorMessage("Please select at least one member");
      return;
    }

    setIsSendingInvitation(true);
    try {
      const backendBaseUrl =
        import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000/api";
      const res = await fetch(
        `${backendBaseUrl.replace(/\/+$/, "")}/invitations/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: id || "5080483241",
            members: filterCheckedMembers.map((m) => ({
              id: String(m.id),
              name: m.name,
              relation: m.relation,
              phone: m.mobile,
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

      // data.invitees has inviteId per person -> use this to send SMS/email links
      // e.g. https://your-frontend.com/invite/accept?inviteId=<inviteId>

      setShowInvitationView(true);
    } catch {
      errorMessage("Unable to send invitation, please try again.");
    } finally {
      setIsSendingInvitation(false);
    }
  };
  const handleCancel = () => {
    if (!showInvitationView) {
      navigate(`/patient-identifier-information/${id}`);
    } else {
      setShowInvitationView(false);
    }
  };

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
          // optional: store in redux so Connecting can use it
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
        // retry on next interval
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [showInvitationView, inviteBatchId, id, navigate, dispatch]);

  return (
    <Container hasPadding={true}>
      <PageWrapper>
        <HeaderSection>
          <HeaderLeft />
          <HeaderMid>
            <HeaderMainHeading>
              <Icon src={peopleIcon} alt="people" height={24} width={36} />
              Connect with Family or Friends
            </HeaderMainHeading>
          </HeaderMid>
          <HeaderRight>
            <Button
              bgcolor="#05324E"
              hoverBg="#0E4B71"
              color="#FFFFFF"
              hasIcon
              iconWidth={24}
              iconHeight={20}
              border="1px solid #ffffff"
            >
              More Info !
            </Button>
          </HeaderRight>
        </HeaderSection>

        <BodySection>
          {!showInvitationView ? (
            <StepSection>
              <StepSpan>Step 1 -</StepSpan>
              <Paragraph>
                Choose who you want to invite . Select from given contact list
                or add new contact
              </Paragraph>
            </StepSection>
          ) : (
            <InvitationSection>
              <TickIcon src={tickIcon} alt="tick" />
              <InvitationHeading>
                Invitations are sent successfully !
              </InvitationHeading>
              <InvitationSubHeading>
                Your video call will begin as soon as the first person joins
              </InvitationSubHeading>
            </InvitationSection>
          )}
          <TableContainer>
            <StyledTable>
              <TableHead>
                <HeadRow>
                  {!showInvitationView && <HeadCell>Invite</HeadCell>}
                  <HeadCell>Name</HeadCell>
                  <HeadCell>Relation</HeadCell>
                  <HeadCell>Mobile Number</HeadCell>
                  <HeadCell>Email Address</HeadCell>
                  <HeadCell>
                    {showInvitationView ? "Invited Time" : "Remove"}
                  </HeadCell>
                </HeadRow>
              </TableHead>
              {friendAndFamilyData?.length ? (
                <TableBody>
                  {(showInvitationView
                    ? friendAndFamilyData.filter(
                      (member) => member.checked === true,
                    )
                    : friendAndFamilyData
                  ).map((member) => (
                    <BodyRow key={member.id}>
                      {!showInvitationView && (
                        <BodyCell>
                          <CheckBoxWrapper>
                            <CheckBoxInput
                              checked={member.checked}
                              onChange={(e) =>
                                handleSelectedInvaitationMembers(
                                  member.id,
                                  e.target.checked,
                                )
                              }
                            />
                            <CheckMark />
                          </CheckBoxWrapper>
                        </BodyCell>
                      )}

                      <BodyCell $withDivider>{member.name}</BodyCell>

                      <BodyCell $withDivider>{member.relation}</BodyCell>

                      <BodyCell $withDivider>{member.mobile}</BodyCell>

                      <BodyCell $withDivider>{member.email}</BodyCell>

                      <BodyCell style={{ textAlign: "-webkit-center" }}>
                        {showInvitationView ? (
                          member.inviteTime
                        ) : (
                          <Icon
                            src={crossIcon}
                            alt="cross"
                            height={36}
                            width={36}
                            onClick={() => {
                              setDeleteMemberId(member.id);
                              setShoDeleteModel(true);
                            }}
                          />
                        )}
                      </BodyCell>
                    </BodyRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <BodyRowWithCenter>
                    <BodyCell colSpan={6}>No data found!</BodyCell>
                  </BodyRowWithCenter>
                </TableBody>
              )}
            </StyledTable>
          </TableContainer>
          {!showInvitationView && (
            <AddNewButton onClick={() => setShowModel(true)}>
              + Add New
            </AddNewButton>
          )}
          {!showInvitationView && (
            <StepSection>
              <StepSpan>Step 2 -</StepSpan>
              <Paragraph>
                Click on the Send invitation Button to send your guests a Link
                Via SMS Text Message & email
              </Paragraph>
            </StepSection>
          )}
        </BodySection>
        <FooterSection>
          {!showInvitationView && (
            <Button
              bgcolor="#027564"
              color="#FFFFFF"
              hasIcon
              iconWidth={20}
              iconHeight={20}
              src={inviteIcon}
              border="1px solid #ffffff"
              padding="15px 20px"
              width="220px"
              onClick={handleSendInvitation}
              isLoading={isSendingInvitation}
            >
              Send Invitation
            </Button>
          )}
          <Button
            bgcolor="#D42A2A"
            hoverBg="#AD1111"
            color="#FFFFFF"
            hasIcon
            border="1px solid #ffffff"
            padding="15px 20px"
            width="220px"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </FooterSection>

        <AppModal
          id="deleteMember"
          title="Delete Member"
          background="#0A0A0AC7"
          onClose={() => setShoDeleteModel(false)}
          isOpen={showDeleteModel}
          width="420px"
          height="280px"
        >
          <ModelBody>
            <DeleteContainer>
              <DeleteTitle>Are you sure?</DeleteTitle>

              <DeleteDescription>
                Do you really want to delete this member? This action cannot be
                undone.
              </DeleteDescription>

              <DeleteButtonGroup>
                <Button
                  bgcolor="#D42A2A"
                  hoverBg="#AD1111"
                  color="#FFFFFF"
                  border="1px solid #ffffff"
                  padding="12px 24px"
                  width="160px"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>

                <Button
                  bgcolor="#027564"
                  color="#FFFFFF"
                  border="1px solid #ffffff"
                  padding="12px 24px"
                  width="160px"
                  onClick={() => setShoDeleteModel(false)}
                >
                  Cancel
                </Button>
              </DeleteButtonGroup>
            </DeleteContainer>
          </ModelBody>
        </AppModal>
        <AppModal
          id="addFamilyAndFriendsModal"
          title="Add Family and Friends"
          isOpen={showModel}
          onClose={() => {
            setShowModel(false);
            reset();
            clearErrors();
          }}
          background="#0A0A0AC7"
          headerIcon={peopleIcon}
        >
          <ModelBody>
            <Form onSubmit={handleSubmit(handleAddMember)}>
              <FormWrapper>
                <FormGroup>
                  <Label>Participant Name</Label>
                  <Input
                    style={{ borderColor: errors.name ? "red" : undefined }}
                    placeholder="John Martin"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
                </FormGroup>

                <FormGroup>
                  <Label>Phone Number</Label>
                  <Controller
                    name="mobile"
                    control={control}
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <StyledPhoneInput
                        {...field}
                        defaultCountry="US"
                        placeholder="Enter phone number"
                      />
                    )}
                  />

                  {errors.mobile && (
                    <ErrorText>{errors.mobile.message}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Email Address</Label>
                  <Input
                    style={{ borderColor: errors.email ? "red" : undefined }}
                    placeholder="test@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <ErrorText>{errors.email.message}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Select Relation</Label>
                  <Input
                    style={{ borderColor: errors.relation ? "red" : undefined }}
                    placeholder="Father"
                    {...register("relation", {
                      required: "Relation is required",
                    })}
                  />
                  {errors.relation && (
                    <ErrorText>{errors.relation.message}</ErrorText>
                  )}
                </FormGroup>
              </FormWrapper>

              <ModelFooter>
                <ModelPrimaryButton type="submit">
                  Add Participant
                </ModelPrimaryButton>
              </ModelFooter>
            </Form>
          </ModelBody>
        </AppModal>
      </PageWrapper>
    </Container>
  );
};
