module.exports = (sequelize, Sequelize) => {
    return sequelize.define("incubators", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        serie: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        model: {
            type: Sequelize.STRING,
            allowNull: false
        },
        operatorId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "operators",
                key: "id"
            }
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE", "SUSPENDED"),
            allowNull: false,
            defaultValue: "INACTIVE"
        }
    });
}