import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmInvitationService } from "../../service/InvitationService";
import { toast } from "react-toastify";
import "./ConfirmInvitationPage.scss";

const ConfirmInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleConfirm = async (accept) => {
    setIsLoading(true);
    try {
      const response = await confirmInvitationService(token, accept);
      if (response.status === "SUCCESS") {
        toast.success(response.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(response.message || "Xác nhận thất bại!");
      }
    } catch (error) {
      console.error("Error confirming invitation:", error);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <div>Token không hợp lệ!</div>;
  }

  return (
    <div className="confirm-invitation-page">
      <div className="confirm-invitation-page__content">
        <h2>Xác nhận lời mời vào công ty</h2>
        <p>Bạn có muốn gia nhập công ty này không?</p>
        <div className="confirm-invitation-page__buttons">
          <button
            onClick={() => handleConfirm(true)}
            className={`confirm-btn ${isLoading ? "confirm-btn--loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đồng ý"}
          </button>
          <button
            onClick={() => handleConfirm(false)}
            className={`reject-btn ${isLoading ? "reject-btn--loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Từ chối"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmInvitationPage;
