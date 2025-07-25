import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";


export interface User{
    name: string,
    email: string,
    password: string,
    role: "admin" | "user",
    phone?: string,
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

const userSchema = new Schema<User>(
    {

        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            unique: false,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "user"]
        },
         phone: {
            type: String,
            required: false
        },
    },
    {timestamps: true}
);

userSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
});

const User = models?.User || model<User>("User", userSchema);

export default User;