const User = require('../models/usermodel');

exports.createUser = (req,res) => {
    try {
        const newUser = new User(req.body);

        //validations

        if(!newUser.username) {
            return res.status(400).json('Username cannot be empty') //checking if username is empty
        }

        if(!newUser.password) {
            return res.status(400).json('Password cannot be empty') //checking if password is empty
        }

        User.find({username: newUser.username},(err, existingUser)=>{
            if(err) {
                return res.status(400).json('server error')
            }     
            else if(existingUser.length > 0) {                      //checking if user already exists
                return res.status(400).json('User already exists')
            }

            newUser.password = newUser.generateHash(newUser.password);  //generating password hash using bcrypt

            newUser.save((err,user) => {
                if(err) {
                    return res.send('unable to add');                           //saving to db
                }
                return res.send('Success');
            })
        })
    }
    catch {
        console.log('Unable to save');
    }
}

exports.loginUser = (req,res) => {
    try {
        const {username, password} = req.body;

        if(!username) {
            return res.status(400).json('Username cannot be empty') //checking if username is empty
        }

        if(!password) {
            return res.status(400).json('Password cannot be empty') //checking if password is empty
        }

        User.find({username: username}, (err, userDetails) => {
            if(err) {
                console.log(err)
                return res.status(400).json(err)
            }
            if (userDetails.length != 1) {
                return res.status(401).json('Error logging in');
            }
            const user = userDetails[0];
            if (!user.validPassword(password)) {
                return res.status(401).json('Invalid credentials');
            }

            const sessUser = { username: username, password: password };
            req.session.user = sessUser; // Auto saves session data in mongo store
            return res.status(200).json('Logged in')
        })

    }
    catch{
        console.log('Unable to login')
    }
}

exports.logoutUser = (req,res) => {
    req.session.destroy((err) => {

        // delete session data from store, using sessionID in cookie
        if (err) throw err;

        res.clearCookie("session-id"); // clears cookie containing expired sessionID
        res.send("Logged out successfully");
    });
}

//checking if the user is logged in -> checks the db for a cookie session

exports.authChecker = (req, res) => {
    const sessUser = req.session.user;
    if (sessUser) {
      return res.json(sessUser);
    } else {
      return res.status(401).json({ msg: "Unauthorized" });
    }
  };