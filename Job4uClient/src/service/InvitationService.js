import axios from "../axios";

const inviteStaffService = (ownerEmail, staffEmail) => {
  return axios.post(`/api/invitation/invite-staff`, { ownerEmail, staffEmail });
};

const confirmInvitationService = (token, accept) => {
  return axios.post(`/api/invitation/confirm-invitation`, { token, accept });
};

export { inviteStaffService, confirmInvitationService };
