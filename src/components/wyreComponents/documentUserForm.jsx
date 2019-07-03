import React from "react";
import { uploadWyreDocument } from "../../services/wyreApiService";
import UserProfile from "../userProfile";
import { updateAccountValues } from "../../wyreapiconfig.json";
import Dropzone, { useDropzone } from "react-dropzone";

class DocumentUserForm extends UserProfile {
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

  // validate = () => {
  //   const options = { abortEarly: false };
  //   const result = Joi.validate(this.state.data, this.schema, options);

  //   if (!result.error) return null;

  //   const errors = {};
  //   for (let item of result.error.details) {
  //     errors[item.path[0]] = item.message;
  //   }
  //   return errors;
  // };

  doSubmit = async () => {
    try {
      let wyreAccountId = await JSON.parse(localStorage.getItem("wyreAccount"))
        .id;
      await uploadWyreDocument(
        this.state.file,
        updateAccountValues.governmentId,
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
    // console.log(acceptedFiles);
    this.setState({ file: acceptedFiles[0] });
    // const reader = new FileReader();
    // reader.onabort = () => console.log("file reading was aborted");
    // reader.onerror = () => console.log("file reading has failed");
    // reader.onload = e => {
    //   const binaryStr = reader.result;
    //   console.log("Binary data", binaryStr);
    //   const file = e.target.result;
    //   console.log(acceptedFiles[0]);
    // this.setState({ file: acceptedFiles[0] });
    //   const fileAsBlob = new Blob([e.target.result]);
    //   const fileArrayBuffer = reader.readAsArrayBuffer(fileAsBlob);
    //   this.setState({ file: fileArrayBuffer });
    // };

    // acceptedFiles.forEach(file => reader.readAsBinaryString(file));
  };

  render() {
    const maxSize = 5242880;
    return (
      <div>
        <p>Please submit a valid US Passport or Driver's License</p>
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
    // const maxSize = 1048576;

    // const onDrop = this.myDropZone(acceptedFiles => {
    //   console.log(acceptedFiles);
    // }, []);

    // const {
    //   isDragActive,
    //   getRootProps,
    //   getInputProps,
    //   isDragReject,
    //   acceptedFiles,
    //   rejectedFiles
    // } = useDropzone({
    //   onDrop,
    //   accept: "image/png",
    //   minSize: 0,
    //   maxSize
    // });

    // const isFileTooLarge =
    //   rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

    // return (
    //   <div className="container text-center mt-5">
    //     <div {...getRootProps()}>
    //       <input {...getInputProps()} />
    //       {!isDragActive && "Click here or drop a file to upload!"}
    //       {isDragActive && !isDragReject && "Drop it like it's hot!"}
    //       {isDragReject && "File type not accepted, sorry!"}
    //       {isFileTooLarge && (
    //         <div className="text-danger mt-2">File is too large.</div>
    //       )}
    //     </div>
    //   </div>
    // );
  }
}

export default DocumentUserForm;
