import React from 'react';
import QRCode from 'qrcode.react';

interface QrCodeProps {
  url: string;
}

export const QrCode: React.FC<QrCodeProps> = ({ url }) => {
  return (
    <div className="w-full h-auto">
      <QRCode
        value={url}
        size={128}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
        style={{ width: '100%', height: 'auto' }}
        renderAs="canvas"
      />
    </div>
  );
}; 