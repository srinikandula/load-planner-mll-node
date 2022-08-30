var fs = require('fs');
function getUserHome() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}


var serverConfigPath = getUserHome() + '/loadplanner-server-config.json';


var projectConfigPath = __dirname + '/config-template.json';


if (process.env.NODE_ENV === "test") {
    projectConfigPath = __dirname + '/test_config.json';
}

var selectedConfigPath;

if (fs.existsSync(serverConfigPath)) {
    selectedConfigPath = serverConfigPath;
    console.log("config is taken from " + selectedConfigPath);
} else if (fs.existsSync(projectConfigPath)) {
    selectedConfigPath = projectConfigPath;
    console.log("config is taken from " + selectedConfigPath);

} else {
    console.log('CONFIG FILE DOESNT EXIST @ ' + selectedConfigPath);
    process.exit();
}

var finalJSONConfig = JSON.parse(fs.readFileSync(selectedConfigPath));
module.exports = finalJSONConfig;
