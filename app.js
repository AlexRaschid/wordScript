var data = {
    variables: [],
    func: [],
    // save: []
};

var editor = ace.edit("editor"); // the numbering
    editor.setTheme("ace/theme/monokai"); // theme
    editor.getSession().setMode("ace/mode/javascript");  // language want to use
    editor.setValue("//Start your work here\n"); // adding a value
    editor.session.setOption("useWorker", false); //disable the corrections
    

var editor2 = ace.edit("editor2"); // the numbering
    editor2.setTheme("ace/theme/chrome"); // theme
    editor2.getSession().setMode("ace/mode/javascript");  // language want to use
    editor2.setReadOnly(true);   // make the editor only read 
    editor2.setValue("//Javascript will appear here\n");
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
        body: input.splice(5, input.length).join(' ')
    });
    
    return input[2];
}

function printFunction( input ) {
    
    for(var i = 0; i < data.func.length; i++) {
        
        if (data.func[i].func_name === input){
            
            return "function " + data.func[i].func_name +"("+ data.func[i].params +") { \n \t" + data.func[i].body +"; \n}";
        }
    }
}

function callFunction( input ) {
    for(var i = 0; i < data.func.length; i++) {
        
        if (data.func[i].func_name === input){
            
            // var func eval( data.func[i].func_name )
        }
    }
}

//string func
//eval string func
//eval arguments x ..
//eval f(x) 
//

function makeVariable( input ) {
    
    input = input.split(':');
    
    // console.log( input );
    for ( var i = 0; i < input.length; i+=2 ) {
        
        data.variables.push({ 
            name: input[i],
            value: input[i + 1]
        });
        
        return 'var '+ input[i] + ' = ' + input[i + 1] + ';';
    }

}

function parseInput( input ) {
    
    input = input.split(' ');
    var output;
    // input data: 'make vairbale x:3'
    // output data: ['make' 'variable' 'x:3']
    
    switch ( input[0].toLowerCase() ) {
        case 'make':
            
            switch ( input[1].toLowerCase() ) {
                
                case 'var':
                    
                    // target index two as the variable
                    output = makeVariable( input[2] );
                    break;
                case 'function':
                    
                    // console.log( input[1].toLowerCase() );
                    var func_name = makeFunction( input );
                    output = printFunction( func_name );
                    break;
            }
            break;
        case 'print':
            
            output = print( input.splice(1, input.length) );
            break;
        case 'call':
            
            // callFunction( input );
            break;
        case '#':
            output = '';
            break;
        default:
            //console.log( input );
            output = input;
            break;
    }
    
    return output;
}

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
    
    
});
$("#print").click(function(){
    editor.insert("print\n");
    $("#editor").keydown();
});
$("#function").click(function(){
    $("#editor").keydown()
    editor.insert("function\n");
});
$("#parameter").click(function(){
    $("#editor").keydown()
    editor.insert("parameter\n");
});
$("#make").click(function(){
    $("#editor").keydown()
    editor.insert("make\n");
});
$("#call").click(function(){
    $("#editor").keydown()
    editor.insert("call\n");
});
$("#if").click(function(){
    $("#editor").keydown()
    editor.insert("for\n");
});
$("#for").click(function(){
    $("#editor").keydown()
    editor.insert("for\n");
});
$("#var").click(function(){
    $("#editor").keydown()
    editor.insert("var\n");
});
$("#while").click(function(){
    $("#editor").keydown()
    editor.insert("while\n");
});
$("#else").click(function(){
    $("#editor").keydown()
    editor.insert("else\n");
});


// makeVariable('make variabel x : "3"');
// $(document).ready(function());