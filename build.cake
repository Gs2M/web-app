//////////////////////////////////////////////////////////////////////
// ARGUMENTS & VARIABLES
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var composeFile = Argument("composeFile", "./docker-compose.yml");

var service = "web-app";

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

Task("Clean")
    .Does(() =>
{
    DeleteDirectory("output", new DeleteDirectorySettings {
        Force = true,
        Recursive = true
    });
});

Task("Install")
    .Does(() =>
{
    Information("Installing npm dependencies...");
    StartProcess("npm", "install");
});

//////////////////////////////////////////////////////////////////////
// Docker Compose Tasks
//////////////////////////////////////////////////////////////////////

Task("web-app-up")
    .IsDependentOn("Install")
    .Does(() =>
{
    Information($"Starting development service '{service}'...");
    StartProcess("docker", $"compose -f {composeFile} up -d {service}");
});

Task("web-app")
    .IsDependentOn("web-app-up")
    .Does(() =>
{
    Information($"Starting deploy service '{service}'...");
});

Task("Down")
    .Does(() =>
{
    Information("Stopping all Docker Compose services...");
    StartProcess("docker", $"compose -f {composeFile} down");
});

RunTarget(target);
