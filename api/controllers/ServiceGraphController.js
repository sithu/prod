/**
 * ServiceGraphController
 *
 * @module      :: ServiceGraphController
 * @description :: The controller for the graph view of services.
 * @docs        :: http://wiki.intuit.com/Service
 */

module.exports = {
    graph: function(req, res) {
        var in_name = req.query.name;
        var in_env = req.query.environment;
        
        if (in_name == undefined || in_env == undefined) {
            return res.json({error: "You must specify an app name and environment."}, 400);
        }
        
        return res.view('service/graph', {name: in_name, env: in_env});   
    }
}