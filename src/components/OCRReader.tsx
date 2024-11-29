// import React, { useState } from "react";
// import Tesseract from "tesseract.js";

// const OCRReader: React.FC = () => {
//   const [imageSrc, setImageSrc] = useState<string | null>(null);
//   const [text, setText] = useState<string>("");
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Handle file upload and process the image
//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Display the uploaded image
//     setImageSrc(URL.createObjectURL(file));
//     setText(""); // Clear previous text
//     setError(null);
//     setIsProcessing(true);

//     try {
//       const result = await Tesseract.recognize(
//         file,
//         "eng", // Language
//         {
//           logger: (m) => console.log(m), // Log progress
//         }
//       );
//       setText(result.data.text); // Set the recognized text
//       setIsProcessing(false); // Stop processing state
//     } catch (error) {
//       setError(error + "Failed to process the image.");
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="ocr-reader">
//       <h2>OCR Text Recognition</h2>

//       <input type="file" accept="image/*" onChange={handleFileUpload} />

//       {imageSrc && <img src={imageSrc} alt="Uploaded" width="300" />}

//       {isProcessing && <p>Processing...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <div>
//         <h3>Recognized Text:</h3>
//         <textarea
//           value={text}
//           readOnly
//           rows={10}
//           cols={50}
//           style={{ width: "100%", padding: "10px" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default OCRReader;
