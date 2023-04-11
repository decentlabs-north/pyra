import Tonic from '@socketsupply/tonic'
import { MainApp } from './main-app.js'
import { CodeEditor } from './code-editor.js'
import { SandboxPreview } from './sandbox-preview.js'
import { MainMenu } from './main-menu.js'
import { SidePanel } from './side-panel.js'
import { PublishDialog } from './publish-dialog.js'

for (const component of [
  MainApp,
  CodeEditor,
  SandboxPreview,
  MainMenu,
  SidePanel,
  PublishDialog
]) Tonic.add(component)
