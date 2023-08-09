const db = require("../../models");

/**
 * Create a new operator
 * @param {*} req
 * @param {*} res 
 */
exports.create = async (req, res) => {
  try {
    const { name, address, phone, email, gender, status } = req.body;

    const operator = await db.operators.findOne({
      where: {
        phone: phone
      }
    });

    if (operator) {
      return res.status(400).send({
        message: "Operator is already registered with this phone number!"
      });
    }

    const newOperator = await db.operators.create({
        name: name,
        address: address,
        phone: phone,
        email: email,
        gender: gender,
        status: status
    });

    res.send({
      message: "Operator created successfully!",
      data: newOperator
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

/**
 * Get all operators
 * @param {*} req 
 * @param {*} res 
 */
exports.operators = async (req, res) => {
  try {
    const operatorAttributes = ["id", "name", "address", "phone", "email", "gender", "status", "ine", "proofOfAddress", "createdAt", "updatedAt"];

    const operators = await db.operators.findAll({
        attributes: operatorAttributes
    });

    const responseData = operators.map(operator => ({
        id: operator.id,
        name: operator.name,
        address: operator.address,
        phone: operator.phone,
        email: operator.email,
        gender: operator.gender,
        status: operator.status,
        ine: operator.ine,
        proofOfAddress: operator.proofOfAddress,
        createdAt: operator.createdAt,
        updatedAt: operator.updatedAt
    }));

    res.send(responseData);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
