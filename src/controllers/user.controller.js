import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // Steps to create user
  // 1. get the data from req body
  // 2. validate the data
  // 3. check if user already exists
  // 4. check for images check for avaatar and coverImage
  // 5. upload the images to cloudinary
  // 6. create user
  // 7. remove password and refresh token field from response
  // 8. check for user creation
  // 9. return the response

  const { username, fullname, email, password } = req.body;
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new Error(403, "All fields are required");
  }

  const userExists = User.findOne({
    $or: [{ email }, { username }],
  });
  if (userExists) {
    throw new Error(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avaatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avaatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const User = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avaatar.url,
    coverImage: coverImage?.url || "",
  });
  const createUser = await User.findById(User._id).select(
    "-password -refreshToken"
  );
  if (!createUser) {
    throw new ApiError(500, "Something went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User registered successfully."));
});

export { registerUser };
