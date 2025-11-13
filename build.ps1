#!/usr/bin/env pwsh
<#
.SYNOPSIS
    PowerShell launcher for build.cake
.DESCRIPTION
    Runs the Cake build script with optional arguments like --target.
#>

foreach ($arg in $args) {
    if ($arg -like "--target=*") {
        $Target = $arg.Split("=")[1]
    }
}

# Ensure Cake CLI is installed
if (-not (Get-Command dotnet-cake -ErrorAction SilentlyContinue)) {
    Write-Host "Cake CLI not found. Installing..."
    dotnet tool install -g Cake.Tool
}
# Add .NET tools path
$dotnetToolsPath = "$HOME/.dotnet/tools"
$env:PATH += ":$dotnetToolsPath"

# Build argument list for Cake
$ArgsList = @()
if ($target) { $ArgsList += "--target=$target" }

Write-Host "Running build.cake with arguments: $($ArgsList -join ' ')"

# Execute the Cake build script
dotnet cake ./build.cake $ArgsList
