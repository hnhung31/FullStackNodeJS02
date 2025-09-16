require("dotenv").config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Trả về mã lỗi 1 khi email tồn tại
            return { EC: 1, EM: "Email đã tồn tại, vui lòng chọn email khác" };
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        let result = await User.create({ name, email, password: hashPassword, role: "User" });
        
        // Trả về mã thành công 0 và dữ liệu người dùng trong DT (Data)
        return { EC: 0, EM: "Tạo người dùng thành công!", DT: result };

    } catch (error) {
        console.log(error);
        return { EC: -1, EM: "Đã có lỗi xảy ra ở server" };
    }
};

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return { EC: 2, EM: "Email/Password không hợp lệ" };
            } else {
                const payload = { _id: user._id, email: user.email, name: user.name };
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRE }
                );
                return {
                    EC: 0,
                    access_token,
                    user: { email: user.email, name: user.name }
                };
            }
        } else {
            return { EC: 1, EM: "Email/Password không hợp lệ" };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getUserService = async (page = 1, pageSize = 10) => {
    try {
        const skip = (page - 1) * pageSize;
        const totalUsers = await User.countDocuments({});
        const users = await User.find({})
            .select("-password")
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        return {
            users,
            pagination: {
                current: page,
                pageSize,
                total: totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize)
            }
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    createUserService, loginService, getUserService
};
