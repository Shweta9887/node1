var usermodel = require('../model/usermodel');
const storage = require('node-persist');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');



storage.init( /* options ... */);

// var login_status = 0;

exports.login = async (req, res) => {

    try {

        var data = await usermodel.find({ "email": req.body.email });
        var login_status = await storage.getItem('user_id');
    
        console.log(data);
    
        
            if (login_status == undefined) {
    
                if (data.length == 1) {
    
                    bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
    
                        if (result == true) {
    
    
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'swetasanepara17@gmail.com',
                                    pass: 'nkvzzbobsdhpdvci'
                                }
                            });
    
                            var mailOptions = {
                                from: 'swetasanepara17@gmail.com',
                                to: 'swetasanepara17@gmail.com',
                                subject: 'Sending Email using Node.js',
                                text: 'That was easy!'
                            };
    
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
    
                            var token = jwt.sign({ id: data[0].id }, "cmd");
    
                            await storage.setItem('user_id', data[0].id)
                            res.status(200).json({
    
                                status: "login success",
                                token
                            })
                        }
    
                        else {
                            res.status(200).json({
    
                                status: "check your email and password"
                            })
                        }
    
                    });
    
    
                }
    
                else {
                    res.status(200).json({
    
                        status: "check your email and password"
                    })
    
                }
            }
            else {
                // login_status = 0;
                res.status(200).json({
    
                    status: "user is already login"
                })
    
            }
        
    } catch (error) {

        res.status(400).json({
    
            error
        })
        
    }

   
    }


exports.logout = async (req, res) => {

        // login_status=0
        await storage.clear();
        res.status(200).json({

            status: "user logout"
        })
    }


// if (data[0].password == req.body.password)
// {

//     login_status = 1;

//     res.status(200).json({

//         status: "login success"
//     })
// }

// nkvz zbob sdhp dvci