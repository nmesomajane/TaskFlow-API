import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();


export const signUp = async (req, res) => {
    let session = req.session;
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user object (this is just a placeholder, replace with your DB logic)
        
        const newUser = { username, email, password: hashedPassword };
       

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};


export const signIn = async (req, res) => {
}


export const signOut = async (req, res) => {}