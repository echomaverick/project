const nodemailer = require('nodemailer');
const Subscriber = require('../models/emailModel');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE_PROVIDER,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

exports.subscribeEmail = async(req,res) => {
    const {email} = req.body;
    try{
        const existingSubsriber = await Subscriber.findOne({email});
        if(existingSubsriber){
            return res.status(404).json({error: 'Email already subscribed'});
        }

        const newSubscriber = new Subscriber({email});
        await newSubscriber.save();

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Welcome to Proventus Nexus",
            html: `
              <div style="text-align: center; font-family: Poppins, sans-serif;">
                <h1 style="font-size: 24px;">Welcome to Proventus Nexus</h1>
                <img src="https://ibb.co/MRGSPYw" alt="Proventus Nexus Image" style="width: 200px; height: auto; margin-top: 20px;">
                <p style="font-size: 16px;">
                  Thanks for subscribing to our newsletter. 
                  You’ll be able to get the latest news, promotions and offers.
                  We also want to make sure you’re getting the most out of your experience with us,
                  so over the next few weeks, we’ll share the best of what Proventus Nexus has to offer.
                  Keep an eye out for us in your inbox.
                </p>
          
          
                <p style="font-size: 12px; margin-top: 20px;">
                  You are receiving this email because you subscribed to Proventus Nexus newsletter.
                </p>
          
                <p style="font-size: 12px;">
                  Interested in getting the news delivered to your inbox? See all of our newsletters.
                </p>
          
                <p style="font-size: 12px;">
                  Create Proventus Nexus Account | Download the App 
                </p>
          
                <p style="font-size: 10px;">
                  ® © 2022 Proventus Nexus, Inc. All Rights Reserved. 
          
                <p style="font-size: 12px;">
                  Bulevardi i Pare, Tirane, Albania
                </p>
              </div>
            `,
        };
          
          
          
          

        await transporter.sendMail(mailOptions);

        res.status(200).json({message: 'Subscription successful'});
    }catch(error){
        console.log("Email subsription failed:", error);
        res.status(500).json({error: 'An error occurred'});
    }
}


exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({});
    res.status(200).json(subscribers);
  } catch (error) {
    console.log("Failed to get subscribers:", error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
