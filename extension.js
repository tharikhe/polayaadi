const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

let lastErrorCount = 0;
let debounceTimer = null;
let lastPlayTime = 0;

/**
 * Plays an audio file using the system's available audio player.
 * @param {string} audioPath - Absolute path to the audio file
 */
function playSound(audioPath) {
    const now = Date.now();
    // Debounce audio playback (prevent overlapping/spam within 2 seconds)
    if (now - lastPlayTime < 2000) return;
    lastPlayTime = now;

    let cmd;
    const platform = os.platform();

    if (platform === 'win32') {
        cmd = `powershell -c "(New-Object Media.SoundPlayer '${audioPath.replace(/'/g, "''")}').PlaySync()"`;
    } else if (platform === 'darwin') {
        cmd = `afplay "${audioPath}"`;
    } else {
        cmd = `ffplay -nodisp -autoexit "${audioPath}" 2>/dev/null || mpg123 -q "${audioPath}" 2>/dev/null || paplay "${audioPath}" 2>/dev/null || aplay "${audioPath}" 2>/dev/null`;
    }

    exec(cmd, (err) => {
        if (err) {
            console.error('[Polayaadi] Audio playback failed:', err.message);
        }
    });
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Audio file paths — must match actual filenames in /media
    const syntaxAudio = path.join(context.extensionPath, 'media', 'polayadi-mone.mp3');
    const terminalAudio = path.join(context.extensionPath, 'media', 'ayooo-sayip-op.mp3');

    // --- Command: polayaadi.helloWorld ---
    const helloCmd = vscode.commands.registerCommand('polayaadi.helloWorld', () => {
        vscode.window.showInformationMessage('🎙️ Polayaadi mone! Extension is running!');
        playSound(syntaxAudio);
    });

    // --- Diagnostics listener (syntax/lint errors) ---
    const diagDisposable = vscode.languages.onDidChangeDiagnostics(() => {
        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            let currentErrorCount = 0;

            // Count errors across all open documents
            vscode.workspace.textDocuments.forEach(doc => {
                const diags = vscode.languages.getDiagnostics(doc.uri);
                const errors = diags.filter(
                    d => d.severity === vscode.DiagnosticSeverity.Error
                );
                currentErrorCount += errors.length;
            });

            if (currentErrorCount > lastErrorCount) {
                playSound(syntaxAudio);
                vscode.window.showWarningMessage(
                    `🔊 Polayaadi mone! ${currentErrorCount} error(s) found.`
                );
            }

            lastErrorCount = currentErrorCount;
        }, 800);
    });

    // --- Terminal error detection (Real-time command execution) ---
    // This stable API triggers right after a command finishes in the terminal!
    const termShellDisposable = vscode.window.onDidEndTerminalShellExecution(e => {
        if (e.exitCode !== undefined && e.exitCode !== 0) {
            playSound(terminalAudio);
            vscode.window.showErrorMessage(
                `💥 Ayoo! Terminal command failed with exit code ${e.exitCode}`
            );
        }
    });

    // --- Task process error detection ---
    const taskEndDisposable = vscode.tasks.onDidEndTaskProcess(e => {
        if (e.exitCode !== undefined && e.exitCode !== 0) {
            playSound(terminalAudio);
            vscode.window.showErrorMessage(
                `💥 Ayoo! Task "${e.execution.task.name}" failed with exit code ${e.exitCode}`
            );
        }
    });

    context.subscriptions.push(helloCmd, diagDisposable, termShellDisposable, taskEndDisposable);

    vscode.window.showInformationMessage('Polayaadi extension active 🎙️');
    console.log('[Polayaadi] Extension activated successfully');
}

function deactivate() {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
    lastErrorCount = 0;
    isPlaying = false;
}

module.exports = { activate, deactivate };
