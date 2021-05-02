require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 978:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(395);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 482:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(978);
const file_command_1 = __nccwpck_require__(522);
const utils_1 = __nccwpck_require__(395);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 522:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(395);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 395:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 775:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const find_up_1 = __importDefault(__nccwpck_require__(620));
const locate_path_1 = __importDefault(__nccwpck_require__(878));
const path_1 = __importDefault(__nccwpck_require__(622));
const fs_1 = __importDefault(__nccwpck_require__(747));
const util_1 = __importDefault(__nccwpck_require__(669));
const ignore_1 = __importDefault(__nccwpck_require__(318));
const cross_spawn_1 = __importDefault(__nccwpck_require__(116));
let readFile = util_1.default.promisify(fs_1.default.readFile);
/**
 * Parse a CODEOWNERS file into an array of entries (will be in reverse order
 * of the file).
 */
function parse(str) {
    let entries = [];
    let lines = str.split("\n");
    for (let line of lines) {
        let [content, comment] = line.split("#");
        let trimmed = content.trim();
        if (trimmed === "")
            continue;
        let [pattern, ...owners] = trimmed.split(/\s+/);
        entries.push({ pattern, owners });
    }
    return entries.reverse();
}
exports.parse = parse;
/**
 * Standard locations to search for the CODEOWNERS file in priority order
 * (Note: This comes from GitHub).
 */
exports.CODEOWNERS_PATHS = [
    ".github/CODEOWNERS",
    "docs/CODEOWNERS",
    "CODEOWNERS",
];
/**
 * Find the path of the CODEOWNERS file from the current working directory.
 */
async function findOwnersPath(cwd) {
    let git = await find_up_1.default(".git/", { cwd, type: "directory" });
    if (!git)
        return null;
    let root = path_1.default.dirname(git);
    let paths = exports.CODEOWNERS_PATHS.map(part => path_1.default.join(root, part));
    let codeowners = await locate_path_1.default(paths, { cwd });
    return codeowners || null;
}
exports.findOwnersPath = findOwnersPath;
/**
 * Find, load, and parse the CODEOWNERS file (if it exists) from the current
 * working directory.
 */
async function loadOwners(cwd) {
    let file = await findOwnersPath(cwd);
    if (!file)
        return null;
    let contents = await readFile(file, "utf-8");
    let entries = parse(contents);
    return entries;
}
exports.loadOwners = loadOwners;
/**
 * Match a filename against a glob pattern (while respecting .gitignore rules)
 */
function matchPattern(filename, pattern) {
    return ignore_1.default()
        .add(pattern)
        .ignores(filename);
}
exports.matchPattern = matchPattern;
/**
 * Match a filename against CODEOWNERS entries to determine which (if any) it
 * matches.
 */
function matchFile(filename, entries) {
    for (let entry of entries) {
        if (matchPattern(filename, entry.pattern)) {
            return entry;
        }
    }
    return null;
}
exports.matchFile = matchFile;
/**
 * Given a set of files and CODEOWNERS entries, return the set of files which
 * are not matched to any CODEOWNERS entries.
 */
function filterUnmatchedFiles(files, entries) {
    return files.filter(file => !matchFile(file, entries));
}
exports.filterUnmatchedFiles = filterUnmatchedFiles;
/**
 * Spawn a child process and convert it into a promise.
 * @internal
 */
function spawn(cmd, args, opts, onData) {
    return new Promise((resolve, reject) => {
        let proc = cross_spawn_1.default(cmd, args, opts);
        proc.stdout.on("data", onData);
        proc.on("error", reject);
        proc.on("close", code => {
            if (code !== 0) {
                reject(new Error(`"${cmd} ${args.join(" ")}" exited with non-zero exit code: ${code}`)); // prettier-ignore
            }
            else {
                resolve();
            }
        });
    });
}
/**
 * Use git to list all files in a repository.
 * @internal
 */
async function lsFiles(cwd, onFiles) {
    await spawn("git", ["ls-files", "--others", "--exclude-standard"], { cwd, stdio: ["ignore", "pipe", "inherit"] }, data => {
        let files = data
            .toString()
            .trim()
            .split("\n");
        onFiles(files);
    });
}
/**
 * Find all of the files in a git repository which are not matched by any code
 * owners using a set of CODEOWNERS entries.
 */
async function findUnmatchedFilesFromEntries(entries, cwd) {
    let unmatched = [];
    await lsFiles(cwd, files => {
        unmatched = unmatched.concat(filterUnmatchedFiles(files, entries));
    });
    return unmatched;
}
exports.findUnmatchedFilesFromEntries = findUnmatchedFilesFromEntries;
/**
 * Find all of the files in a git repository which are not matched by any code
 * owners.
 */
async function findUnmatchedFiles(cwd) {
    let entries = await loadOwners(cwd);
    if (!entries)
        return null;
    let unmatched = await findUnmatchedFilesFromEntries(entries, cwd);
    return unmatched;
}
exports.findUnmatchedFiles = findUnmatchedFiles;
//# sourceMappingURL=codeowners-utils.js.map

/***/ }),

/***/ 116:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const cp = __nccwpck_require__(129);
const parse = __nccwpck_require__(599);
const enoent = __nccwpck_require__(873);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 873:
/***/ ((module) => {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 599:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(622);
const resolveCommand = __nccwpck_require__(444);
const escape = __nccwpck_require__(828);
const readShebang = __nccwpck_require__(845);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 828:
/***/ ((module) => {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 845:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(747);
const shebangCommand = __nccwpck_require__(663);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 444:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(622);
const which = __nccwpck_require__(760);
const getPathKey = __nccwpck_require__(161);

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: env[getPathKey({ env })],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 620:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(622);
const locatePath = __nccwpck_require__(878);
const pathExists = __nccwpck_require__(147);

const stop = Symbol('findUp.stop');

module.exports = async (name, options = {}) => {
	let directory = path.resolve(options.cwd || '');
	const {root} = path.parse(directory);
	const paths = [].concat(name);

	const runMatcher = async locateOptions => {
		if (typeof name !== 'function') {
			return locatePath(paths, locateOptions);
		}

		const foundPath = await name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath([foundPath], locateOptions);
		}

		return foundPath;
	};

	// eslint-disable-next-line no-constant-condition
	while (true) {
		// eslint-disable-next-line no-await-in-loop
		const foundPath = await runMatcher({...options, cwd: directory});

		if (foundPath === stop) {
			return;
		}

		if (foundPath) {
			return path.resolve(directory, foundPath);
		}

		if (directory === root) {
			return;
		}

		directory = path.dirname(directory);
	}
};

module.exports.sync = (name, options = {}) => {
	let directory = path.resolve(options.cwd || '');
	const {root} = path.parse(directory);
	const paths = [].concat(name);

	const runMatcher = locateOptions => {
		if (typeof name !== 'function') {
			return locatePath.sync(paths, locateOptions);
		}

		const foundPath = name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath.sync([foundPath], locateOptions);
		}

		return foundPath;
	};

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const foundPath = runMatcher({...options, cwd: directory});

		if (foundPath === stop) {
			return;
		}

		if (foundPath) {
			return path.resolve(directory, foundPath);
		}

		if (directory === root) {
			return;
		}

		directory = path.dirname(directory);
	}
};

module.exports.exists = pathExists;

module.exports.sync.exists = pathExists.sync;

module.exports.stop = stop;


/***/ }),

/***/ 318:
/***/ ((module) => {

// A simple implementation of make-array
function makeArray (subject) {
  return Array.isArray(subject)
    ? subject
    : [subject]
}

const EMPTY = ''
const SPACE = ' '
const ESCAPE = '\\'
const REGEX_TEST_BLANK_LINE = /^\s+$/
const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/
const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/
const REGEX_SPLITALL_CRLF = /\r?\n/g
// /foo,
// ./foo,
// ../foo,
// .
// ..
const REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/

const SLASH = '/'
const KEY_IGNORE = typeof Symbol !== 'undefined'
  ? Symbol.for('node-ignore')
  /* istanbul ignore next */
  : 'node-ignore'

const define = (object, key, value) =>
  Object.defineProperty(object, key, {value})

const REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g

// Sanitize the range of a regular expression
// The cases are complicated, see test cases for details
const sanitizeRange = range => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0)
    ? match
    // Invalid range (out of order) which is ok for gitignore rules but
    //   fatal for JavaScript regular expression, so eliminate it.
    : EMPTY
)

// See fixtures #59
const cleanRangeBackSlash = slashes => {
  const {length} = slashes
  return slashes.slice(0, length - length % 2)
}

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'
const REPLACERS = [

  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a \ ) -> (a  )
    /\\?\s+$/,
    match => match.indexOf('\\') === 0
      ? SPACE
      : EMPTY
  ],

  // replace (\ ) with ' '
  [
    /\\\s/g,
    () => SPACE
  ],

  // Escape metacharacters
  // which is written down by users but means special for regular expressions.

  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\$.|*+(){^]/g,
    match => `\\${match}`
  ],

  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => '[^/]'
  ],

  // leading slash
  [

    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => '^'
  ],

  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => '\\/'
  ],

  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,

    // '**/foo' <-> 'foo'
    () => '^(?:.*\\/)?'
  ],

  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer () {
      // If has a slash `/` at the beginning or middle
      return !/\/(?!$)/.test(this)
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern

        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
        ? '(?:^|\\/)'

        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        : '^'
    }
  ],

  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,

    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer

    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length

      // case: /**/
      // > A slash followed by two consecutive asterisks then a slash matches
      // >   zero or more directories.
      // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
      // '/**/'
      ? '(?:\\/[^\\/]+)*'

      // case: /**
      // > A trailing `"/**"` matches everything inside.

      // #21: everything inside but it should not include the current folder
      : '\\/.+'
  ],

  // intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'

    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule
    /(^|[^\\]+)\\\*(?=.+)/g,

    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1) => `${p1}[^\\/]*`
  ],

  [
    // unescape, revert step 3 except for back slash
    // For example, if a user escape a '\\*',
    // after step 3, the result will be '\\\\\\*'
    /\\\\\\(?=[$.|*+(){^])/g,
    () => ESCAPE
  ],

  [
    // '\\\\' -> '\\'
    /\\\\/g,
    () => ESCAPE
  ],

  [
    // > The range notation, e.g. [a-zA-Z],
    // > can be used to match one of the characters in a range.

    // `\` is escaped by step 3
    /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
    (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE
      // '\\[bar]' -> '\\\\[bar\\]'
      ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}`
      : close === ']'
        ? endEscape.length % 2 === 0
          // A normal case, and it is a range notation
          // '[bar]'
          // '[bar\\\\]'
          ? `[${sanitizeRange(range)}${endEscape}]`
          // Invalid range notaton
          // '[bar\\]' -> '[bar\\\\]'
          : '[]'
        : '[]'
  ],

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,

    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38

    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    match => /\/$/.test(match)
      // foo/ will not match 'foo'
      ? `${match}$`
      // foo matches 'foo' and 'foo/'
      : `${match}(?=$|\\/$)`
  ],

  // trailing wildcard
  [
    /(\^|\\\/)?\\\*$/,
    (_, p1) => {
      const prefix = p1
        // '\^':
        // '/*' does not match EMPTY
        // '/*' does not match everything

        // '\\\/':
        // 'abc/*' does not match 'abc/'
        ? `${p1}[^/]+`

        // 'a*' matches 'a'
        // 'a*' matches 'aa'
        : '[^/]*'

      return `${prefix}(?=$|\\/$)`
    }
  ],
]

// A simple cache, because an ignore rule only has only one certain meaning
const regexCache = Object.create(null)

// @param {pattern}
const makeRegex = (pattern, negative, ignorecase) => {
  const r = regexCache[pattern]
  if (r) {
    return r
  }

  // const replacers = negative
  //   ? NEGATIVE_REPLACERS
  //   : POSITIVE_REPLACERS

  const source = REPLACERS.reduce(
    (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
    pattern
  )

  return regexCache[pattern] = ignorecase
    ? new RegExp(source, 'i')
    : new RegExp(source)
}

const isString = subject => typeof subject === 'string'

// > A blank line matches no files, so it can serve as a separator for readability.
const checkPattern = pattern => pattern
  && isString(pattern)
  && !REGEX_TEST_BLANK_LINE.test(pattern)

  // > A line starting with # serves as a comment.
  && pattern.indexOf('#') !== 0

const splitPattern = pattern => pattern.split(REGEX_SPLITALL_CRLF)

class IgnoreRule {
  constructor (
    origin,
    pattern,
    negative,
    regex
  ) {
    this.origin = origin
    this.pattern = pattern
    this.negative = negative
    this.regex = regex
  }
}

const createRule = (pattern, ignorecase) => {
  const origin = pattern
  let negative = false

  // > An optional prefix "!" which negates the pattern;
  if (pattern.indexOf('!') === 0) {
    negative = true
    pattern = pattern.substr(1)
  }

  pattern = pattern
  // > Put a backslash ("\") in front of the first "!" for patterns that
  // >   begin with a literal "!", for example, `"\!important!.txt"`.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, '!')
  // > Put a backslash ("\") in front of the first hash for patterns that
  // >   begin with a hash.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, '#')

  const regex = makeRegex(pattern, negative, ignorecase)

  return new IgnoreRule(
    origin,
    pattern,
    negative,
    regex
  )
}

const throwError = (message, Ctor) => {
  throw new Ctor(message)
}

const checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    )
  }

  // We don't know if we should ignore EMPTY, so throw
  if (!path) {
    return doThrow(`path must not be empty`, TypeError)
  }

  // Check if it is a relative path
  if (checkPath.isNotRelative(path)) {
    const r = '`path.relative()`d'
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    )
  }

  return true
}

const isNotRelative = path => REGEX_TEST_INVALID_PATH.test(path)

checkPath.isNotRelative = isNotRelative
checkPath.convert = p => p

class Ignore {
  constructor ({
    ignorecase = true
  } = {}) {
    this._rules = []
    this._ignorecase = ignorecase
    define(this, KEY_IGNORE, true)
    this._initCache()
  }

  _initCache () {
    this._ignoreCache = Object.create(null)
    this._testCache = Object.create(null)
  }

  _addPattern (pattern) {
    // #32
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules)
      this._added = true
      return
    }

    if (checkPattern(pattern)) {
      const rule = createRule(pattern, this._ignorecase)
      this._added = true
      this._rules.push(rule)
    }
  }

  // @param {Array<string> | string | Ignore} pattern
  add (pattern) {
    this._added = false

    makeArray(
      isString(pattern)
        ? splitPattern(pattern)
        : pattern
    ).forEach(this._addPattern, this)

    // Some rules have just added to the ignore,
    // making the behavior changed.
    if (this._added) {
      this._initCache()
    }

    return this
  }

  // legacy
  addPattern (pattern) {
    return this.add(pattern)
  }

  //          |           ignored : unignored
  // negative |   0:0   |   0:1   |   1:0   |   1:1
  // -------- | ------- | ------- | ------- | --------
  //     0    |  TEST   |  TEST   |  SKIP   |    X
  //     1    |  TESTIF |  SKIP   |  TEST   |    X

  // - SKIP: always skip
  // - TEST: always test
  // - TESTIF: only test if checkUnignored
  // - X: that never happen

  // @param {boolean} whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.

  // @returns {TestResult} true if a file is ignored
  _testOne (path, checkUnignored) {
    let ignored = false
    let unignored = false

    this._rules.forEach(rule => {
      const {negative} = rule
      if (
        unignored === negative && ignored !== unignored
        || negative && !ignored && !unignored && !checkUnignored
      ) {
        return
      }

      const matched = rule.regex.test(path)

      if (matched) {
        ignored = !negative
        unignored = negative
      }
    })

    return {
      ignored,
      unignored
    }
  }

  // @returns {TestResult}
  _test (originalPath, cache, checkUnignored, slices) {
    const path = originalPath
      // Supports nullable path
      && checkPath.convert(originalPath)

    checkPath(path, originalPath, throwError)

    return this._t(path, cache, checkUnignored, slices)
  }

  _t (path, cache, checkUnignored, slices) {
    if (path in cache) {
      return cache[path]
    }

    if (!slices) {
      // path/to/a.js
      // ['path', 'to', 'a.js']
      slices = path.split(SLASH)
    }

    slices.pop()

    // If the path has no parent directory, just test it
    if (!slices.length) {
      return cache[path] = this._testOne(path, checkUnignored)
    }

    const parent = this._t(
      slices.join(SLASH) + SLASH,
      cache,
      checkUnignored,
      slices
    )

    // If the path contains a parent directory, check the parent first
    return cache[path] = parent.ignored
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      ? parent
      : this._testOne(path, checkUnignored)
  }

  ignores (path) {
    return this._test(path, this._ignoreCache, false).ignored
  }

  createFilter () {
    return path => !this.ignores(path)
  }

  filter (paths) {
    return makeArray(paths).filter(this.createFilter())
  }

  // @returns {TestResult}
  test (path) {
    return this._test(path, this._testCache, true)
  }
}

const factory = options => new Ignore(options)

const returnFalse = () => false

const isPathValid = path =>
  checkPath(path && checkPath.convert(path), path, returnFalse)

factory.isPathValid = isPathValid

// Fixes typescript
factory.default = factory

module.exports = factory

// Windows
// --------------------------------------------------------------
/* istanbul ignore if  */
if (
  // Detect `process` so that it can run in browsers.
  typeof process !== 'undefined'
  && (
    process.env && process.env.IGNORE_TEST_WIN32
    || process.platform === 'win32'
  )
) {
  /* eslint no-control-regex: "off" */
  const makePosix = str => /^\\\\\?\\/.test(str)
  || /["<>|\u0000-\u001F]+/u.test(str)
    ? str
    : str.replace(/\\/g, '/')

  checkPath.convert = makePosix

  // 'C:\\foo'     <- 'C:\\foo' has been converted to 'C:/'
  // 'd:\\foo'
  const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i
  checkPath.isNotRelative = path =>
    REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path)
    || isNotRelative(path)
}


/***/ }),

/***/ 66:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __nccwpck_require__(168)
} else {
  core = __nccwpck_require__(126)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 168:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 878:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(622);
const fs = __nccwpck_require__(747);
const {promisify} = __nccwpck_require__(669);
const pLocate = __nccwpck_require__(42);

const fsStat = promisify(fs.stat);
const fsLStat = promisify(fs.lstat);

const typeMappings = {
	directory: 'isDirectory',
	file: 'isFile'
};

function checkType({type}) {
	if (type in typeMappings) {
		return;
	}

	throw new Error(`Invalid type specified: ${type}`);
}

const matchType = (type, stat) => type === undefined || stat[typeMappings[type]]();

module.exports = async (paths, options) => {
	options = {
		cwd: process.cwd(),
		type: 'file',
		allowSymlinks: true,
		...options
	};
	checkType(options);
	const statFn = options.allowSymlinks ? fsStat : fsLStat;

	return pLocate(paths, async path_ => {
		try {
			const stat = await statFn(path.resolve(options.cwd, path_));
			return matchType(options.type, stat);
		} catch (_) {
			return false;
		}
	}, options);
};

module.exports.sync = (paths, options) => {
	options = {
		cwd: process.cwd(),
		allowSymlinks: true,
		type: 'file',
		...options
	};
	checkType(options);
	const statFn = options.allowSymlinks ? fs.statSync : fs.lstatSync;

	for (const path_ of paths) {
		try {
			const stat = statFn(path.resolve(options.cwd, path_));

			if (matchType(options.type, stat)) {
				return path_;
			}
		} catch (_) {
		}
	}
};


/***/ }),

/***/ 615:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const pTry = __nccwpck_require__(255);

const pLimit = concurrency => {
	if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
		return Promise.reject(new TypeError('Expected `concurrency` to be a number from 1 and up'));
	}

	const queue = [];
	let activeCount = 0;

	const next = () => {
		activeCount--;

		if (queue.length > 0) {
			queue.shift()();
		}
	};

	const run = (fn, resolve, ...args) => {
		activeCount++;

		const result = pTry(fn, ...args);

		resolve(result);

		result.then(next, next);
	};

	const enqueue = (fn, resolve, ...args) => {
		if (activeCount < concurrency) {
			run(fn, resolve, ...args);
		} else {
			queue.push(run.bind(null, fn, resolve, ...args));
		}
	};

	const generator = (fn, ...args) => new Promise(resolve => enqueue(fn, resolve, ...args));
	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount
		},
		pendingCount: {
			get: () => queue.length
		},
		clearQueue: {
			value: () => {
				queue.length = 0;
			}
		}
	});

	return generator;
};

module.exports = pLimit;
module.exports.default = pLimit;


/***/ }),

/***/ 42:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const pLimit = __nccwpck_require__(615);

class EndError extends Error {
	constructor(value) {
		super();
		this.value = value;
	}
}

// The input can also be a promise, so we await it
const testElement = async (element, tester) => tester(await element);

// The input can also be a promise, so we `Promise.all()` them both
const finder = async element => {
	const values = await Promise.all(element);
	if (values[1] === true) {
		throw new EndError(values[0]);
	}

	return false;
};

const pLocate = async (iterable, tester, options) => {
	options = {
		concurrency: Infinity,
		preserveOrder: true,
		...options
	};

	const limit = pLimit(options.concurrency);

	// Start all the promises concurrently with optional limit
	const items = [...iterable].map(element => [element, limit(testElement, element, tester)]);

	// Check the promises either serially or concurrently
	const checkLimit = pLimit(options.preserveOrder ? 1 : Infinity);

	try {
		await Promise.all(items.map(element => checkLimit(finder, element)));
	} catch (error) {
		if (error instanceof EndError) {
			return error.value;
		}

		throw error;
	}
};

module.exports = pLocate;
// TODO: Remove this for the next major release
module.exports.default = pLocate;


/***/ }),

/***/ 255:
/***/ ((module) => {

"use strict";


const pTry = (fn, ...arguments_) => new Promise(resolve => {
	resolve(fn(...arguments_));
});

module.exports = pTry;
// TODO: remove this in the next major version
module.exports.default = pTry;


/***/ }),

/***/ 147:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const fs = __nccwpck_require__(747);
const {promisify} = __nccwpck_require__(669);

const pAccess = promisify(fs.access);

module.exports = async path => {
	try {
		await pAccess(path);
		return true;
	} catch (_) {
		return false;
	}
};

module.exports.sync = path => {
	try {
		fs.accessSync(path);
		return true;
	} catch (_) {
		return false;
	}
};


/***/ }),

/***/ 161:
/***/ ((module) => {

"use strict";


const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

module.exports = pathKey;
// TODO: Remove this for the next major release
module.exports.default = pathKey;


/***/ }),

/***/ 663:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const shebangRegex = __nccwpck_require__(85);

module.exports = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};


/***/ }),

/***/ 85:
/***/ ((module) => {

"use strict";

module.exports = /^#!(.*)/;


/***/ }),

/***/ 760:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = __nccwpck_require__(622)
const COLON = isWindows ? ';' : ':'
const isexe = __nccwpck_require__(66)

const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' })

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    )
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : ''
  const pathExt = isWindows ? pathExtExe.split(colon) : ['']

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
}

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (!opt)
    opt = {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    resolve(subStep(p, i, 0))
  })

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii]
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext)
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    })
  })

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
}

const whichSync = (cmd, opt) => {
  opt = opt || {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j]
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

module.exports = which
which.sync = whichSync


/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(482);
const codeOwnersUtils = __nccwpck_require__(775);

(async () => {
  try {

    // get the code owners
    const codeownerPath = core.getInput('path') || './CODEOWNERS'
    const results = await codeOwnersUtils.loadOwners(codeownerPath);

    // remove the `@` to compare to author
    const cleanedOwners = results.map(line => {
      let owner = line.owners[0];
      if (owner.charAt(0)) {
        owner = owner.slice(1);
      }

      core.debug(`owner:${owner}`);
      return owner;
    });

    core.debug(`cleanedOwners:${cleanedOwners}`);
    core.setOutput("owners", cleanedOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map