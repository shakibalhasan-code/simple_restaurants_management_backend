// routes/settings.js
const express = require('express');
const router = express.Router();
const db = require('../models'); // Assuming Sequelize is configured here

db.sequelize.sync({ force: true }) // This will drop the table and recreate it
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.log('Error:', err));

// Get all settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await db.Setting.findAll();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Add new setting
router.post('/settings', async (req, res) => {
  try {
    const { appName, timezone, maintenanceMode, appVersion, licenseCode } = req.body;

    const newSetting = await db.Setting.create({
      appName,
      timezone,
      maintenanceMode,
      appVersion,
      licenseCode
    });

    res.status(201).json(newSetting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating new setting', error: error.message });
  }
});

// Edit an existing setting
router.put('/settings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { appName, timezone, maintenanceMode, appVersion, licenseCode } = req.body;

    const setting = await db.Setting.findByPk(id);

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    // Update the setting fields
    setting.appName = appName || setting.appName;
    setting.timezone = timezone || setting.timezone;
    setting.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : setting.maintenanceMode;
    setting.appVersion = appVersion || setting.appVersion;
    setting.licenseCode = licenseCode || setting.licenseCode;

    await setting.save();

    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error: error.message });
  }
});

// Delete a setting
router.delete('/settings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const setting = await db.Setting.findByPk(id);
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    await setting.destroy();
    res.status(200).json({ message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting setting', error: error.message });
  }
});

module.exports = router;
