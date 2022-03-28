const express = require('express');
// const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;
const dotenv = require('dotenv').config()


const client = require("@mailchimp/mailchimp_marketing");


client.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER,
});


// async function run() {
//   const response = await client.ping.get();
//   console.log(response);
// }

// run();

app.use(express.static(__dirname)); // used to apply stylesheets
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // used to parse url-encoded bodies through express.

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;


    const subscribingUSer = {
        firstName: firstName,
        lastName: lastName,
        email, email
    };

    // mailchimp async function to add members per their documentation.
    const run = async () => {
        const response = await client.lists.batchListMembers('21ead8d862', {
            members: [{
                email_address: subscribingUSer.email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: subscribingUSer.firstName,
                    LNAME: subscribingUSer.lastName
                }
            }
            ]
        });
        console.log(response);
        res.sendFile(__dirname + '/success.html')
        console.log("Successfully added contact to newsletter.");
    }
    run().catch(e => res.sendFile(__dirname + '/failure.html'));

});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT)
})


// Audience ID
// 21ead8d862