import { Router } from "express";
import {
  acceptInvitationController,
  createInvitationsController,
  getInvitationStatusController,
  getActiveInvitationController,
  getInviteDetailsController,
  sendSmsController,
  waitingRoomReminderController,
  nudgeGuestsController,
  concludeMeetingController,
  leaveMeetingController,
} from "../controllers/invitations.controller";

const router = Router();

router.post("/create", createInvitationsController);
router.post("/accept", acceptInvitationController);
router.get("/status", getInvitationStatusController);
router.get("/active", getActiveInvitationController);
router.get("/invite/:inviteId", getInviteDetailsController);
router.post("/send-sms", sendSmsController);
router.post("/waiting-room-reminder", waitingRoomReminderController);
router.post("/nudge-guests", nudgeGuestsController);
router.post("/leave", leaveMeetingController);

router.post("/conclude", concludeMeetingController);

export default router;
