/**
 * BomController
 *
 * @module      :: BomController
 * @description	:: The controller for the BOM functions.
 * @docs        :: http://wiki.intuit.com/BOM
 */

module.exports = {
    create: function(req, res) {
        var in_name = req.body.name;
        var in_version = req.body.version;
    
    debugger;
        if (in_name == undefined || in_version == undefined || in_name.length === 0 || in_version.length === 0) {
        console.log('name ' + in_name + ' version ' + in_version);
            return res.json({error: "You must specify a name and version."}, 400);
        }
        
        Bom.findOne({name: in_name, version: in_version }, function(err, record) {
            if (err) {
                res.json({error: 'DB error'}, 500);
            }
            if (record) {
                return res.json({error: 'BOM record already exists, you must use a Put to update.', data: {name: in_name, version: in_version}}, 400);
            }
            Bom.create(req.body, function(err, new_record) {
                if (err) {
                    res.json('DB error', 500);
                }
                return res.json(new_record);
            });
        });
    },
    
    editbom: function(req, res) {
        var in_id = req.params.id;
        
        if (in_id == undefined) {
            return res.json({error: "You must specify and id."}, 400);
        }
        return res.view('bom/gedit', {id: in_id});
    },
    
    search: function(req, res) {
        var in_name = req.query.name;
        var in_version = req.query.version;
        var in_id = req.params.id;
        
        if (in_id != undefined) {
            criteria = {id: in_id};
        }
        else {
            if (in_name == undefined) {
                return res.json({error: "You must specify at least an app name."}, 400);
            }
            
            var criteria = {name: in_name};
            
            if (in_version != undefined) {
                criteria.version = in_version;
            }
        }
    
        Bom.find(criteria, function(err, records) {
            if (err) {
                res.json({error: 'DB error'}, 500);
            }
            
            res.json(records);
        });
    },
    
    resolve: function(req, res) {
        var in_name = req.query.name,
            in_version = req.query.version;
    
        if (in_name == undefined || in_version == undefined) {
            return res.json({error: "You must specify a name and version."}, 400);
        }
        
        processTree({name: in_name, version: in_version}, function(err, results) {
            res.json(results);
        });
    },
    _config: {}
};

function processTree(head, callback) {
    var results = [];
    var parent = null;
    
    if (head.parent != undefined) {
        parent = head.parent;
        delete head['parent'];
    }
    
    Bom.findOne(head, function(err, b) {
        var res = {node: head};
        
        if (err) {
            return callback(err);
        }
        
        if (parent) {
            res.parent = parent;
        }
        
        if (!b) {
            res.status = 'Unresolved';
            results.push(res);
            return callback(null, results);
        }
        
        res.status = 'Found';
        results.push(res);
        
        var pending;
        if (b.deps != undefined) {
            pending = b.deps.length;
        }
        else {
            pending = 0;
        }
        if (!pending) {
            return callback(null, results);
        }
        
        b.deps.forEach(function(bi) {
            processTree({name: bi.name, version: bi.version, parent: b.name}, function(err, res) {
                results = results.concat(res);
                if (!--pending) {
                    return callback(null, results);
                }
            });
        });
    });
}