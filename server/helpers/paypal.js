const paypal = require("paypal-rest-sdk");

const MODE = process.env.PAYPAL_MODE; // "sandbox" | "live"
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

function isValidMode(m) {
  return m === "sandbox" || m === "live";
}

if (isValidMode(MODE) && CLIENT_ID && CLIENT_SECRET) {
  paypal.configure({
    mode: MODE,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  module.exports = paypal;
} else {
  // Export a safe stub that signals misconfiguration at call time, not at import time
  console.warn(
    "PayPal not configured. Set PAYPAL_MODE, PAYPAL_CLIENT_ID, and PAYPAL_CLIENT_SECRET in .env"
  );
  module.exports = {
    payment: {
      create: (_payload, cb) =>
        cb(new Error("PAYPAL_NOT_CONFIGURED: Missing PayPal environment variables")),
    },
  };
}
