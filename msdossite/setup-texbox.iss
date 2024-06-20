[Setup]
AppName=Texbox
AppVersion=1.0
DefaultDirName={pf}\Texbox
OutputDir=Output
OutputBaseFilename=Setup-Texbox

[Files]
Source: "C:\Users\User\source\repos\TexBox\msdossite\texbox\texbox-win.exe"; DestDir: "{app}"

[Registry]
Root: HKCU; Subkey: "Environment"; ValueType: expandsz; ValueName: "TEXBOX_PATH"; ValueData: "{app}"; Flags: preservestringtype

[Code]
procedure AddToSystemPath(const APath: string);
var
  EnvVar: string;
begin
  if not RegQueryStringValue(HKLM, 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment', 'Path', EnvVar) then
  begin
    MsgBox('Failed to read the system environment variable "Path".', mbError, MB_OK);
    Exit;
  end;

  if Pos(';' + APath + ';', ';' + EnvVar + ';') = 0 then
  begin
    if EnvVar <> '' then
      EnvVar := EnvVar + ';';
    EnvVar := EnvVar + APath;
    if not RegWriteStringValue(HKLM, 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment', 'Path', EnvVar) then
      MsgBox('Failed to add the application to the system environment variable "Path".', mbError, MB_OK);
  end;
end;

function ShouldAddToPathPage(): Boolean;
begin
  Result := True;
end;

procedure InitializeWizard();
var
  Page: TWizardPage;
  CheckBox: TNewCheckBox;
begin
  Page := CreateCustomPage(wpSelectDir, 'Add to PATH', 'Choose if you want to add Texbox to the system PATH.');
  CheckBox := TNewCheckBox.Create(WizardForm);
  CheckBox.Parent := Page.Surface;
  CheckBox.Left := 0;
  CheckBox.Top := Page.SurfaceHeight - ScaleY(50);
  CheckBox.Width := Page.SurfaceWidth;
  CheckBox.Caption := 'Add TexBox to System PATH (requires system restart)';
  CheckBox.Checked := True;
end;