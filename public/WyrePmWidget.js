var handler = new WyrePmWidget({
  env: "test",
  onLoad: function() {
    handler.open();
  },
  onSuccess: async function(result) {
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
    window.location = "/userProfile";
  }
});
