export function generateToken() {
  //Storing device token on localStorage
  let devicetoken = localStorage.getItem("device_token");
  if (!devicetoken) {
    // let array = new uint8array(25);
    // window.crypto.getrandomvalues(array);
    // devicetoken = array.prototype.map
    //   .call(array, x => ("00" + x.tostring(16)).slice(-2))
    //   .join("");
    // localStorage.setItem("device_token", devicetoken);
    devicetoken = "3453223454433";
  }

  //Storing device token on servers part of user profile
  return devicetoken;
}

export function instantiateWyreWidget() {}
