var mysql = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}
var successResponseData    = {};
successResponseData["response_code"] = "1";
successResponseData["response"] = "Success";
var failureResponseData    = {};
failureResponseData["response_code"] = "0";
failureResponseData["response"] = "Failure";

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.post("/data",function(req,res){
                var data = req.body.data;
                console.log("Result : " , data);
                if(data != "" && data != undefined)
                    res.json({"Response" : successResponseData,"Result" : data});
                else
                    res.json({"Response" : failureResponseData,"Result" : data});
    });

    router.post("/list_data",function(req,res){
                var details = [];
                var table = req.body.table;
                var device_query = "SELECT * FROM ?? ; ";
                var device_table = [table];
                device_query = mysql.format(device_query,device_table);

                connection.query(device_query,function(err,row){
                    if(err){
                        res.json({"Response" : failureResponseData,"Result" : err});
                    }
                    if(row.length > 0){
                        for(var i=0; i<row.length; i++){
                            details.push(row[i]);
                        }
                    }
 res.json({"Response" :successResponseData ,"Result" :details});
              });
          });

    router.post("/nearby_drivers",function(req,res){
        var details = [];
        var final_results = [];
        var table = req.body.table;
        var type = req.body.type;
        var lat = req.body.lat;
        var lon = req.body.lon;
        var sub_query = "SELECT provider_id FROM provider_services where status='active'; ";
        // var device_table = [table];
                // device_query = mysql.format(device_query,device_table);

        /*connection.query(device_query,function(err,row){
            if(err){
                res.json({"Response" : failureResponseData,"Result" : data});
            }
            if(row.length > 0){
                for(var i=0; i<row.length; i++){
                    details.push(row[i]);
                }*/
                var select_query = "id,first_name, last_name, latitude, longitude , (1.609344 * 3956 * acos( cos( radians('"+lat+"') ) * cos( radians(latitude) ) * cos( radians(longitude) - radians('"+lon+"') ) + sin( radians('"+lat+"') ) * sin( radians(latitude) ) ) ) AS distance";
                var result_query = "SELECT "+ select_query + "FROM providers where status='approved' AND id IN ("+sub_query+") having distance < 10 order by distance desc;";
                connection.query(result_query,function(error,rows){
                    if(error){
                        res.json({"Response" : failureResponseData,"Result" : error});
                    }
                    if(rows.length > 0){
                        for(var i=0; i<rows.length; i++){
                            final_results.push(rows[i]);
                        }
                    }
                    res.json({"Response" :successResponseData ,"Result" : final_results});

                });
            /*}else{
                res.json({"Response" :successResponseData ,"Result" :details});
            }*/
          // });
 });
}

module.exports = REST_ROUTER;

