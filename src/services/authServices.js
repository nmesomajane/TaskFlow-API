import bcrypt from "bcryptjs";
import UserRepository from "../repository/userRepository.js";
import { generateToken } from "../utils/jwt.js";
import AppError from "../utils/appError.js";

// Service handles business logic for authentication
class AuthService {
  // Register a new user
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log("Password being hashed:", password);
    console.log("Generated hash:", passwordHash);

    // Create user in database
    const user = await UserRepository.create({
      email,
      password_hash: passwordHash, // ← Use the database column name
      first_name: firstName, // ← Also fix these
      last_name: lastName,
    });
    console.log("User created:", user); // ← See what's actually returned
    console.log("Password hash in DB:", user.password_hash);

    //Generate JWT token
    const token = generateToken(user.id);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    };
  }

  // Login existing user
  async login(email, password) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user.id);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    };
  }

  // Get user profile
  async getProfile(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Return user data
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
    };
  }
}

export default new AuthService();
