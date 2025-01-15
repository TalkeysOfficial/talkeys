// const router = require('express').Router();

// require('dotenv').config();

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// // Initiates the Google Login flow
// router.get("/auth/google", (req, res) => {
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
//   res.redirect(url);
// });

// // Callback URL for handling the Google Login response
// router.get("/auth/google/callback", async (req, res) => {
//   const { code } = req.query;

//   try {
//     // Exchange authorization code for access token
//     const { data } = await axios.post("<https://oauth2.googleapis.com/token>", {
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       code,
//       redirect_uri: REDIRECT_URI,
//       grant_type: "authorization_code",
//     });

//     const { access_token, id_token } = data;

//     // Use access_token or id_token to fetch user profile
//     const { data: profile } = await axios.get(
//       "<https://www.googleapis.com/oauth2/v1/userinfo>",
//       {
//         headers: { Authorization: `Bearer ${access_token}` },
//       }
//     );

//     res.cookie("jwt", id_token, { httpOnly: true });
//     res.redirect("/");
//   } catch (error) {
//     console.error("Error:", error.response.data.error);
//     res.redirect("/login");
//   }
// });



// module.exports = router;



//verify the jwt oauth token recieved by the frontend
// exports