/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const electron_notarize = require('electron-notarize');
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
  console.log(`process.env.appleId ${process.env.appleId}`);

  try {
    await electron_notarize.notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.appleId,
      appleIdPassword: process.env.appleIdPassword,
    });
  } catch (error) {
    console.error(error);
  }

  console.log(`Done notarizing ${appId}`);
};
