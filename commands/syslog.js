module.exports = {
    name:'syslog',
    description:'Returns the last 100 lines of syslog',
    script: 'tail -n 100 /var/log/syslog | tac'
};
