import React from "react";
import { uploadWyreDocument } from "../../services/wyreApiService";
import UserProfile from "../userProfile";
import { updateAccountValues } from "../../wyreapiconfig.json";
import Dropzone, { useDropzone } from "react-dropzone";

class DocumentUserForm extends UserProfile {
  state = {
    data: {},
    errors: { name: "" },
    files: []
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
      for (let i = 0; i < this.state.files.length; i++) {
        await uploadWyreDocument(
          this.state.files[i],
          updateAccountValues.governmentId,
          wyreAccountId
        );
      }
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
    const files = [...this.state.files];
    files.push(acceptedFiles[0]);
    this.setState({ files });
  };

  render() {
    const maxSize = 5242880;
    return (
      <div className="container-fluid wyre-container">
        {this.renderWyreHeader("US Driver's License or Passport")}
        <div>
          <form onSubmit={this.handleSubmit}>
            <Dropzone
              className="drop-zone"
              onDrop={this.onDrop}
              accept="image/jpeg"
              minSize={0}
              maxSize={maxSize}
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
                  <React.Fragment>
                    <div {...getRootProps()} className="drop-zone">
                      <input {...getInputProps()} />
                      {!isDragActive &&
                        "Front of Driver License (Only .jpeg files)"}
                      {isDragActive &&
                        !isDragReject &&
                        "Drop it like it's hot!"}
                      {isDragReject && "File type not accepted, sorry!"}
                      {isFileTooLarge && (
                        <div className="text-danger mt-2">
                          File is too large.
                        </div>
                      )}
                    </div>
                    <div {...getRootProps()} className="drop-zone">
                      <input {...getInputProps()} />
                      {!isDragActive &&
                        "Back of Driver License (Only .jpeg files)"}
                      {isDragActive &&
                        !isDragReject &&
                        "Drop it like it's hot!"}
                      {isDragReject && "File type not accepted, sorry!"}
                      {isFileTooLarge && (
                        <div className="text-danger mt-2">
                          File is too large.
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              }}
            </Dropzone>
            <div>
              {this.state.files.length > 0 && (
                <div>
                  <ul
                    className="list-group mt-2"
                    style={{ margin: "10px 0px" }}
                  >
                    {this.state.files.map(file => (
                      <li
                        className="list-group-item list-group-item-success"
                        key={file.name}
                      >
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="wyre-submit-div">{this.renderButton("Submit")}</div>
          </form>
        </div>
      </div>
    );
  }
}

export default DocumentUserForm;
