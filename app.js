var data = {
    variables: [],
    func: []
};

var editor = ace.edit("editor"); // the numbering
    editor.setTheme("ace/theme/monokai"); // theme
    editor.getSession().setMode("ace/mode/javascript");  // language want to use

function print( input ) {
    
    for ( var i in data.variables ) {
        if ( data.variables[i].name === input ) {
            
            return 'console.log('+ data.variables[i].value +');';
        }
    }
    
    return 'console.log('+ input +');';
    
}


function makeFunction( input ) {
    
    console.log(input);
    {
        func_name: input[2],
        params: input[3],
        
    }
//     input = input.split (':') 
//     for ( var i = 0, i < input.length; i++);
    
//     data.func.push({
//         name: input[i],
//         value: input[i]
//     });
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
                    makeFunction( input );
                    break;
            }
            break;
        case 'print':
            
            output = print( input[1] );
            break;
        case 'call':
            
            //makeCall( input );
            break;
        default:
            break;
    }
    console.log(output)
}

$(document).ready(function(){
    $("#editor").keydown(function(key){
        if(key.which === 13){
            
            var input = editor.getValue().split('\n');
            for(var i in input){
                $(".output").append("<p class = 'wordScriptTxt'>" + parseInput(input[i]) + "</p>");
                
            }
            
            // parseInput();
        }
        
        
    });   
    
    
});



// makeVariable('make variabel x : "3"');
// $(document).ready(function());