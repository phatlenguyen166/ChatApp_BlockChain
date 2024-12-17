clear
truffle compile | Out-Null
Write-Host "Compile [DONE]!"

truffle migrate --network development | Out-Null
Write-Host "Migrate [DONE]!"

Remove-Item -Path "..\frontend\src\contracts\artifacts\*.json" -Force | Out-Null
Copy-Item -Path ".\build\contracts\*.json" -Destination "..\frontend\src\contracts\artifacts\" -Recurse -Force | Out-Null
Write-Host "Copy [DONE]!"


Write-Host "COMPLETED!"