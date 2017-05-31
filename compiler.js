#!/usr/bin/env node

var fs = require('fs');

var global_object = {
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
        
        eval( global_object.code );
    }
    catch(e) {
        
        catchError('wordScript *error: ' + e.message);
    }
}

function print( input ) {
    
    input = input.splice(1, input.length);
    
    if ( input.length === 1 ) {
        
        // return back the translated javascript code
        return `console.log( ${ input.join(' ') } );`;
    }
    
    /*
        checks with the input is a variable already
        declared in the data obj variables property
    */
    for ( var i in global_object.variables ) {
        
        /*
            if it exsit then return back the
            stringifyed sjavascript code with 
            the value of the concated inside of the string
        */
        if ( includes( input, global_object.variables[i].name ) ) {
            
            return `console.log( ${ input.join(' ') } );`;
        }
    }
    
    if ( input[0] === 'call' ) {
        
        var func = callFunction( input );
        
        return `console.log( ${ func.slice(0, func.length - 1) } );`;
    }
    
    return `console.log( ${ input.join(' ') } );`
    
}

// arg = [x,y,z];
// "[x,y,z]"
// arg.slice(1, arg.length - 1)
// "x,y,z"
// arg.slice(1, arg.length - 1).split(',')
// ["x", "y", "z"]
function makeFunction( input ) {
    
    global_object.func = [];
    
    
    var func_name = input[2];
    
    global_object.func.push({
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

    for(var i = 0; i < global_object.func.length; i++) {
        
        if (global_object.func[i].func_name === func_name ){
            
            var body = global_object.func[i].body.split(' ');
            
            
            if ( body[0] !== 'return' && body[0] !== 'print' ) {
                
                body = `return ${ body.join(' ') } ;`;
            }
            else if ( body[0] === 'print' ) {
                
                body =  print( body.splice(1, body.length) );
            }
            else {
                
                body = `${ body.join(' ') } ;`;
            }
            
            
            return `function ${ global_object.func[i].func_name} ( ${ global_object.func[i].params } ) { \n \t ${ body } \n}`;
        }
    }
    
    
}

function callFunction( input ) {
    
    for(var i = 0; i < global_object.func.length; i++) {
        
        if (global_object.func[i].func_name === input[1]){
            
            for ( var i in global_object.variables ) {
                
                if ( input[input.length - 1] === global_object.variables[i] ) {
                    
                    return `${ input[1] } ( ${ global_object.variables[i] } );`;
                }
            }
            
            return `${ input[1] } ( ${ input[input.length - 1] } );`;
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
        global_object.variables.push({
            name: input[0],
            value: input[1],
        });
        
        
        // lastly return the javascript code of the fromated variable
        return  `var ${ input[0] } = ${ input[1] };`;
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
    global_object.variables.push({ 
        name: input[0].split(' ').join(''),
        value: input[1].split(' ').join('')
    });
    
    // lastly return the javascript code of the fromated variable
    return `var ${ input[0].split(' ').join('') } = ${ input[1].split(' ').join('') };`;
    

}

// saves the code that the user word in wordScript
/*function makeWordGist() {
    
    
        pushes the code to the 
        data obj to property wordGist
    
    data.wordGist.push({
        name: prompt('name'),
        code: editor.getValue(),
        translated_code: data.code
    });

}*/

// makes a loop
function makeLoop( input ) {
    
    // gets the input of the frist and last offset
    
    
    if ( includes(input, ':') ) {
        
        if ( includes(input, 'print') ) {
            
            return `for ( var i = ${ input[ input.indexOf('to') - 1 ] }; i <= ${ input[ input.indexOf('to') + 1 ] }; i++ ) {\n     ${ print( input.splice( input.indexOf('print'), input.length ) )  } \n}`;
        }
        else {
            
            return `for ( var i = ${ input[ input.indexOf('to') - 1 ] }; i <= ${ input[ input.indexOf('to') + 1 ] }; i++ ) {\n     ${ input.splice(input.indexOf(':') + 1, input.length).join(' ') } \n}`;
        }
    }
    
    // return the translated javascript code
    return `for ( var i = ${ input[ input.indexOf('to') - 1 ] }; i <= ${ input[ input.indexOf('to') + 1 ] }; i++ ) {\n     console.log( i ); \n}`;
}



function catchError( err, callback ) {
	
	
	if ( callback === undefined ) {

		console.log( err || `*error: ${ err.message ? err.message : 'error returned ' + err }` );
		return;
	}
	else if ( callback !== undefined ) {

		return callback({
			status: false,
			msg: err || `*error: ${ err.message.split(' ').splice(1, err.message.split(' ').length).join(' ') }`
		}, undefined);
	}
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

var arg = process.argv.splice(process.argv.length - 1, process.argv.length);

if ( arg.length !== 0 ) {
    
    fs.exists(`${ __dirname }/${ arg }`, ( err, rsp ) => {
        if ( !err ) return catchError( err );
        
        fs.readFile(arg[0], 'utf8', ( err, data ) => {
            if ( err ) return catchError( err );
            
            var script = data.split('\n');
            
            if ( script[0] === '<wordScript>' ) {
                
                for ( var l = 1; l < script.length; l ++ ) {
                
                    if ( script[l] !== '' ) {
                        
                        // parseInput( script[l] );
                        global_object.code += parseInput( script[l] ) + '\n';
                    }
                }
                
                if ( global_object.code !== undefined ) {
                    
                    run();
                }
                return;
            }
            
            return catchError(`wordScript *error:  '${ arg[0] }' is not a excutable wordScript file.`)
        });
    })
}