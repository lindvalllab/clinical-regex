/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { notarize } = require('@electron/notarize');
const package = require('./package.json');

module.exports = async function (params) {
  // Only notarize the app on Mac OS only.
  if (process.platform !== 'darwin') {
    return;
  }
  console.log('afterSign hook triggered', params);

  // Same appId in electron-builder.
  let appId = package.build.appId;

  if (!appId) {
    console.error('appId is missing from build configuration (package.json)');
  }

  let appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`
  );
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

  console.log(`Notarizing ${appId} found at ${appPath}`);
  console.log(`process.env.APPLE_ID ${process.env.APPLE_ID}`);

  try {
    await notarize({
      appPath: appPath,
      appleId: process.env.APPLE_ID, // login name of your apple developer account
      appleIdPassword: process.env.APPLE_ID_APP_SPECIFIC_PASSWORD, // app-specific password
      teamId: process.env.APPLE_TEAM_ID, // team id for your developer team
    });
  } catch (error) {
    console.error(error);
  }

  console.log(`Done notarizing ${appId}`);
};
