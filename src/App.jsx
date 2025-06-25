import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "./app/slices/cartSlice";
import { setOptionField } from "./app/slices/printOptionSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCartFiles } from "./contexts/CartFileContext.jsx"; // Adjust the import path as needed
import PrintOptionsForm from "./components/PrintOptionsForm";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import PDFDropzone from "./components/PDFDropzone";
import PdfPreview from "./components/PdfPreview";
import { pdfjs } from "react-pdf";
import { API } from "./utils/api";
// ...other imports and code

// Helper: Modified to return a File for cart use
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const getFileForCart = (originalFile, extractedPdf, pageRange) => {
  if (!pageRange || pageRange.trim() === "") {
    return originalFile;
  } else {
    return new File([extractedPdf], originalFile.name, {
      type: extractedPdf.type,
      lastModified: originalFile.lastModified,
    });
  }
};

function App() {
  const dispatch = useDispatch();
  const printOption = useSelector((state) => state.printOption.value);
  const [file, setFile] = useState(null);
  const [extractedFileUrl, setExtractedFileUrl] = useState(null);
  const [extractedPdf, setExtractedPdf] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to manage object URL cleanup
  const extractedUrlRef = useRef(null);

  const { addCartFile } = useCartFiles();

  // Helper to update object URL safely
  const updateExtractedFileUrl = (newUrl) => {
    if (extractedUrlRef.current) {
      URL.revokeObjectURL(extractedUrlRef.current);
    }
    extractedUrlRef.current = newUrl;
    setExtractedFileUrl(newUrl);
  };

  const handleFileAccepted = (file) => {
    console.log("PDF received:", file);
    setFile(file);
    updateExtractedFileUrl(URL.createObjectURL(file));
    setExtractedPdf(null);
    // Save the file name in print options
    dispatch(setOptionField({ key: "fileName", value: file.name }));
    setErrorMessage(null);
  };

  const clearFile = () => {
    if (extractedUrlRef.current) {
      URL.revokeObjectURL(extractedUrlRef.current);
      extractedUrlRef.current = null;
    }
    setFile(null);
    setExtractedFileUrl(null);
    setExtractedPdf(null);
    setErrorMessage(null);
  };

  // ... (your existing extractPagesFromPdf and handleExtractPages logic)

  const addToCart = async () => {
    if (!file) {
      setErrorMessage("Please upload a PDF file first.");
      return;
    }

    // Validate print options before proceeding
    if (!printOption || printOption.estimatedCost <= 0) {
      setErrorMessage(
        "Please fix the print option errors before adding to cart."
      );
      return;
    }

    // Validate that either all pages are selected or page range is provided
    if (
      !printOption.selectAll &&
      (!printOption.pageRange || printOption.pageRange.trim() === "")
    ) {
      setErrorMessage(
        "Please select pages to print or choose 'Select All Pages'."
      );
      return;
    }

    // Validate copies
    if (
      !printOption.copies ||
      printOption.copies < 1 ||
      printOption.copies > 100
    ) {
      setErrorMessage("Please enter a valid number of copies (1-100).");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // First, call the pre-upload endpoint
      const formDataUpload = new FormData();
      formDataUpload.append("pdf", file, file.name);

      const uploadResponse = await axios.post(
        API.PRE_UPLOAD,
        formDataUpload,
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract S3 URL and key from response
      const { fileUrl, key } = uploadResponse.data;

      // Generate a unique ID for the cart item
      const uniqueId = Date.now().toString();

      // Create metadata including the S3 URL
      const fileMetadata = {
        id: uniqueId,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        previewUrl: extractedFileUrl, // For display purposes
        s3Url: fileUrl, // Persisted S3 URL
        s3Key: key, // Optionally store the key if needed for deletion
      };

      // Dispatch the cart item to Redux with metadata including the S3 URL
      dispatch(
        addCartItem({
          id: uniqueId,
          pdf: fileMetadata,
          printOptions: printOption,
        })
      );

      // You can optionally still add the file to your context if needed,
      // but now the order will rely on the S3 URL.
      addCartFile({
        id: uniqueId,
        file, // optionally store the file if needed; otherwise you may omit this.
      });
      console.log(printOption);

      await axios.post(
        API.ADD_TO_CART,
        {
          orderData: {
            pdf: fileMetadata,
            printOptions: printOption,
          },
        },
        { withCredentials: true }
      );

      console.log("Item added to cart.");
      clearFile();
    } catch (error) {
      console.error("Error adding to cart", error);
      setErrorMessage("Error adding to cart. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  // Clean up object URLs on unmount.
  useEffect(() => {
    return () => {
      if (extractedUrlRef.current) {
        URL.revokeObjectURL(extractedUrlRef.current);
      }
    };
  }, []);

  return (
    <>
      <Header />
      <div className="flex justify-evenly items-start pt-[2rem]">
        <div className="flex w-[100%] justify-center gap-10 items-start">
          {!file && (
            <div className="max-w-2xl p-8">
              <h1 className="text-2xl font-bold mb-6">Upload PDF</h1>
              <PDFDropzone onFileAccepted={handleFileAccepted} />
            </div>
          )}
          {file && (
            <div className="flex items-center justify-center">
              <PdfPreview pdf={extractedFileUrl} />
            </div>
          )}
          <div className="flex flex-col items-start justify-start gap-4">
            <div>
              <PrintOptionsForm />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {isLoading && <p>Processing...</p>}
            {file && (
              <div className="flex flex-col w-full gap-4">
                <button
                  type="button"
                  onClick={clearFile}
                  className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-red-500 transition"
                >
                  Clear Document Selected
                </button>
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={
                    isLoading || !printOption || printOption.estimatedCost <= 0
                  }
                  className={`w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md transition ${
                    isLoading || !printOption || printOption.estimatedCost <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-500"
                  }`}
                >
                  {isLoading ? "Processing..." : "Add to Cart"}
                </button>
              </div>
            )}
            <div className="flex flex-col w-full gap-4">
              <Link to="/cart">
                <button
                  type="button"
                  className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-500 transition"
                >
                  Go to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
