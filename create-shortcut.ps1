$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Kaizen Copilot.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\start-kaizen.bat"
$Shortcut.WorkingDirectory = "$PSScriptRoot"
$Shortcut.IconLocation = "%SystemRoot%\System32\SHELL32.dll, 25" # A star icon 
$Shortcut.Description = "Launch Kaizen Copilot Web App"
$Shortcut.Save()

Write-Host "Desktop shortcut created successfully!" -ForegroundColor Green
