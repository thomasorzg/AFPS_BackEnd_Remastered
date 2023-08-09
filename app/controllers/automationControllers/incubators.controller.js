const db = require("../../models");

/**
 * Create a new incubator
 * @param {*} req
 * @param {*} res 
 */
exports.create = async (req, res) => {
    try {
        const { name, serie, model, operatorId, status } = req.body;

        const incubator = await db.incubators.findOne({
            where: {
                serie: serie
            }
        });

        if (incubator) {
            return res.status(400).send({
                message: "Incubator is already registered with this serie!"
            });
        }

        const newIncubator = await db.incubators.create({
            name: name,
            serie: serie,
            model: model,
            operatorId: operatorId,
            status: status
        });

        res.send({
            message: "Incubator created successfully!",
            data: newIncubator
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

/**
 * Get all incubators
 * @param {*} req 
 * @param {*} res 
 */
exports.incubators = async (req, res) => {
    try {
        const incubatorAttributes = ["id", "name", "serie", "model", "operatorId", "status", "createdAt", "updatedAt"];

        const incubators = await db.incubators.findAll({
            attributes: incubatorAttributes
        });

        const operatorId = incubators.map(incubator => incubator.operatorId);

        const operators = await db.operators.findAll({
            attributes: ["id", "name"],
            where: {
                id: operatorId
            }
        });

        const operatorMap = new Map(operators.map(operator => [operator.id, operator]));

        const responseData = incubators.map(incubator => ({
            id: incubator.id,
            name: incubator.name,
            serie: incubator.serie,
            model: incubator.model,
            operatorId: incubator.operatorId,
            operator: operatorMap.get(incubator.operatorId)?.name || "Operator not found",
            status: incubator.status,
            createdAt: incubator.createdAt,
            updatedAt: incubator.updatedAt
        }));

        res.send(responseData);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};