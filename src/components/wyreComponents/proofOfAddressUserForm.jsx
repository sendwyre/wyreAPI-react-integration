import React from "react";
import { uploadWyreDocument } from "../../services/wyreApiService";
import UserProfile from "../userProfile";
import { updateAccountValues } from "../../wyreapiconfig.json";
import Dropzone, { useDropzone } from "react-dropzone";

class ProofOfAddressUserForm extends UserProfile {
  state = {
    data: {},
    errors: { name: "" }
  };
  schema = {};

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      let wyreAccountId = await JSON.parse(localStorage.getItem("wyreAccount"))
        .id;
      await uploadWyreDocument(
        this.state.file,
        updateAccountValues.proofOfAddress,
        wyreAccountId
      );
      window.location = "/userProfile";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  onDrop = acceptedFiles => {
    this.setState({ file: acceptedFiles[0] });
  };

  render() {
    const maxSize = 5242880;
    return (
      <div>
        <p>Please submit a valid Proof of Address Form</p>
        <form onSubmit={this.handleSubmit}>
          {/* {this.renderInput("cellPhoneAreaCode", "Area Code")} */}
          <Dropzone
            onDrop={this.onDrop}
            accept="image/jpeg"
            minSize={0}
            maxSize={maxSize}
            multiple
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragReject,
              rejectedFiles
            }) => {
              const isFileTooLarge =
                rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
              return (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {!isDragActive && "Click here or drop a file to upload!"}
                  {isDragActive && !isDragReject && "Drop it like it's hot!"}
                  {isDragReject && "File type not accepted, sorry!"}
                  {isFileTooLarge && (
                    <div className="text-danger mt-2">File is too large.</div>
                  )}
                </div>
              );
            }}
          </Dropzone>
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}

export default ProofOfAddressUserForm;
