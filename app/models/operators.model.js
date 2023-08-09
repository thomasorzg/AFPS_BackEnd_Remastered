module.exports = (sequelize, Sequelize) => {
    return sequelize.define("operators", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        gender: {
            type: Sequelize.ENUM("MALE", "FEMALE", "OTHER"),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE", "SUSPENDED"),
            allowNull: false
        },
        ine: {
            type: Sequelize.STRING,
            allowNull: true
        },
        proofOfAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
    });
}