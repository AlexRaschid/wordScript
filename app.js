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




var data = {
    variables: [],
    func: [],
    wordGist: [],
    code: ''
};

function includes( array, item ) {
    
    for ( var i in array ) {
        if ( array[i] === item ) {
            
            return true;
        }
    }
    
    return false
}

function run() {
    
    try {
        eval( data.code );
    }
    catch(e) {
        console.log('*error: ' + e.message);
    }
}

function print( input ) {
    
    if ( input.length === 1 ) {
        
        // return back the translated javascript code
        return 'console.log('+ input.join(' ') +');';
    }
    
    
    input = input.splice(1, input.length);
    
    /*
        checks with the input is a variable already
        declared in the data obj variables property
    */
    for ( var i in data.variables ) {
        
        /*
            if it exsit then return back the
            stringifyed sjavascript code with 
            the value of the concated inside of the string
        */
        if ( data.variables[i].name === input ) {
            
            return 'console.log('+ data.variables[i].value +');';
        }
    }
    
    if ( input[0] === 'call' ) {
        
        var func = callFunction( input );
        // console.log( func.slice(0, func.length - 1) );
        return 'console.log( ' + func.slice(0, func.length - 1) + ' );';
    }
    
    
}


function makeFunction( input ) {
    
    data.func = [];
    
    
    var func_name = input[2];
    
    data.func.push({
        func_name: input[2],
        params: input[3][0] !== '[' ? null : input[3].slice(1, input[3].length - 1).split(','),
        body: input.length === 7 ? input.splice(3, input.length).join(' ') : input.splice(4, input.length).join(' ')
    });
    
    // arg = [x,y,z];
    // "[x,y,z]"
    // arg.slice(1, arg.length - 1)
    // "x,y,z"
    // arg.slice(1, arg.length - 1).split(',')
    // ["x", "y", "z"]

    for(var i = 0; i < data.func.length; i++) {
        
        if (data.func[i].func_name === func_name ){
            
            var body = data.func[i].body.split(' ');
            
            
            if ( body[0] !== 'return' && body[0] !== 'print' ) {
                
                body = 'return ' + body.join(' ') + ';';
            }
            else if ( body[0] === 'print' ) {
                
                body =  print( body.splice(1, body.length) );
            }
            else {
                
                body = body.join(' ') +';';
            }
            
            
            return "function " + data.func[i].func_name +"("+ data.func[i].params +") { \n \t" + body +" \n}";
        }
    }
    
    
}

function callFunction( input ) {
    
    for(var i = 0; i < data.func.length; i++) {
        
        if (data.func[i].func_name === input[1]){
            
            for ( var i in data.variables ) {
                
                if ( input[input.length - 1] === data.variables[i] ) {
                    
                    return input[1] + '('+ data.variables[i] +');';
                }
            }
            
            return input[1] + '('+ input[input.length - 1] +');';
        }
    }
    
}


function makeVariable( input ) {
    
    /*
        slice the list to remove the word 'make' and 'var'
        and only have '<variable_name>' ':' '<value>'
    */
    input = input.slice(2, input.length );
    
    
    /*
        if the array's last offset is splited
        to return back array which has a length
        greater then 1 then follow this statement.
        
        ex: '<variable>:<value>'
        
        and that it that the last frist offset in 
        the last item of the array is not a quotation.
    */
    
    if ( input[input.length - 1].length > 1 
        && input[input.length - 1][0] !== "'" 
        && input[input.length - 1][0] !== 't' 
        && input[input.length - 1][0] !== 'f' ) {
        
        // split the last offset by the colon
        input = input[input.length - 1].split(':');
        
        /*
            get the desired target values 
            from the return splited array
            and push them to the data obj
            to variable property.
        */
        data.variables.push({
            name: input[0],
            value: input[1],
        });
        
        
        // lastly return the javascript code of the fromated variable
        return  'var ' + input[0] + ' = ' + input[1] + ';' ;
    }
    
    /*
        if the codintion was not true then:
        join the list then split by colon
    
        input before: [ '<variable_name>' ':' '<value>' ]
        input after: [ '<variable_name>' '<value>' ]
    */
    input = input.join(' ').split(':');
    
    /*
        get the desired variables in the 
        array new input array then puh them 
        to the data obj and tore them in 
        the variables property
    */
    data.variables.push({ 
        name: input[0].split(' ').join(''),
        value: input[1].split(' ').join('')
    });
    
    // lastly return the javascript code of the fromated variable
    return 'var ' + input[0].split(' ').join('') + ' = ' + input[1].split(' ').join('') + ';';
    

}

// saves the code that the user word in wordScript
function makeWordGist() {
    
    /*
        pushes the code to the 
        data obj to property wordGist
    */
    data.wordGist.push({
        name: prompt('name'),
        code: editor.getValue(),
        translated_code: data.code
    });

}

// makes a loop
function makeLoop( input ) {
    
    // gets the input of the frist and last offset
    var start = input[2];
    var end = input[input.length - 1];
    
    // return the translated javascript code
    return 'for ( var i = '+ start +'; i <= '+ end +'; i++ ) {\n console.log( i );\n}'
}

// parsers the worScrit code
function parseInput( input ) {
    
    input = input.split(' ');
    var output;
    
    // input data: 'make variable x : 3'
    // output data: ['make' 'variable' 'x' ':' '3']
    
    switch ( input[0].toLowerCase() ) {
        
        case 'make':
            
            switch ( input[1].toLowerCase() ) {
                
                case 'loop':
                    
                    output = makeLoop( input );
                    break;
                case 'var':
                    
                    // target index two as the variable
                    output = makeVariable( input );
                    break;
                case 'function':
                    
                    output = makeFunction( input );
                    break;
            }
            break;
        case 'print':
            
            output = print( input );
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




$(document).ready(function(){
    $("#editor").keydown(function(key){
        if(key.which === 13){
            
            var input = editor.getValue().split('\n');
            
            data.code = '';
            for(var i in input){
                data.code += parseInput( input[i] ) + '\n';
                
                if ( data.code !== undefined ) {
                    editor2.setValue( data.code );
                } 
            }    
        }
    });
    
    $('#run').click(function() {
        run();
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
        
        editor.insert("\nmake loop");
    });
    $("#var").click(function(){
        
        editor.insert("\nmake var ");
    });
    
});
