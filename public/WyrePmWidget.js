var handler = new WyrePmWidget({
  env: "test",
  onLoad: function() {
    // In this example we open the modal immediately on load. More typically you might have the handler.open() invocation attached to a button.
    handler.open();
  },
  onSuccess: async function(result) {
    // Here you would forward the publicToken back to your server in order to  be shipped to the Wyre API
    let wyrePaymentMethod = {
      publicToken: result.publicToken,
      paymentMethodType: "LOCAL_TRANSFER",
      country: "US"
    };
    console.log("Creating A Payment Method...");
    try {
      const { data } = await axios.post(
        "https://api.testwyre.com/v2/paymentMethods",
        wyrePaymentMethod,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("wyreSecretKey")
          }
        }
      );
      window.location = "/userProfile";
    } catch (e) {
      console.log("Error Captain", e);
      window.location = "/userProfile";
    }
  },
  onExit: function(err) {
    if (err != null) {
      // The user encountered an error prior to exiting the module
    }
    window.location = "/userProfile";
  }
});
