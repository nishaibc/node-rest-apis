const router = require("express").Router();
const stripe = require("stripe")('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');

router.post("/payment", (req, res) => {
  console.log(req.body);
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
