import React from 'react';
import QRCode from 'react-qr-code';

interface QrCodeProps {
  url: string;
}

export const QrCode: React.FC<QrCodeProps> = ({ url }) => {
  return (
    <div className="w-32 h-32 p-2 bg-white">
      <QRCode
        value={url}
        size={128}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 128 128`}
      />
    </div>
  );
}; 