import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Spinner,
} from "reactstrap";
import { createNewCv } from "../../service/cvService";
import "./modal.css";

function SendCvModal(props) {
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    userId: "",
    postId: "",
    file: null, 
    description: "",
    filePreview: "",
    fileName: "",
  });

  useEffect(() => {
    if (userData) {
      setInputValue((prev) => ({
        ...prev,
        userId: userData.userId,
        postId: props.postId,
      }));
    }
  }, [props.postId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnChangeFile = (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputValue((prev) => ({
          ...prev,
          file: reader.result,
          filePreview: URL.createObjectURL(file),
          fileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendCV = async () => {
    if (!inputValue.file) {
      toast.error("Vui lòng chọn file CV");
      return;
    }

    setIsLoading(true);
    const data = {
      userId: inputValue.userId,
      postId: inputValue.postId,
      file: inputValue.file,
      description: inputValue.description,
      fileName: inputValue.fileName, 
    };

    try {
      const response = await createNewCv(data);
      setIsLoading(false);

      if (response.status === "SUCCESS") {
        setInputValue({
          userId: inputValue.userId,
          postId: inputValue.postId,
          file: null,
          description: "",
          filePreview: "",
          fileName: "",
        });
        toast.success("Đã gửi thành công");
        props.onHide();
      } else {
        toast.error("Gửi thất bại");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Đã xảy ra lỗi khi gửi CV");
    }
  };

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        className={"booking-modal-container"}
        size="md"
        centered
      >
        <p className="text-center">NỘP CV CỦA BẠN CHO NHÀ TUYỂN DỤNG</p>
        <ModalBody>
          Nhập lời giới thiệu gửi đến nhà tuyển dụng
          <div>
            <textarea
              placeholder="Giới thiệu sơ lược về bản thân để tăng sự yêu thích đối với nhà tuyển dụng"
              name="description"
              className="mt-2"
              style={{ width: "100%" }}
              rows="5"
              value={inputValue.description}
              onChange={handleChange}
            />

            <input
              type="file"
              className="mt-2"
              accept=".pdf,.doc,.docx"
              onChange={handleOnChangeFile}
            />
            {inputValue.filePreview && (
              <div>
                <a
                  href={inputValue.filePreview}
                  style={{ color: "blue" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nhấn vào đây để xem lại CV của bạn
                </a>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "space-between" }}>
          <Button className="me-5" onClick={handleSendCV} disabled={isLoading}>
            Gửi hồ sơ
          </Button>

          <Button
            onClick={() => {
              setInputValue({
                userId: inputValue.userId,
                postId: inputValue.postId,
                file: null,
                description: "",
                filePreview: "",
                fileName: "",
              });
              props.onHide();
            }}
            disabled={isLoading}
          >
            Hủy
          </Button>
        </ModalFooter>

        {isLoading && (
          <Modal isOpen={true} centered contentClassName="closeBorder">
            <div
              style={{
                position: "absolute",
                right: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner animation="border" />
            </div>
          </Modal>
        )}
      </Modal>
    </div>
  );
}

export default SendCvModal;
