export const isLoggedIn = asyncHandler(async(req, res, next) => {
    let token;
    if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        throw new CustomError("Not authorized to access this resource", 400)
    }

    try {
        const decodedJWTpayload = JWT.verify(token, config.JWT_SECRET);

        req.user = await User.findById(decodedJWTpayload._id, "name email role")
        next()
    } catch (error) {
        throw new CustomError("Not authorized to access this resource", 400)
    }
})

export const authorized = (...requiredRoles) => asyncHandler(async(req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
        throw new CustomError("You are not authorized to access this resource", 400)
    }
})

// Define the '/posts' endpoint
app.get('/posts',isLoggedIn, (req, res) => {
    // Array of 20 example posts
    const posts = Array(20)
      .fill()
      .map((_, index) => ({ id: index + 1, title: `Post ${index + 1}` }));
  
    res.json(posts);
  });

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});