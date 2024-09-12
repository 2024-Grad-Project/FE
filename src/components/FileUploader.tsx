import React, { useState } from 'react';
import { MdUpload } from 'react-icons/md';  // 첨부 버튼 아이콘
import { IoSend } from 'react-icons/io5';   // 업로드 버튼 아이콘
import { AiOutlineClose } from 'react-icons/ai'; // 미리보기 제거 버튼

interface UploadedItem {
  file?: File;
  message?: string;
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

  const handleUpload = () => {
    if (file || message) {
      const newItem: UploadedItem = {
        file: file || undefined, 
        message: message || undefined,
      };
      setUploadedItems([...uploadedItems, newItem]);

      // Reset input fields after upload
      setFile(null);
      setMessage('');
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
            {item.file && (
              <div className="uploaded-file">
                <p>파일 이름: {item.file.name}</p>
                <img
                  src={URL.createObjectURL(item.file)}
                  alt={item.file.name}
                  className="uploaded-image"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
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