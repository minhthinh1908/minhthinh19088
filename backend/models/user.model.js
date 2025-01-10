import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, // URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        }
    }, tokens: [{
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    }],
    isActive: {
        type: String,
        enum: ['pending', 'active', 'deleted', 'blocked'],
        default: 'active'
    },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
