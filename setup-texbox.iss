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
var
  AddToPath: boolean;

procedure CurStepChanged(CurStep: TSetupStep);
var
  PathVar: string;
begin
  if CurStep = ssInstall then
  begin
    if AddToPath then
    begin
      // Adiciona temporariamente o diretório de instalação ao PATH
      PathVar := GetEnv('PATH');
      if Pos(';', PathVar) = 0 then
        PathVar := PathVar + ';';
      PathVar := PathVar + ExpandConstant('{app}');
      RegWriteStringValue(HKCU, 'Environment', 'TEXBOX_PATH', PathVar);
    end;
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
  AddToPath := True;
end;