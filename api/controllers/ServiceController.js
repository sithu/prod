/**
 * ServiceController
 *
 * @module      :: ServiceController
 * @description	:: The controller for the Service functions.
 * @docs        :: http://wiki.intuit.com/Service
 */

module.exports = {
    create: function(req, res) {
        var in_name = req.body.name;
        var in_version = req.body.version;
    
        Bom.findOne({name: in_name, version: in_version}, function(err, record) {
            if (!record) {
                return res.json({error: 'Service must correspond with an existing BOM.'}, 400);
            }
            
            Service.findOne({name: in_name, version: in_version }, function(err, record) {
                if (err) {
                    res.json({error: 'DB error'}, 500);
                }
                if (record) {
                    return res.json({error: 'Service record already exists, you must use a Put to update.', data: {name: in_name, version: in_version}}, 400);
                }
                Service.create(req.body, function(err, new_record) {
                    if (err) {
                        res.json('DB error', 500);
                    }
                    return res.json(new_record);
                });
            });
        });
    },
    
    search: function(req, res) {
        var in_name = req.query.name;
        var in_version = req.query.version;
        var in_env = req.query.environment;
        var in_id = req.params.id;
        var criteria = {};
    
        if (in_id != undefined) {
            criteria = {id: in_id};
        }
        else {
            if (in_name == undefined && in_env == undefined) {
                return res.json({error: "You must specify an app name and/or an environment."}, 400);
            }
            
            if (in_name != undefined) {
                criteria.name = in_name;
            }
        
            if (in_version != undefined) {
                criteria.version = in_version;
            }
            if (in_env != undefined) {
                criteria.environment = in_env;
            }
        }
        
        
        Service.find(criteria, function(err, records) {
            if (err) {
                res.json({error: 'DB error'}, 500);
            }
            
            res.send(records);
        });
    },
    
    resolve_list: function(req, res) {
        var in_name = req.query.name,
            in_version = req.query.version,
            in_env = req.query.environment;
        var criteria = {};
    
        if (in_name == undefined || in_env == undefined) {
            return res.json({error: "You must specify at least service name and environment"}, 400);
        }
        
        criteria.name = in_name;
        criteria.environment = in_env;
        
        if (in_version != undefined) {
            criteria.version = in_version;
        }
    
        resolvedList(criteria, false, function(err, results) {
            res.json(results);
        });
    },
    
   resolve_tree: function(req, res) {
        var in_name = req.query.name,
            in_version = req.query.version,
            in_env = req.query.environment;
        var criteria = {};
    
        if (in_name == undefined || in_env == undefined) {
            return res.json({error: "You must specify at least service name and environment"}, 400);
        }
        
        criteria.name = in_name;
        criteria.environment = in_env;
        
        if (in_version != undefined) {
            criteria.version = in_version;
        }
    
        resolvedTree(criteria, function(err, results) {
            res.json(results);
        });
    } ,
    
    graph_list: function(req, res) {
        var in_name = req.query.name,
            in_version = req.query.version,
            in_env = req.query.environment;
        var criteria = {};
    
        if (in_name == undefined || in_env == undefined) {
            return res.json({error: "You must specify at least service name and environment"}, 400);
        }
        
        criteria.name = in_name;
        criteria.environment = in_env;
        
        if (in_version != undefined) {
            criteria.version = in_version;
        }
    
        resolvedList(criteria, true, function(err, results) {
            var sigma_data = convertToSigma(results);
            res.json(sigma_data);
        });
    },
    
    _config: {}
};

function convertToSigma(in_list) {
    var sigma_data = {};
    var node_list = [];
    var edge_list = [];
    
    // Need to build a hashmap based on id to create a set of unique nodes.
    var hashMap = {};
    in_list.forEach(function(li) {
        hashMap[li.node.id] = li;
    });
    
    for(var key in hashMap) {
        if(hashMap.hasOwnProperty(key)) {
            var li = hashMap[key];
            var node_color;
            if (li.status == 'Unresolved') {
                node_color = "rgb(255,0,0)";
            }
            else {
                node_color = "rgb(0,204,204)";
            }
            node_list.push({label: li.node.name, id: li.node.id, environment: li.node.environment, x: Math.random(), y: Math.random(), color: node_color, size: '5'});
        }
    }
    
    var i = 0;
    in_list.forEach(function(li) {
        if (li.parent_id) {
            edge_list.push({source: li.parent_id, target: li.node.id, id: 'e' + i++});
        }
    });
    
    sigma_data.edges = edge_list;
    sigma_data.nodes = node_list;
    
    return sigma_data;
}

function resolvedList(head, forGraph, callback) {
    var results = [];
        
    Service.findOne({name: head.name, environment: head.environment}, function(err, s) {
        var res = {node: head};
        
        if (err) {
            return callback(err);
        }
        
        if (head.pname) {
            res.parent = head.pname;
            delete(head.pname);
        }
        if (head.pid) {
            if (forGraph) {
                res.parent_id = head.pid;
            }
            delete(head.pid);
        }
        
        if (!s) {
            // Assign a temp id but only if graphing
            if (forGraph) {
                res.node.id = tempGuid();
            }
            res.status = 'Unresolved';
            results.push(res);
            return callback(null, results);
        }
        
        res.status = 'Found';
        res.node.version = s.version;
        res.node.environment = s.environment;
        if (forGraph) {
            res.node.id = s.id;
        }
        results.push(res);
        
        var pending;
        if (s.serviceDeps != undefined) {
            pending = s.serviceDeps.length;
        }
        else {
            pending = 0;
        }
        if (!pending) {
            return callback(null, results);
        }
        
        s.serviceDeps.forEach(function(si) {
            resolvedList({name: si.name, environment: si.environment, pname: s.name, pid: s.id}, forGraph, function(err, res) {
                results = results.concat(res);
                if (!--pending) {
                    return callback(null, results);
                }
            });
        });
    });
}

function resolvedTree(head, callback) {
    var res = {};
    
    Service.findOne({name: head.name, environment: head.environment}, function(err, s) {
        res.name = head.name;
        
        if (err) {
            return callback(err);
        }
        
        if (!s) {
            res.status = 'Unresolved';
            return callback(null, res);
        }
        
        res.status = 'Found';
        res.version = s.version;
        res.environment = s.environment;
        
        var pending;
        if (s.serviceDeps != undefined) {
            pending = s.serviceDeps.length;
            if (pending) {
                res.deps = [];
            }
        }
        else {
            pending = 0;
        }
        if (!pending) {
            return callback(null, res);
        }
        
        s.serviceDeps.forEach(function(si) {
            resolvedTree({name: si.name, environment: si.environment, pname: s.name, pid: s.id}, function(err, r) {
                res.deps.push(r);
                if (!--pending) {
                    return callback(null, res);
                }
            });
        });
    });
}

function tempGuid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
