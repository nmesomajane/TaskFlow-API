import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import config from '../config/index.js';
import pool from '../database/connection.js';
import authServices from '../services/authServices.js';

import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import userRepsitory from '../repository/userRepsitory.js';

dotenv.config();


export const signUp =  asyncHandler(async (req, res) => {
 const { email, password, firstName, lastName } = req.body;
 const result = await authServices.register({
email,
password,
firstName,
lastName
});
// Send success response
res.status(201).json({
status: 'success',
data: {
user: result.user,
token: result.token
}
});
});


export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authServices.login(email, password);
  res.status(200).json({
    status: 'success',
    data: {
      user: result.user,
      token: result.token
    }
  });
});

// Logout user (simple version)
export const signOut = async (req, res, next) => {
  try {
  
    res.clearCookie('token');
    
    // Send success response
    res.status(200).json({ 
      message: 'Logged out successfully',
      success: true 
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Something went wrong during logout',
      error: error.message 
    });
  }
};


//user profile
export const getProfile = asyncHandler(async (req, res) => {

const userId = req.user.id;
// Get user profile
const user = await authServices.getProfile(userId);
res.status(200).json({
status: 'success',
data: { user }
});
});