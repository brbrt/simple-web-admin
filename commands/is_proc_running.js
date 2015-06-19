module.exports = {
    name:'is_proc_running',
    description:'Checks if the specified process is running.',
    script: 'ps aux | grep {{name}}',
    args:[
       'name'
    ]
};
