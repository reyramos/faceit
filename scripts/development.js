/**
 * Created by ramor11 on 7/5/2016.
 */
let config = require('../electron.config.js'),
	shell = require('shelljs');


let command = '"./node_modules/.bin/electron"',

//build the command script based on config files
	_c = [
		command
		, '.'
		, '--version="' + config.electronVersion + '"'

	].join(' ');


shell.exec(_c);