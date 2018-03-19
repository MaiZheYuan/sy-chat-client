function log(){};
log.prototype.apply = function (compiler) {
    compiler.plugin("compile",function (params) {
        console.log("yyyyyyyyyyyyyyyjjjjjjjjj",params);
    })
};
module.exports = log;