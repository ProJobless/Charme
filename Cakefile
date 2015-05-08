# Cakefile for Charme, taken and modfied from gist.github.com/haihappen/2243795
option '-o', '--output [DIR]', '' # output directory
task 'sbuild', '', (options) -> # new build task

	exec = require('child_process').exec
	filesystem = require('fs')
	 
	Array::remove = (e) -> @[t..t] = [] if (t = @indexOf(e)) > -1
	Array::include = (e) -> @indexOf(e) > -1
	 
	settings =
	  input:  ['jsclient/models/schema.coffee','jsclient/models/listOperations.coffee','jsclient/models/post.coffee', 'jsclient/models/simpleStorage.coffee', 'jsclient/models/signature.coffee', 'jsclient/models/keys.coffee', 'jsclient/models/views.coffee', 'jsclient/models/context.coffee'] # add folder with 'app' for example
	  output: 'jsclient/models/models.js'
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
	 
