import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'NoSecretsAfterAll';

const createUser = (req, res,) => {
  // Because some users are malicious
  const { username, password, email, firstname, lastname } = req.body;
  const ip = req.ip;

  const newUser = new User({ username, password, email, lastname, ip })
  return newUser.save()
    .then((user) => {
      return res.status(201)
        .json(user)
    })
    .catch((err) => {
      return res.status(400)
        .json({
          success: false,
          error: err.message,
        })
    })
}

const loginUser = (req, res, ) => {
  let { username, password } = req.body;
  username = username.toLowerCase().trim();
  // So we can keep track of logins
  const ip = req.ip;
  return User.findOne({ username })
    .then((result) => {
      if(!result) {
        return res.status(404)
          .json({
            success: false,
            error: "No such user",
          });
      } else {
        const userID = result.username;
        if(bcrypt.compareSync(password, result.password)) {
          const token = jwt.sign({ userID }, JWT_SECRET);
          return res.status(200)
            .json({
              success: true,
              token
            });
        } else {
          return res.status(401)
            .json({
              success: true,
              error: "Invalid password"
            });
        }
      }
    })
    .catch((err) => {
      return res.status(500)
        .json({
          success: false,
          error: err.message
        })
    })

}

const findUser = (req, res) => {
  const username = req.params.username.toLowerCase().trim();
  return User.findOne({ username })
  .then((response) => {
    if(response) {
      const { _id, username, firstname, lastname, email, permission, created } = response;
      return res.status(200)
        .json({
          _id,
          username, 
          firstname, 
          lastname, 
          email, 
          permission, 
          created
        })
    }
    return res.status(404)
      .json({
        success: false,
        error: 'No such user'
      })
  })
  .catch((err) => {
    return res.status(500)
      .json({
        success: false,
        error: err.message
      })
  });
}

export {
  createUser,
  loginUser,
  findUser
}