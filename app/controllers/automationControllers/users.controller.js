const db = require("../../models");
const bcrypt = require("bcryptjs");

/**
 * Create a new user
 * @param {*} req
 * @param {*} res 
 */
exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await db.users.findOne({
      where: {
        email: email
      }
    });

    if (user) {
      return res.status(400).send({
        message: "User already exists"
      });
    }

    const hashPassword = await bcrypt.hash(String(password), 10);

    const newUser = await db.users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role
    });

    res.send({
      message: "User created successfully!",
      data: newUser
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

/**
 * Get all users
 * @param {*} req 
 * @param {*} res 
 */
exports.users = async (req, res) => {
  try {
    const userAttributes = ["id", "name", "email", "role", "isActive", "createdAt", "updatedAt"];

    const users = await db.users.findAll({
        attributes: userAttributes
    });

    const responseData = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive ? "Active" : "Not Active",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.send(responseData);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
