Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "node start-silent.js", 0, False
Set WshShell = Nothing
