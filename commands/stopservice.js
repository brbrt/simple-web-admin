module.exports = {
    name:'stopservice',
    description:'Stops the specified service.',
    script: 'service {{name}} stop',
    args:[
       'name'
    ]
};
