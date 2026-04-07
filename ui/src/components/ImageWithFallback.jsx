import React, { useState } from "react";

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={300}
      height={450}
      onError={() => {
        setImgSrc("https://davidkoepp.com/wp-content/themes/blankslate/images/Movie%20Placeholder.jpg");
      }}
    />
  );
};

export default ImageWithFallback;