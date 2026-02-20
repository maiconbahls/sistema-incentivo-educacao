Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Pega a pasta onde o script VBS está
strPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Muda o diretório de trabalho para a pasta do projeto
objShell.CurrentDirectory = strPath

' Inicia o servidor Python
' Usamos "cmd /c" para garantir que o comando seja reconhecido pelo Windows
strCommand = "cmd /c python -m http.server 8000"
objShell.Run strCommand, 0, False

' Espera o servidor subir
WScript.Sleep 2000

' Abre o navegador
objShell.Run "http://localhost:8000/index.html"
