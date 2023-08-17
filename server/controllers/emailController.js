const nodemailer = require("nodemailer");
const Subscriber = require("../models/emailModel");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.subscribeEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const existingSubsriber = await Subscriber.findOne({ email });
    if (existingSubsriber) {
      return res.status(404).json({ error: "Email already subscribed" });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    const confirmLink = `http://localhost:3000/confirm/${encodeURIComponent(
      email
    )}`;

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Welcome to Proventus Nexus",
      html: `
              <div style="text-align: center; font-family: Poppins, sans-serif;">
                <h1 style="font-size: 24px;">Welcome to Proventus Nexus</h1>
                <a href="https://ibb.co/MRGSPYw"><img src="https://i.ibb.co/MRGSPYw/logo.jpg" alt="logo" border="0" /></a>
                <p style="font-size: 16px;">
                  Thanks for subscribing to our newsletter. 
                  Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the button below:
                </p>
          

                <a style="font-size: 12px; text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px;" href="${confirmLink}">
                Confirm Subscription
                </a>
          
                <p style="font-size: 12px; margin-top: 20px;">
                  You are receiving this email because you subscribed to Proventus Nexus newsletter.
                </p>
          
                <a style="font-size: 12px;" href="http://localhost:3000/signup">
                  Create Proventus Nexus Account 
                </a>
          
                <p style="font-size: 10px;">
                  ® © 2022 Proventus Nexus, Inc. All Rights Reserved. 
          
                <p style="font-size: 12px;">
                  Bulevardi i Pare, Tirane, Albania
                </p>
              </div>
            `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.log("Email subsription failed:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({});
    res.status(200).json(subscribers);
  } catch (error) {
    console.log("Failed to get subscribers:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.sendTaskEmail = async (req, res) => {
  const { email, title, description } = req.body;
  try {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "New Task Created",
      html: `
      <div>
        <h1>New Task Created</h1>
        <p>Title: ${title}</p>
        <p>Description: ${description}</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Task email sent successfully" });
  } catch (error) {
    console.log("Task email sending failed:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.sendProjectEmail = async (req, res) => {
  const { email, name, description, tasks, users } = req.body;

  const taskList = tasks.map((task) => `<li>${task.title}</li>`).join("");
  const userList = users
    .map((user) => `<li>${user.name} ${user.surname}</li>`)
    .join("");

  try {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "New Project Created",
      html: `
        <div>
          <h1>New Project Created</h1>
          <p>Name: ${name}</p>
          <p>Description: ${description}</p>
          <h2>Tasks:</h2>
          <ul>
            ${taskList}
          </ul>
          <h2>Users:</h2>
          <ul>
            ${userList}
          </ul>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Project email sent successfully" });
  } catch (error) {
    console.log("Project email sending failed", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.confirmSubscription = async (req, res) => {
  const { email } = req.params;

  try {
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(400).json({ error: "Subscriber not found" });
    }
    subscriber.confirmed = true;
    await subscriber.save();

    res.status(200).json({ message: "Subscription confirmed" });
  } catch (error) {
    console.log("Confirmation error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
