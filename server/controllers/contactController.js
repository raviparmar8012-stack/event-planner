const submitContact = (req, res) => {

    const { name, email, subject, message } = req.body;

    console.log("Contact From Data");
    console.log({
        name,
        email,
        subject,
        message
    });
    res.status(200).send({
        success: true,
        message: "Your Message has been submitted successfully."
    });
};

module.exports = {
    submitContact
};