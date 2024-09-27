import React, { useState } from 'react';
import { MdUpload } from 'react-icons/md';
import { IoSend } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/ai'; // 미리보기 제거
import axios from 'axios';

interface UploadedItem {
  file?: File;
  message?: string;
  fileUrl?: string;
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleUpload = async () => {
    if (file || message) {
      const formData = new FormData();
      if (file) formData.append('file', file); // file이 null일 경우 추가하지 않음
      formData.append('message', message);

      try {
        const response = await axios.post('http://localhost:3000/api/users/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const newItem: UploadedItem = {
          fileUrl: response.data.fileUrl,
          message: response.data.message,
        };

        setUploadedItems([...uploadedItems, newItem]);

        // 입력 필드 초기화
        setFile(null);
        setMessage('');
      } catch (error) {
        console.error('Error uploading file', error);
      }
    } else {
      alert('파일 또는 메시지를 입력하세요.');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="message-input-container">
      <div className="uploaded-items">
        {uploadedItems.map((item, index) => (
          <div key={index} className="uploaded-item">
            {item.fileUrl && (
              <div className="uploaded-file">
                <p>파일 이름: {file?.name}</p>
                <img
                  src={item.fileUrl}
                  alt="Uploaded"
                  className="uploaded-image"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
                <a 
                  href={item.fileUrl} 
                  download={file?.name} 
                  className="download-link"
                >
                  파일 다운로드
                </a>
              </div>
            )}
            {item.message && <p>{item.message}</p>}
          </div>
        ))}
      </div>

      {/* 파일 미리보기 */}
      {file && (
        <div className="file-preview">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name} 
            className="file-preview-image" 
            style={{ maxWidth: '100px', maxHeight: '100px' }}
          />
          <button className="remove-file-button" onClick={handleRemoveFile}>
            <AiOutlineClose size={16} />
          </button>
        </div>
      )}

      <div className="message-input-wrapper">
        <label htmlFor="file-upload" className="icon-button">
          <MdUpload size={24} />
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }} // 파일 업로드 버튼 숨김 처리
        />
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={handleMessageChange}
          className="input-field"
        />
        <button onClick={handleUpload} className="icon-button">
          <IoSend size={19} />
        </button>
      </div>
    </div>
  );
};

export default FileUploader;