// models/Setting.js
module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define('Setting', {
        appName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Asia/Dhaka',
        },
        maintenanceMode: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        appVersion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        licenseCode: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        // Enable timestamps
        timestamps: true,
    });
    return Setting;
};
