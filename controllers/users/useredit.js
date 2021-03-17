const {User} = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  const {password, nickname, email} = req.body;
  if(!password && !nickname){
    res.status(400).json({message: "Unsufficient info"});
  }

  const updateValue = {};
  if(password) updateValue.password = password;
  if(nickname) updateValue.nickname = nickname;
  try{
    await User.update(updateValue,{
      where:{
        email
      }
    });

    const userInfo = await User.findOne({
      where: {
        email
      }
    })

    //if nickname was changed then return new access token.
    const accessToken = jwt.sign({nickname : userInfo.nickname}, process.env.ACCESS_SECRET, {expiresIn: '1H'});

    res.status(200).json({accessToken});
  }
  catch(err){
    console.log(
      "-------------------------------Error occurred in useredit.js-------------------------------- \n",
      err,
      "-------------------------------Error occurred in useredit.js-------------------------------- \n"
    );
    res.status(500).send();
  }
}