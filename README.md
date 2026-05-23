# Polayaadi VS Code Extension

Polayaadi is a VS Code extension that brings interactive Malayalam audio feedback to your coding workflow. It monitors your development environment and plays sound effects when syntax errors or terminal failures occur, helping you stay aware of issues in real-time.

## Features

- **Syntax Diagnostics Monitoring:** Detects when syntax or linting errors are introduced into any active document in your workspace. Plays the designated audio clip after an 800ms debounce window.
- **Terminal Execution Tracking:** Listens for terminal shell commands. If a command exits with a non-zero exit code, the extension plays a terminal failure sound.
- **Task Process Monitoring:** Integrates with VS Code tasks. If a task fails or terminates with an error code, it triggers the failure audio.
- **Debounced Playback:** Incorporates a 2-second cooldown period between audio playbacks to prevent sound overlap or spam.
- **Verification Command:** Includes a testing command to verify that audio playback is functioning correctly on your system.

## System Prerequisites

The extension uses the native audio utilities of your operating system. Ensure your system meets the requirements below based on your OS:

### Windows
- Uses PowerShell for audio playback. No additional audio utilities need to be installed.

### macOS
- Uses the built-in command line utility `afplay`. No additional installation is required.

### Linux
- Requires at least one of the following command line media players to be installed and available in your system path:
  - `ffplay` (part of the ffmpeg suite)
  - `mpg123`
  - `paplay` (PulseAudio)
  - `aplay` (ALSA)

To install one of these players on Debian-based distributions (such as Ubuntu or Kali Linux), run:
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```
or
```bash
sudo apt-get update
sudo apt-get install mpg123
```

## Step-by-Step Installation Guide

You can install this extension using either the pre-packaged VSIX file or by compiling the extension from source.

### Option A: Install from a VSIX Package (Recommended)

If you have a compiled `.vsix` file (e.g., `polayaadi-0.0.3.vsix`), follow these steps:

#### Method 1: Using the VS Code User Interface
1. Open VS Code.
2. Open the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window, or use the keyboard shortcut `Ctrl+Shift+X` (or `Cmd+Shift+X` on macOS).
3. Click the More Actions button (three dots) in the upper-right corner of the Extensions view.
4. Select "Install from VSIX..." from the dropdown menu.
5. In the file selection dialog, locate and select the `polayaadi-0.0.3.vsix` file, then click "Install".
6. Restart VS Code or reload the window if prompted.

#### Method 2: Using the Command Line
Run the following command in your terminal, replacing the path with the location of your VSIX file:
```bash
code --install-extension polayaadi-0.0.3.vsix
```

---

### Option B: Build and Install from Source

If you want to install the extension manually from the source directory, follow these steps:

#### Step 1: Clone the Repository
Clone the codebase to your local machine:
```bash
git clone https://github.com/tharikhe/polayaadi.git
cd polayaadi
```

#### Step 2: Install Project Dependencies
Use npm to install the development dependencies:
```bash
npm install
```

#### Step 3: Run or Package the Extension
To run and debug the extension locally:
1. Open the project folder in VS Code.
2. Press `F5` to open a new Extension Development Host window.
3. The extension will be active in the new window for testing.

To package the extension into a VSIX file for distribution:
1. Install the VS Code extension CLI tool globally (if not already installed):
   ```bash
   npm install -g @vscode/vsce
   ```
2. Build the extension package:
   ```bash
   vsce package
   ```
3. Install the resulting `.vsix` file using the steps outlined in Option A.

## Detailed Usage Guide

Once installed, the extension runs automatically in the background. Below is a guide on how to interact with it:

### 1. Test System Playback
To verify that the extension can communicate with your operating system's audio utility:
1. Open the VS Code Command Palette by pressing `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS).
2. Type `Hello World` and select the command:
   ```
   Hello World
   ```
3. A success notification will appear at the bottom-right corner, and the default syntax error audio will play.

### 2. Syntax Error Feedback
1. Open any source code file (e.g., a JavaScript, Python, or HTML file).
2. Introduce a syntax error (for example, type incomplete code like `const x =`).
3. Within 800ms of the IDE highlighting the error with red squiggly lines, the extension will play the syntax error audio dialogue.
4. Fixing the error stops subsequent alerts.

### 3. Terminal and Task Failure Feedback
1. Open the integrated terminal in VS Code.
2. Run a command that finishes with a non-zero exit code (for example, run `exit 1` or run a build script that fails).
3. Upon command completion, the terminal failure audio will play.
4. Similarly, running a VS Code task that fails (such as a failing test suite) will trigger the same audio.

## Troubleshooting

### No Audio Playback on Linux
If the notification appears but you do not hear any audio:
1. Verify that your system volume is turned up and that the correct output device is selected.
2. Ensure you have one of the supported media players installed (`ffplay`, `mpg123`, `paplay`, or `aplay`). You can verify their installation by running the command in terminal (e.g., `which ffplay` or `which mpg123`).
3. Check the developer console logs in VS Code by selecting "Help" -> "Toggle Developer Tools" and checking the "Console" tab for any error logs starting with `[Polayaadi] Audio playback failed`.

### Audio is Delayed or Blocked
The extension includes a 2-second debounce mechanism to prevent multiple sounds from playing on top of each other. If you trigger multiple errors or terminal failures in quick succession, only the first event will play audio. Subsequent events will be silent until the cooldown period expires.

## Extension Settings

This extension currently runs with its default sound files and does not require any additional configuration parameters in your `settings.json`.

## Project Structure

- `extension.js`: Contains the core logic for error detection and audio spawning.
- `package.json`: Manifest file containing extension details, dependencies, and activation events.
- `media/`: Directory containing the audio files and icons.
  - `polayadi-mone.wav`: Audio played on syntax errors.
  - `ayooo-sayip-op.wav`: Audio played on terminal/task failures.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
