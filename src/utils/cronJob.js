const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");
// the job will run everday in the morning 8 AM
cron.schedule("0 8 * * *", async () => {
  //send email to for pending requests of previous day
  try {
    const yesturday = subDays(new Date(), 1);
    const yesturdayStartOfDay = startOfDay(yesturday);
    const yesturdayEndOfDay = endOfDay(yesturday);

    const pendingConnectionOfYesturday = await ConnectionRequest.find({
      status: "Interested",
      createdAt: {
        $gte: yesturdayStartOfDay,
        $lt: yesturdayEndOfDay,
      },
    }).populate("toUserId");
    //set operator return an object{} so we need to convert it to an array
    const listOfEmails = [
      ...new Set(
        pendingConnectionOfYesturday.map((req) => req.toUserId.emailId)
      ),
    ];
    //console.log(listOfEmails);
    for (const email of listOfEmails) {
      try {
        await sendEmail.run(
          "Notification from Dev-Tinder",
          "You have got new requests from " + email
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
