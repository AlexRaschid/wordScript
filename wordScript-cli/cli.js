const clib = require('./clib'),
wordScript = require('./compiler.js');

function method(action, obj) {
    
    switch ( action ) {
        
        case 'run':
            
            console.log('compiling....');
            
            const file_name = obj.payload[0];
            
            wordScript.compile( file_name );
        break;
    }
}


clib.argParser(process.argv, (err, obj) => {
    if (err) return clib.catchError(err);
    
    
    clib.dispatch_action(method, obj);
});