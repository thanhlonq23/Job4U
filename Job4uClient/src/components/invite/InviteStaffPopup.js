import React, { useState } from "react";
import { inviteStaffService } from "../../service/InvitationService";
import { toast } from "react-toastify";
// import "./InviteStaffPopup.scss";

const InviteStaffPopup = ({ isOpen, onClose, ownerEmail }) => {
  const [staffEmail, setStaffEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await inviteStaffService(ownerEmail, staffEmail);
      if (response.data.status === "SUCCESS") {
        toast.success("Lời mời đã được gửi!");
        setStaffEmail("");
        onClose();
      } else {
        toast.error(response.data.message || "Không thể gửi lời mời!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi lời mời!");
      console.error("Error inviting staff:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="invite-staff-popup__overlay" onClick={onClose}>
      <div className="invite-staff-popup__wrapper" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Mời nhân viên</h2>
          <div className="invite-staff-popup__input-box">
            <input
              type="email"
              placeholder="Email nhân viên"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`invite-staff-popup__btn ${isLoading ? "invite-staff-popup__btn--loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi lời mời"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteStaffPopup;