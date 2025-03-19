import React, { useEffect, useState } from "react";
import { getDetailCvService } from "../../../service/cvService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserCv = () => {
  const { id } = useParams();
  const [dataCV, setDataCV] = useState({});

  useEffect(() => {
    if (id) {
      const fetchCV = async () => {
        try {
          const response = await getDetailCvService(id);

          if (response.status === "SUCCESS") {
            setDataCV(response.data);
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Error fetching CV details"
          );
        }
      };
      fetchCV();
    } else {
      toast.error("Không tìm thấy ID CV.");
    }
  }, [id]);

  // Handle base64 PDF file
  const fileUrl = dataCV.file
    ? dataCV.file.startsWith("data:application/pdf;base64,")
      ? dataCV.file // If it already includes the data URI prefix
      : `data:application/pdf;base64,${dataCV.file}` // Add prefix if missing
    : "";

  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Giới thiệu bản thân</h4>
            <blockquote className="blockquote blockquote-primary">
              <p>{dataCV.description || "Chưa có mô tả"}</p>
            </blockquote>
          </div>
          <div className="card-body">
            <h4 className="card-title">FILE CV</h4>
            {fileUrl ? (
              <iframe
                width="100%" // Use percentage for responsive design
                height="700px"
                src={fileUrl}
                title="CV File"
                style={{ border: "none" }} // Optional: remove border
              ></iframe>
            ) : (
              <p>Không có file CV để hiển thị.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCv;
