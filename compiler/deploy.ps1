clear
truffle compile

truffle migrate --network development

Remove-Item -Path "..\frontend\src\contracts\artifacts\*.json" -Force
Copy-Item -Path ".\build\contracts\*.json" -Destination "..\frontend\src\contracts\artifacts\" -Recurse -Force

