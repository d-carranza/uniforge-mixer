import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import styled from "styled-components";

const getColor = (props) => {
  if (props.isDragAccept) return "#68d391";
  if (props.isDragReject) return "#fc8181";
  if (props.isFocused) return "#63b3ed";
  return "#e2e8f0";
};

const Container = styled.div`
  height: 122px;
  width: 122px;
  margin-bottom: 4px;
  text-align: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

// DROPZONE COMPONENT
function Dropzone(props) {
  const { state, setState, typeIndex, traitIndex } = props;

  // Update state with the URL of the image
  function updateImg(imgInput) {
    const stateObject = { ...state };
    stateObject.attributes[typeIndex].traits[traitIndex].img = imgInput;
    return setState(stateObject);
  }

  const onDrop = useCallback((acceptedFiles) => {
    // Access to the file
    return acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Update img input
        updateImg(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "image/png": [".png"] },
  });

  return (
    <div className="container">
      <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        {state.attributes[typeIndex].traits[traitIndex].img.length > 0 ? (
          <img
            className="pngPreview"
            src={state.attributes[typeIndex].traits[traitIndex].img}
          />
        ) : (
          "Drop png here or select file"
        )}
      </Container>
    </div>
  );
}

export default Dropzone;
