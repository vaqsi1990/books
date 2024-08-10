const User = require('../moddel/user')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const handler = require('../middleware/handler')
const jwt = require('jsonwebtoken')
const salt = bcrypt.genSaltSync(10);

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, "I love anna", {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

exports.makeAdmin = handler(
  async(req, res, next) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send('User not found');
      }
      user.isAdmin = !user.isAdmin; 
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  }
)

exports.register = handler (
  async (req, res, next) => {
      const { name, email, password } = req.body;
      try {
        const existingUser = await User.findOne({ email });
    
        if (existingUser) {
          return res.status(422).json({ error: 'Email already registered' });
        }
    
        if (password.length <= 5) {
          return res.status(422).json({ error: 'Password must be more than 5 characters' });
        }
    
        const hashedPassword = bcrypt.hashSync(password, 10);
    
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword
        });
    
        generateToken(res, newUser._id);
    
        res.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
        });
      } catch (error) {
        res.status(422).json({ error: 'Registration failed' });
      }
    }
)


exports.login = handler(
  async (req, res, next) => {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(422).json({ error: 'Incorrect email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(422).json({ error: 'Incorrect email or password' });
    }

    generateToken(res, existingUser._id);

    res.status(201).json({
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    });
  }
);

  
  

  exports.logout = async(req, res) => {
    res.cookie("jwt", "", {
      httyOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  }



  exports.allUsers = handler (async(req, res, next) => {
    const users = await User.find({});
    

    res.json(users);
    }
    
    )
    

    exports.profile = async (req, res) => {
      const { token } = req.cookies;
      if (token) {
        jwt.verify(token, "I love anna", {}, async (err, userData) => {
          if (err) {
           
            res.clearCookie('jwt').json({ error: 'Token expired or invalid. Please log in again.' });
          } else {
            const { name, email, _id, isAdmin } = await User.findById(userData.id);
            res.json({ name, email, _id, isAdmin });
          }
        });
      } else {
        res.json(null);
      }
    }


    exports.updateProfile = handler(
      async(req, res, next) => {
        const user = await User.findById(req.user._id);

        if(user) {
          user.name = req.body.name || user.name
          user.email = req.body.email || user.email

          if(req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
          }

          const updatedUser = await user.save()

          res.json(updatedUser)

        }else {
          res.status(404)
          throw new Error('user not found')
        }
      }
    )



    exports.deleteUser = handler(
      async (req, res, next) => {
        try {
          const user = await User.findById(req.params.id);
          if (!user) {
            res.status(404);
            throw new Error('User not found');
          }
          if (user.isAdmin) {
            res.status(400);
            throw new Error('You cannot delete an admin');
          }
    
          await User.findByIdAndDelete(req.params.id);
          res.json('User deleted');
        } catch (error) {
          next(error);
        }
      }
    );
    


    exports.singleUser = handler(  async(req, res) => {
      const user = await User.findById(req.params.id).select('-password')

      if(user) {
        res.json(user)
      } else {
        res.status(404)
          throw new Error('user not found')
      }
    }   )


    exports.updateUserById = handler( async(req, res) => {
      const user = await User.findById(req.params.id)

      if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)

        

        const updateduser = await user.save()

        res.json(updateduser)
      }
    } )