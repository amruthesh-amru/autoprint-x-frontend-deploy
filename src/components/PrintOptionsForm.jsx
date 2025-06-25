import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOption } from "@/app/slices/printOptionSlice";

const PrintOptionsForm = () => {
  const totalPages = useSelector((state) => state.pageNumber.value);
  const dispatch = useDispatch();
  const [options, setOptions] = useState({
    fileName: "",
    paperSize: "A4",
    color: "color",
    duplex: false,
    copies: 1,
    orientation: "portrait",
    pageRange: "",
    selectAll: false,
    binding: "none",
    estimatedCost: 0,
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({
    pageRange: "",
    copies: "",
  });

  // Validation functions
  const validatePageRange = (range, totalPages) => {
    if (!range || range.trim() === "") {
      return ""; // Empty is valid if selectAll is true
    }

    // Remove spaces and validate format
    const cleanRange = range.replace(/\s/g, "");
    const pageRangePattern = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;

    if (!pageRangePattern.test(cleanRange)) {
      return "Invalid format. Use: 1-5,7,9-12";
    }

    // Validate individual pages and ranges
    const parts = cleanRange.split(",");
    for (let part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (start >= end) {
          return "Invalid range: start page must be less than end page";
        }
        if (start < 1 || end > totalPages) {
          return `Pages must be between 1 and ${totalPages}`;
        }
      } else {
        const page = Number(part);
        if (page < 1 || page > totalPages) {
          return `Pages must be between 1 and ${totalPages}`;
        }
      }
    }

    return "";
  };

  const validateCopies = (copies) => {
    const num = Number(copies);
    if (num < 1) {
      return "Number of copies must be at least 1";
    }
    if (num > 100) {
      return "Maximum 100 copies allowed";
    }
    if (!Number.isInteger(num)) {
      return "Number of copies must be a whole number";
    }
    return "";
  };

  const validateForm = (newOptions) => {
    const errors = {};

    // Validate page range only if not selecting all pages
    if (!newOptions.selectAll) {
      errors.pageRange = validatePageRange(newOptions.pageRange, totalPages);
    }

    // Validate copies
    errors.copies = validateCopies(newOptions.copies);

    setValidationErrors(errors);
    return !errors.pageRange && !errors.copies;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setOptions((prev) => {
      const newOptions = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Handle selectAll checkbox logic
      if (name === "selectAll" && checked) {
        newOptions.pageRange = "";
      }

      // Handle pageRange changes
      if (name === "pageRange" && value.trim() === "") {
        newOptions.selectAll = true;
      } else if (name === "pageRange" && value.trim() !== "") {
        newOptions.selectAll = false;
      }

      // Validate the form
      const isValid = validateForm(newOptions);

      // Only dispatch if validation passes or if it's a field that doesn't affect core functionality
      if (
        isValid ||
        name === "paperSize" ||
        name === "color" ||
        name === "orientation" ||
        name === "duplex" ||
        name === "binding"
      ) {
        dispatch(setOption(newOptions));
      }

      return newOptions;
    });
  };

  const calculateSelectedPages = (range) => {
    if (!range || range.trim() === "") return 0;

    try {
      const cleanRange = range.replace(/\s/g, "");
      return cleanRange.split(",").reduce((total, part) => {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          return total + (end - start + 1);
        }
        return total + 1;
      }, 0);
    } catch {
      return 0; // Return 0 if there's an error parsing
    }
  };

  // Compute estimated cost based on options and total pages.
  const computedCost = useMemo(() => {
    // Only calculate cost if there are no validation errors
    if (validationErrors.pageRange || validationErrors.copies) {
      return 0;
    }

    const pages = options.selectAll
      ? totalPages
      : calculateSelectedPages(options.pageRange);

    if (pages <= 0) return 0;

    let cost =
      pages * (options.color === "color" ? 5 : 2) * Number(options.copies);
    if (options.binding !== "none" && options.binding !== "staple") cost += 10;
    if (options.duplex) cost = cost / 2;
    return Math.max(0, cost);
  }, [
    totalPages,
    options.selectAll,
    options.pageRange,
    options.color,
    options.copies,
    options.duplex,
    options.binding,
    validationErrors.pageRange,
    validationErrors.copies,
  ]);

  // Update the estimatedCost field and dispatch updated options when computedCost changes.
  useEffect(() => {
    if (computedCost !== options.estimatedCost) {
      setOptions((prev) => {
        const newOptions = { ...prev, estimatedCost: computedCost };
        // Only dispatch if there are no validation errors
        if (!validationErrors.pageRange && !validationErrors.copies) {
          dispatch(setOption(newOptions));
        }
        return newOptions;
      });
    }
  }, [computedCost, options.estimatedCost, dispatch, validationErrors]);

  // Check if form is valid for submission
  const isFormValid =
    !validationErrors.pageRange &&
    !validationErrors.copies &&
    (options.selectAll || options.pageRange.trim() !== "") &&
    options.copies >= 1;

  // Only show validation warnings when a document is uploaded
  const shouldShowValidationWarnings = totalPages > 0;

  return (
    <>
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        Print Options
      </h2>
      <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-200 flex w-full items-center justify-evenly gap-10">
        {/* Left Column */}
        <div className="flex flex-col">
          {/* Paper Size */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Paper Size
            </label>
            <select
              name="paperSize"
              value={options.paperSize}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
            </select>
          </div>
          {/* Orientation */}
          <div>
            <label className="block mt-4 text-gray-700 font-medium">
              Orientation
            </label>
            <select
              name="orientation"
              value={options.orientation}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          {/* Color Selection */}
          <div>
            <label className="block mt-4 text-gray-700 font-medium">
              Color
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="color"
                  value="color"
                  checked={options.color === "color"}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Color</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="color"
                  value="bw"
                  checked={options.color === "bw"}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Black & White</span>
              </label>
            </div>
          </div>
          {/* Duplex Printing */}
          {totalPages > 1 && (
            <div>
              <label className="block mt-4 text-gray-700 font-medium">
                Duplex (Double-Sided)
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="duplex"
                  checked={options.duplex}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2">Enable</span>
              </div>
            </div>
          )}
        </div>
        {/* Right Column */}
        <div className="flex flex-col justify-start gap-2">
          {/* Page Range / Select All */}
          <div className="flex flex-col gap-1">
            <label className="block text-gray-700 font-medium">
              Page Range
            </label>
            <input
              type="text"
              name="pageRange"
              placeholder="e.g., 1-5,7,9-12"
              value={options.pageRange}
              onChange={handleChange}
              disabled={options.selectAll}
              className={`w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400 ${
                validationErrors.pageRange
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.pageRange && shouldShowValidationWarnings && (
              <span className="text-red-500 text-sm mt-1">
                {validationErrors.pageRange}
              </span>
            )}
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="selectAll"
                checked={options.selectAll}
                onChange={handleChange}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2">Select All Pages ({totalPages})</span>
            </div>
          </div>
          {/* Copies */}
          <div>
            <label className="block mt-4 text-gray-700 font-medium">
              Number of Copies
            </label>
            <input
              type="number"
              name="copies"
              min="1"
              max="100"
              value={options.copies}
              onChange={handleChange}
              className={`w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400 ${
                validationErrors.copies
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.copies && shouldShowValidationWarnings && (
              <span className="text-red-500 text-sm mt-1">
                {validationErrors.copies}
              </span>
            )}
          </div>
          {/* Binding Options */}
          <div>
            <label className="block mt-4 text-gray-700 font-medium">
              Binding
            </label>
            <select
              name="binding"
              value={options.binding}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="none">None</option>
              <option value="staple">Staple</option>
              <option value="spiral">Spiral</option>
              <option value="clip">Clip</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-4 text-gray-700 font-medium flex justify-between items-center">
        <span>Estimated Cost:</span>
        <div className="flex flex-col items-end">
          <span
            className={`font-bold ${
              isFormValid ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            ₹{options.estimatedCost}
          </span>
          {!isFormValid && shouldShowValidationWarnings && (
            <span className="text-red-500 text-xs">Fix errors to see cost</span>
          )}
        </div>
      </div>
      {!isFormValid && shouldShowValidationWarnings && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="text-yellow-700 text-sm">
              Please fix the validation errors above before proceeding.
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default PrintOptionsForm;
