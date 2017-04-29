var data = {
    variables: [],
    func: []
};

var editor = ace.edit("editor"); // the numbering
    editor.setTheme("ace/theme/monokai"); // theme
    editor.getSession().setMode("ace/mode/javascript");  // language want to use
    editor.setValue("# Start your work here\n"); // adding a value
    

var editor2 = ace.edit("editor2"); // the numbering
    editor2.setTheme("ace/theme/chrome"); // theme
    editor2.getSession().setMode("ace/mode/javascript");  // language want to use
    editor2.setReadOnly(true);   // make the editor only read 
    editor2.setValue("//Javascript will appear here\n");

function print( input ) {
    
    for ( var i in data.variables ) {
        if ( data.variables[i].name === input ) {
            
            return 'console.log('+ data.variables[i].value +');';
        }
    }
    
    return 'console.log('+ input +');';
    
}


function makeFunction( input ) {
    
    data.func.push({
        func_name: input[2],
        params: input[4],
        body: input.splice(5, input.length).join(' ')
    });
    
}

function callFunction ( input ) {
    
    for(var i = 0; i < data.func.length; i++) {
        
        if (data.func[i].func_name === input){
            // console.log(data.func[i]func_name);
            return "function " + data.func[i].func_name +"("+ data.func[i].params +") { " + data.func[i].body +" }";
        }
    }
}

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
                    output = makeFunction( input );
                    break;
            }
            break;
        case 'print':
            
            output = print( input[1] );
            break;
        case 'call':
            
            //makeCall( input );
            break;
        case '#':
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
                    console.log("undefined");
                    editor2.setValue( output );
                }

                
            }
            
        }
        
        
    });   
    
    
});
$("#print").click(function(){
   
});


// makeVariable('make variabel x : "3"');
// $(document).ready(function());