const {User} = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  const userInfo = await User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })

  if(userInfo) {
    const data = userInfo;

    const accessToken = jwt.sign({nickname: data.nickname}, process.env.ACCESS_SECRET, {expiresIn: '1H'});

    res.status(200).json({accessToken});
  }
  else{
    res.status(401).json({message: "Invalid user or Wrong password"})
  }
}