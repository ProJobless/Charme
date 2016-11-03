# Cakefile for Charme, taken and modfied from gist.github.com/haihappen/2243795
option '-o', '--output [DIR]', '' # output directory
task 'sbuild', '', (options) -> # new build task

	exec = require('child_process').exec
	filesystem = require('fs')
	 
	Array::remove = (e) -> @[t..t] = [] if (t = @indexOf(e)) > -1
	Array::include = (e) -> @indexOf(e) > -1
	 
	settings =
	  input:  ['jsclient/src/schema.coffee','jsclient/src/listOperations.coffee','jsclient/src/post.coffee','jsclient/src/log.coffee', 'jsclient/src/simpleStorage.coffee', 'jsclient/src/signature.coffee', 'jsclient/src/keys.coffee', 'jsclient/src/views.coffee', 'jsclient/src/context.coffee'] # add folder with 'app' for example
	  output: 'jsclient/src/models.js'
	  _files: (dir) ->
	    unless dir?
	      while (settings._files(file) for file in @input when filesystem.lstatSync(file).isDirectory()).length > 0 then
	      file for file in @input when file.match(/\.coffee$/)
	    else
	      @input.remove(dir)
	      @input.push(file) for file in filesystem.readdirSync(dir) when (file = "#{dir}/#{file}") and not @input.include(file)
	input = settings._files().join(' ')
	exec("coffee -j #{settings.output} -cw #{input}").stdout.on 'data', (data) ->
		process.stdout.write(data)
	 
