var data = {
    variables: [],
    func: [],
    wordGist: [],
    code: ''
};

var editor = ace.edit("editor"); // the numbering
editor.setTheme("ace/theme/monokai"); // theme
editor.getSession().setMode("ace/mode/javascript");  // language want to use
editor.setValue("# Start your work here\n"); // adding a value
editor.session.setOption("useWorker", false); //disable the corrections
    

var editor2 = ace.edit("editor2"); // the numbering
editor2.setTheme("ace/theme/chrome"); // theme
editor2.getSession().setMode("ace/mode/javascript");  // language want to use
editor2.setReadOnly(true);   // make the editor only read 
editor2.setValue("// Javascript will appear here\n");
editor2.session.setOption("useWorker", false);


function print( input ) {
    
    
    for ( var i in data.variables ) {
        if ( data.variables[i].name === input ) {
            
            return 'console.log('+ data.variables[i].value +');';
        }
    }
    
    return 'console.log('+ input.join(' ') +');';
    
}


function makeFunction( input ) {
    
    data.func.push({
        func_name: input[2],
        params: input[3][1],
        body: input.splice(4, input.length).join(' ')
    });
    
    var func_name = input[2];

    for(var i = 0; i < data.func.length; i++) {
        
        if (data.func[i].func_name === func_name ){
            
            var body = data.func[i].body;
            
            if ( body[0] === 'return' ) {
                
                body[0] = 'return ';
                body =  body.join(' ') + ';';
            }
            else if ( body[0] === 'print' ) {
                
                body =  print( body.splice(1, body.length) );
            }
            else {
                
                body = 'return ' + body.join(' ');
            }
            
            return "function " + data.func[i].func_name +"("+ data.func[i].params +") { \n \t" + body +" \n}";
        }
    }
}

function callFunction( input ) {
    
    for(var i = 0; i < data.func.length; i++) {
        
        if (data.func[i].func_name === input[1]){
            
            return input[1] + '('+ input[input.length - 1] +');';
        }
    }
}


function makeVariable( input ) {
    
    input = input.split(':');
    
    for ( var i = 0; i < input.length; i+=2 ) {
        
        data.variables.push({ 
            name: input[i],
            value: input[i + 1]
        });
        
        return 'var '+ input[i] + ' = ' + input[i + 1] + ';';
    }

}

function makeWordGist() {
    
    data.wordGist.push({
        name: prompt('name'),
        code: editor.getValue()
    });
    
    
}

function parseInput( input ) {
    
    input = input.split(' ');
    var output;
    
    // input data: 'make variable x:3'
    // output data: ['make' 'variable' 'x:3']
    
    switch ( input[0].toLowerCase() ) {
        
        case 'make':
            
            switch ( input[1].toLowerCase() ) {
                
                case 'var':
                    
                    // target index two as the variable
                    output = makeVariable( input[2] );
                    break;
                case 'function':
                    
                    output = makeFunction( input );
                    break;
            }
            break;
        case 'print':
            
            output = print( input.splice(1, input.length) );
            break;
        case 'call':
            
            output = callFunction( input );
            break;
        case '#':
            
            output = '// ' + input.splice(1, input.length).join(' ');
            break;
        default:
            
            output = input;
            break;
    }
    
    return output;
}
// arg = [x,y,z];
// "[x,y,z]"
// arg.slice(1, arg.length - 1)
// "x,y,z"
// arg.slice(1, arg.length - 1).split(',')
// ["x", "y", "z"]
$(document).ready(function(){
    $("#editor").keydown(function(key){
        if(key.which === 13){
            
            var input = editor.getValue().split('\n');
            
            var output = '';
            for(var i in input){
                output += parseInput( input[i] ) + '\n';
                
                if ( output !== undefined ) {
                    editor2.setValue( output );
                } 
            }    
        }
    });
    
    $('#save').click(function() {
        makeWordGist();
    });
   $("#print").click(function(){
        
        editor.insert("\nprint ");
    });
    $("#function").click(function(){
        editor.insert("\nmake function ");
    });
    $("#parameter").click(function(){
        
        editor.insert("\n[  ]");
    });
    $("#make").click(function(){
        
        editor.insert("\nmake ");
    });
    $("#call").click(function(){
        
        editor.insert("\ncall ");
    });
    $("#loop").click(function(){
        
        editor.insert("\nfor");
    });
    $("#var").click(function(){
        
        editor.insert("\nmake var ");
    });
    
});
