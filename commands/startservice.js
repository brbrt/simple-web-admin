module.exports = {
    name:'startservice',
    description:'Starts the specified service.',
    script: 'service {{name}} start',
    args:[
       'name'
    ]
};
