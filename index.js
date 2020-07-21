const functions = require('firebase-functions');
const admin = require('firebase-admin');
//var 
const cors = require('cors')({origin:true,});
const serviceAccount = require('./mamanet.json'); 
const moment = require('moment-timezone');
//const gcs = require('@google-cloud/storage');
//var app = express();
//var datetime = require('datetime');
var format = require('date-format');

//const json2csv = require("json2csv").parse;

//const csv = require('csv');

const path = require('path');
const os = require('os'); 
const Promise = require('es6-promise').Promise;
const app = admin.initializeApp({
        credential:admin.credential.cert(serviceAccount),
        databaseURL: "https://mamanet-pregnancy-my.firebaseio.com",
        storageBucket : "gs://mamanet-pregnancy-my.appspot.com"
    });

//module.exports = require("./otherData");

 exports.setCatList = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data; 
            let dataSet = {                
                "-v" : 5,
                "_parents":[details.ar_subcat],
                image : details.imageUrl,
                imageURL :details.image,
                imageBanner: details.imageBannerUrl, 
                imageBannerURL: details.imageBanner,
                level : details.ar_level,
                name : details.ge_title,
                name_en : details.en_title,
                name_ms : details.ms_title,
                name_ta : details.tn_title,
                name_zh : details.zh_title,
                parents : details.ar_subcat,
                order : details.ar_order,
                publish : details.ar_publish,
                rel : details.ar_rel,
                periods : details.ar_type
            }
                let db = admin.firestore(); 
                let ref = db.collection("knowledge_type").doc();
                var id = ref.id ; 
            
            
               
               if(details.ar_subcat === ""){
                await db.collection("knowledge_type").doc(id).set(dataSet).then(function() {
                    console.log("Document successfully written!");
                     response.send({data:{status:true,id:id,msg:"Doc updated successfully!"}});
                         return {msg:"Doc updated successfully!"};
                }).catch(error =>{
                    response.send("Error",error);
                    return {msg:"error"};
               })
               }else{
                   await db.collection("knowledge_type").doc(details.ar_subcat).collection("knowledge_type").doc(id).set(dataSet).then(function() {
                        console.log("Document successfully written!");
                         response.send({data:{status:true,id:id,msg:"Doc updated successfully!"}});
                             return {msg:"Doc updated successfully!"};
                    }).catch(error =>{
                        response.send("Error",error);
                        return {msg:"error"};
                   })
                }

             response.send({data:{status:true,dataSet:dataSet} });
                return;  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 
 
 
 exports.setCampaignData = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data; 
            var docId = details.docId;
                 
            var timestamp = admin.firestore.Timestamp.now();
            let dataSet = {           
                imageURL: details.icon_img_url, 
                storageURL: details.icon_storage_url,
                campId : details.docId,
                title : details.ge_title,
                title_en : details.en_title,
                title_ms : details.ms_title,
                title_ta : details.ta_title,
                title_zh : details.zh_title,
                desc : details.ge_desc,
                desc_en : details.en_desc,
                desc_ms : details.ms_desc,
                desc_ta : details.ta_desc,
                desc_zh : details.zh_desc,
                price : details.ge_price,
                price_en : details.en_price,
                price_ms : details.ms_price,
                price_ta : details.ta_price,
                price_zh : details.zh_price,
                questions: details.questions,
                questions_en: details.en_questions,
                questions_ms: details.ms_questions,
                questions_zh: details.zh_questions,
                questions_ta: details.ta_questions,
                answer: details.answer,
                rel : details.ar_rel,
                stage : details.ar_type,
                dateLimit : details.dateLimit,
                startDate:details.startDate,
                endDate : details.endDate,
                status : details.status,
                createdOn:timestamp,
                updatedOn:null
            }
            
            
            
            
            
            let ref = await db.collection("campaign").doc(docId); ref.set(dataSet);
            
             response.send({data:{status:true,dataSet:dataSet} });
                return;  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 exports.campaignOnCreate = functions.region("asia-northeast1").firestore.document("campaign/{campId}").onCreate((snap, context) => {
    const details = snap.data();
    
    
    var timestamp = admin.firestore.Timestamp.now();  
    for (var i = 0; i < 4; i++) {
        let title = "";
        let desc = "";
        let price = "";
        let questions = "";
        let dbs = "";
        if(i===0){
            title = details.title_en;
            desc = details.desc_en;
            price = details.price_en;
            questions = details.questions_en;
            dbs = "campaign_en/";
        }else if(i===1){
            title = details.title_ms;
            desc = details.desc_ms;
            price = details.price_ms;
            questions = details.questions_ms;
            dbs = "campaign_ms/";
        }else if(i===2){
            title = details.title_zh;
            desc = details.desc_zh;
            price = details.price_zh;
            questions = details.questions_zh;
            dbs = "campaign_zh/";
        }else if(i===3){
            title = details.title_ta;
            desc = details.desc_ta;
            price = details.price_ta;
            questions = details.questions_ta;
            dbs = "campaign_ta/";
        }
        let dataObj = {           
                imageURL: details.imageURL, 
                storageURL: details.storageURL,
                campId : details.campId,
                title : title ,
                desc : desc,
                price : price,
                questions: questions,
                answer: details.answer,
                rel : details.rel,
                stage : details.stage,
                dateLimit : details.dateLimit,
                startDate:details.startDate,
                endDate : details.endDate,
                status : details.status,
                createdOn:timestamp,
                updatedOn:null
            }
        db.doc(dbs + snap.id + "/").set(dataObj);
        console.log(dbs+" created successfully");
    }
        return true;
  });
 exports.getUserName = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data;
            
        
            var data = data1 = data2 =  [];
            let db = admin.firestore();
            await db.collection("employee").get().then(snapshot => {     
                snapshot.forEach((doc) => {  
                    var det = doc.data();
                     console.log("Login Data : ",det);
                     
                });
                
                response.send({data:{status:true,details:{userName:data1,referralCode:data2},input:details} });
                return true;
                
            }).catch (error => { 
                response.send({data:{"status":false, "message":"User Not Found"}});   
                return true;
            }); 
            
            response.send({data:{status:true,details:details} });
                return true;
            
        });
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 
 exports.getAuthUser = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data.uid;
            
            
            
            var data = [];
            let db = admin.firestore();
            await db.collection("employee").where("uid","==",details).get().then(snapshot => {    
                snapshot.forEach((doc) => {   
                    data.push(doc.data());                          
                });
                if(snapshot.size===0){
                    response.send({data:{status:false, message:"user not authenticated.!"} });
                    return true;
                }else{
                    response.send({data:{status:true,details:data} });
                    return true;
                }
            }).catch (error => { 
                response.send({data:{"status":false, "message":"user not authenticated.!"}});   
                return true;
            });  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 }); 
 exports.testArticle = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody);  
            var doc = rawBody.data.col;
            var details = [];
            let db = admin.firestore();//.orderBy('createdAt', 'desc')
           console.log(doc);//.where("publishHome","==",true).limit(5)
            await db.collectionGroup(doc).get().then(snapshot => {  
                        snapshot.forEach((doc) => {
                            var dete = doc.data();
                            details.push( [doc.id , dete['content'] , dete['title'], dete['keyword']]);
                            //
                        });
                        response.send({data:{status:true,userdetails:details,Size:snapshot.size} });
                        return true;
                    }).catch (error => { 
                    response.send({data:{"status":false, "message":"user not authenticated.!"}});
                    return true;
                });
                return true;
            
            
      })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 exports.getUserInfoExport = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody);              
            var details = rawBody.data.uid;
            var userDetails =  [];
            let db = admin.firestore();                  
               var i=0;
               var headerTitle = ["id","Display Name","First Name","Last Name","Mobile","Expected","Language","Country","Gender","Identity",
               "Referral","Referral Code","Email","Photo URL","Status"];
                    db.collection("user").orderBy('createdAt', 'desc').get().then(snapshots => {    
                        snapshots.forEach((docx) => {
                            i++;
                            var dete = docx.data(); 
                            
                             
                            var status = dete['status'];
                            
                            userDetails.push( [docx.id , dete['displayName'] , dete['firstName'] , dete['lastName'] , dete['mobile'] , dete['expected'] ,  dete['lang'] 
                                , dete['country'] , dete['gender'], dete['identity'] , dete['referral'], dete['referralCode']  , dete['email'], dete['photoURL'], status]);                      
                    });
                    if(userDetails.length===0){
                        response.send({data:{status:false,details:["No user to list"]} });
                        return true;
                    }else{
                        response.send({data:{status:true,title:headerTitle,userdetails:userDetails} });
                        return true;
                    }
                }).catch (error => { 
                    response.send({data:{"status":false, "message":"user not authenticated.!"}});
                    return true;
                });return true;
             
                
             
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 
 exports.getUserInfo = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
             
            var details = rawBody.data.uid;
            var userDetails = [];
            let db = admin.firestore();
            await db.collection("employee").where("uid","==",details).get().then(snapshot => {  
                var userSize = snapshot.size;
               if(userSize !== 0){
               var i=0;
                    db.collection("user").orderBy('createdAt', 'desc').get().then(snapshots => {    
                        snapshots.forEach((docx) => {
                            i++;
                            var dete = docx.data(); 
                            
                             
                            var status = '';
                            if(dete['status'] === "active"){
                                status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm Cs'>Active</button>";
                               // status = '<button type="button" class="btn mb-1 btn-rounded btn-success btn-sm" onclick="changeStatus("'+docx.id+'","inactive");">Active</button>';
                            }else{
                                status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm cS'>Inactive</button>";
                                //status = '<button type="button" class="btn mb-1 btn-rounded btn-danger btn-sm" onclick="changeStatus("'+docx.id+'","active");">Inactive</button>';
                            }
                            userDetails.push( [docx.id , dete['displayName'] , dete['firstName'] , dete['lastName'] , dete['mobile'] , dete['expected'] ,  dete['lang'] 
                                , dete['country'] , dete['gender'], dete['identity'] , dete['referral'], dete['referralCode']  , dete['email'], dete['photoURL'], status]);                      
                    });
                    if(userDetails.length===0){
                        response.send({data:{status:false,details:["No user to list"]} });
                        return true;
                    }else{
                        response.send({data:{status:true,userdetails:userDetails} });
                        return true;
                    }
                }).catch (error => { 
                    response.send({data:{"status":false, "message":"user not authenticated.!"}});
                    return true;
                });return true;
            }else{
                response.send({data:{"status":false, "message":"user not authenticated.!"}});
                    return true;
            }
                
            }).catch (error => { 
                response.send({data:{"status":false, "message":"user not authenticated.!"}});   
                return true;
            });  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 exports.getUserInfoTest = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody);              
            //var details = rawBody.data.uid;
            var page = rawBody.data.page;
            var limit = 10;
            var offset = 0;
            if(page === 1){
              offset = 0;  
            }else{
              offset = ((page -1) * limit) - 1 ;
            }
            var userDetails = [];
            let db = admin.firestore();
               var i=0;
               db.collection("user").orderBy('createdAt', 'desc').get().then(snapshots => {
                    var lastVisible = snapshots.docs[offset];
                    var dataTotal = snapshots.size;
                if(page!== 1){                
                    db.collection("user").orderBy('createdAt', 'desc').startAfter(lastVisible).limit(limit).get().then(snapshots => {    
                        snapshots.forEach((docx) => {
                            i++;
                            var dete = docx.data(); 
                            var status = '';
                           /* if(dete['status'] === "active"){
                                status = '<button type="button" class="btn mb-1 btn-rounded btn-success btn-sm" onclick="changeStatus('+docx.id+',inactive);">Active</button>';
                            }else{
                                status = '<button type="button" class="btn mb-1 btn-rounded btn-danger btn-sm" onclick="changeStatus('+docx.id+',active);">Inactive</button>';
                            }*/
//                            if(dete['status'] === "active"){
//                                //status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm Cs' onclick='changeStatus('"+docx.id+"','inactive');'>Active</button>";
//                                status = '<form action="data" method="post"><button type="submit" class="btn mb-1 btn-rounded btn-success btn-sm changeStatus">Active</button></form>';
//                            }else{
//                                //status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm cS' onclick='changeStatus('"+docx.id+"','active');'>Inactive</button>";
//                                status = '<form action="data" method="post"><button type="submit" class="btn mb-1 btn-rounded btn-danger btn-sm changeStatus">Inactive</button></form>';
//                            }
                            if(dete['status'] === "active"){
                                //status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm Cs' onclick='changeStatus('"+docx.id+"','inactive');'>Active</button>";
                                //status = '<form action="data" method="post"><button type="submit" class="btn mb-1 btn-rounded btn-success btn-sm changeStatus">Active</button></form>';
                                status = '<form action="data" method="post" class="user_status"><input type="hidden" name="status" value="'+docx.id+'"/><button type="submit" class="btn mb-1 btn-rounded btn-success btn-sm changeStatus">Active</button></form>';
                            }else{
                                //status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm cS' onclick='changeStatus('"+docx.id+"','active');'>Inactive</button>";
                                status = '<form action="data" method="post" class="user_status"><input type="hidden" name="status" value="'+docx.id+'"/><button type="submit" class="btn mb-1 btn-rounded btn-danger btn-sm changeStatus">Inactive</button></form>';
                            }
                            userDetails.push( [docx.id , dete['displayName'], dete['firstName'] , dete['lastName'] , dete['mobile'] , dete['expected'] ,  dete['lang'] 
                                , dete['country'] , dete['gender'], dete['identity'] , dete['referral'], dete['referralCode']  , dete['email'], dete['photoURL'], status,dete['status'], dete['createdAt'], dete['updatedAt']]
                                   ); 
                    });
                    
                    if(userDetails.length===0){
                        response.send({data:{status:false,details:["No user to list"]} });
                        return true;
                    }else{
                        response.send({data:{status:true,userdetails:userDetails,total:dataTotal} });
                        return true;
                    }                    
                }).catch (error => { 
                    response.send({data:{"status":false, "message":"user not authenticated.!",errorMsg:error}});
                    return true;
                });
            }else{
                    db.collection("user").orderBy('createdAt', 'desc').limit(limit).get().then(snapshots => {    
                        snapshots.forEach((docx) => {
                            i++;
                            var dete = docx.data(); 
                            var status = '';
                           /* if(dete['status'] === "active"){
                                status = '<button type="button" class="btn mb-1 btn-rounded btn-success btn-sm" onclick="changeStatus('+docx.id+',inactive);">Active</button>';
                            }else{
                                status = '<button type="button" class="btn mb-1 btn-rounded btn-danger btn-sm" onclick="changeStatus('+docx.id+',active);">Inactive</button>';
                            }*/
                            
                            if(dete['status'] === "active"){
                                //status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm Cs' onclick='changeStatus('"+docx.id+"','inactive');'>Active</button>";
                                //status = '<form action="data" method="post"><button type="submit" class="btn mb-1 btn-rounded btn-success btn-sm changeStatus">Active</button></form>';
                                status = '<form action="data" method="post" class="user_status"><input type="hidden" name="status" value="'+docx.id+'"/><button type="submit" class="btn mb-1 btn-rounded btn-success btn-sm changeStatus">Active</button></form>';
                            }else{
                                //status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm cS' onclick='changeStatus('"+docx.id+"','active');'>Inactive</button>";
                                status = '<form action="data" method="post" class="user_status"><input type="hidden" name="status" value="'+docx.id+'"/><button type="submit" class="btn mb-1 btn-rounded btn-danger btn-sm changeStatus">Inactive</button></form>';
                            }
                            
                            var photoURL = dete['photoURL'];
                            
                            userDetails.push( [docx.id , dete['displayName'], dete['firstName'] , dete['lastName'] , dete['mobile'] , dete['expected'] ,  dete['lang'] 
                                , dete['country'] , dete['gender'], dete['identity'] , dete['referral'], dete['referralCode']  , dete['email'], photoURL, status,dete['status'], dete['createdAt'], dete['updatedAt']]
                                   ); 
                    });
                    
                    if(userDetails.length===0){
                        response.send({data:{status:false,details:["No user to list"]} });
                        return true;
                    }else{
                        response.send({data:{status:true,userdetails:userDetails,total:dataTotal} });
                        return true;
                    }
                    
                }).catch (error => { 
                    response.send({data:{"status":false, "message":"user not authenticated.!",errorMsg:error}});
                    return true;
                });
            }
                           
                           return true;
                }).catch (error => { 
                    response.send({data:{"status":false, "message":"user not authenticated.!",errorMsg:error}});
                    return true;
                });
            
                return true;
             
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 exports.queryFunction = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            //var rawBody = JSON.parse(request.rawBody); 
            //var details = rawBody.data; 
            response.send({data:{status:true,details : "details"} });
            return;
        });
    }catch(error){
        console.log(error);
        response.send({data:{status:false} });
        return;
    }
 });   
 exports.queryData = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data; 
            response.send({data:{status:true,details : details} });
            return;
        });
    }catch(error){
        console.log(error);
        response.send({data:{status:false} });
        return;
    }
 });   
 exports.updatedetails = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
             
            var details = request.body;
            
             response.send({data:{status:true,details:details } });
                return;  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 exports.updateArticleCat = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        var details = rawBody.data.dataSet;
        let uid = rawBody.data.uid;
        let db = admin.firestore();
        db.settings({ ignoreUndefinedProperties: true });
        timestamp = admin.firestore.Timestamp.now(); 
        
        var qy = "knowledge_type/" + uid.replace(":", "/knowledge_type/");               
        
        let dataSet = {
          "-v": 5,
          _parents: [details.parents],
          image: details.imageUrl,
          imageURL: details.image,
          imageBanner: details.imageBannerUrl,
          imageBannerURL: details.imageBanner,
          level: details.level,
          name: details.name,
          name_en: details.name_en,
          name_ms: details.name_ms,
          name_ta: details.name_ta,
          name_zh: details.name_zh,
          parents: details.parents,
          order: details.order,
          publish: details.publish,
          rel: details.rel,
          periods: details.periods,
          updatedAt: timestamp
        };
        await db.doc(qy).update(dataSet).then(function() {
            
            
            for (var i = 0; i < 4; i++) {                   
                  if(i===0){
                    qy = "knowledge_type_en/" + uid.replace(":", "/knowledge_type_en/"); 
                    name = details.name_en;
                  }else if(i===1){
                    qy = "knowledge_type_ms/" + uid.replace(":", "/knowledge_type_ms/"); 
                    name = details.name_ms;
                  }else if(i===2){
                    qy = "knowledge_type_zh/" + uid.replace(":", "/knowledge_type_zh/"); 
                    name = details.name_zh;
                  }else{
                    qy = "knowledge_type_ta/" + uid.replace(":", "/knowledge_type_ta/"); 
                    name = details.name_ta;
                  }
                   dataSet = {
                    "-v": 5,
                    _parents: [details.parents],
                    image: details.imageUrl,
                    imageURL: details.image,
                    imageBanner: details.imageBannerUrl,
                    imageBannerURL: details.imageBanner,
                    level: details.level,
                    name: name,
                    parents: details.parents,
                    order: details.order,
                    publish: details.publish,
                    rel: details.rel,
                    periods: details.periods,
                    updatedAt: timestamp
                  };
                  db.doc(qy).update(dataSet);
                  
            }
            
              
              
              
              
              
            console.log("Document Updated successfully!");
            response.send({
              data: {
                status: true,
                msg: "Article Category updated successfully!"
              }
            });
            return { msg: "Article Category successfully!" };
          })
          .catch(error => {
            response.send("Error", error);
            return { msg: "error" };
          });
      });
    } catch (error) {
      console.log(error);
      response.send({ data: { status: false } });
      return;
    }
  });
 exports.updateArticleDetails = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data;     
           var subcategory = details.subcategory;
           var docId = details.docId;
            var subCat = "";         
            let dataSet = dataSet1 = {};
            var refDoc =  "";
            /**************************************/
            subcategory.forEach(subcategoryArr => {  
                //console.log(subcategoryArr);
               subCat = subcategoryArr.split(":");    
                 //let ref = db.collection("test").doc("0iAnSf8gVEKsiMHwwczn").collection("test").doc("A06XBmoX5wm6xCWinjuA").collection("test").doc();
   refDoc = "/knowledge_type/"+subcategoryArr.replace(":", "/knowledge_type/")+"/knowledge/"+docId;
    ref = db.doc(refDoc);
    var revLen = details.review.length;
   var revData = details.review;
    
   for(var i=0;i<revLen;i++){
        var date = new Date(revData[i].review_on);
        revData[i].review_on =  admin.firestore.Timestamp.fromDate(date);
   }
    var timestamp = admin.firestore.Timestamp.now();
                  dataSet = {    
                        image : details.icon_img_url,
                        imageURL :details.icon_storage_url,
                        title : details.ge_title,
                        title_en : details.en_title,
                        title_ms : details.ms_title,
                        title_zh : details.zh_title,
                        title_ta : details.ta_title,
                        content : details.ge_desc,
                        content_en : details.en_desc,
                        content_ms : details.ms_desc,
                        content_ta : details.ta_desc,
                        content_zh : details.zh_desc,
                        intro : details.ge_intro,
                        intro_en : details.en_intro,
                        intro_ms : details.ms_intro,
                        intro_ta : details.ta_intro,
                        intro_zh : details.zh_intro,
                        keyword : details.ge_tags,
                        keyword_en : details.en_tags,
                        keyword_ms : details.ms_tags,
                        keyword_ta : details.ta_tags,
                        keyword_zh : details.zh_tags,
                        order : 0,//details.ar_order,
                        publish : details.publish,
                        rel : details.ar_rel,
                        stage : details.ar_type,
                        campaign_id : details.ar_campaign_id,
                        typeIds:subcategoryArr ,
                        rev_comments:details.comments,
                        videoURL:details.videoURL,
                        locality:details.locality,
                        searchable:details.is_searchable,
                        commendable:details.is_commendable,
                        visible_on_app:details.is_visible_on_app,
                        visible_on_dashboard:details.is_visible_on_dashboard,
                        
                        reviewArticle : details.review,
                        updatedOn:timestamp
                    };
                    ref.update(dataSet);
                    
                    
                   refDoc1 = "/knowledge_type_en/"+subcategoryArr.replace(":", "/knowledge_type_en/")+"/knowledge_en/"+docId;
    ref1 = db.doc(refDoc1); 
                    
                    dataSet1 = {    
                        image : details.icon_img_url,
                        imageURL :details.icon_storage_url,
                        title : details.en_title,                         
                        content : details.en_desc,
                        intro : details.en_intro,
                        keyword : details.en_tags, 
                        publish : details.publish,
                        rel : details.ar_rel,
                        stage : details.ar_type,
                        campaign_id : details.ar_campaign_id,
                        typeIds:subcategoryArr ,
                        locality:details.locality,
                        videoURL:details.videoURL,
                        updatedOn:timestamp
                    };
                    ref1.update(dataSet1);
                    refDoc1 = "/knowledge_type_ta/"+subcategoryArr.replace(":", "/knowledge_type_ta/")+"/knowledge_ta/"+docId;
    ref1 = db.doc(refDoc1); 
                    
                    dataSet1 = {    
                        image : details.icon_img_url,
                        imageURL :details.icon_storage_url,
                        title : details.ta_title,                         
                        content : details.ta_desc,
                        intro : details.ta_intro,
                        keyword : details.ta_tags, 
                        publish : details.publish,
                        rel : details.ar_rel,
                        stage : details.ar_type,
                        campaign_id : details.ar_campaign_id,
                        typeIds:subcategoryArr ,
                        locality:details.locality,
                        videoURL:details.videoURL,
                        updatedOn:timestamp
                    };
                    ref1.update(dataSet1);
                    
                    refDoc1 = "/knowledge_type_zh/"+subcategoryArr.replace(":", "/knowledge_type_zh/")+"/knowledge_zh/"+docId;
    ref1 = db.doc(refDoc1); 
                    
                    dataSet1 = {    
                        image : details.icon_img_url,
                        imageURL :details.icon_storage_url,
                        title : details.zh_title,                         
                        content : details.zh_desc,
                        intro : details.zh_intro,
                        keyword : details.zh_tags, 
                        publish : details.publish,
                        rel : details.ar_rel,
                        stage : details.ar_type,
                        campaign_id : details.ar_campaign_id,
                        typeIds:subcategoryArr ,
                        locality:details.locality,
                        videoURL:details.videoURL,
                        updatedOn:timestamp
                    };
                    ref1.update(dataSet1);
                    
                    refDoc1 = "/knowledge_type_ms/"+subcategoryArr.replace(":", "/knowledge_type_ms/")+"/knowledge_ms/"+docId;
    ref1 = db.doc(refDoc1); 
                    
                    dataSet1 = {    
                        image : details.icon_img_url,
                        imageURL :details.icon_storage_url,
                        title : details.ms_title,                         
                        content : details.ms_desc,
                        intro : details.ms_intro,
                        keyword : details.ms_tags, 
                        publish : details.publish,
                        rel : details.ar_rel,
                        stage : details.ar_type,
                        campaign_id : details.ar_campaign_id,
                        typeIds:subcategoryArr ,
                        locality:details.locality,
                        videoURL:details.videoURL,
                        updatedOn:timestamp
                    };
                    ref1.update(dataSet1);
 
                
                
            });
            
            

             response.send({data:{status:true,details:refDoc } });
                return;  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 exports.getArticleSubCatList = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        // var body = JSON.parse(request.rawBody);
        let db = admin.firestore();
        let data = request.body;
        var limit = parseInt(data.length);
        var offset = parseInt(data.start);
        var size = 0;
        var details = []; //.limit(3).where("email" , "==" , email )
        // var collection = body.data.col;
        var i = 0;
        var qy = "";
        qy =
          "knowledge_type/" +
          data.parents.replace(":", "/knowledge_type/") +
          "/knowledge_type/";
        await db
          .collection(qy)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              size = snapshot.size;
            });
            return;
          })
          .catch(reason => {
            response.send({ error: reason });
          });
        if (limit === -1) {
          limit = size;
        }
        await db
          .collection(qy)
          .orderBy("createdAt", "desc")
          .offset(offset)
          .limit(limit)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              i++;
              var dete = doc.data();
              //var createdAt = dete['createdAt'].toDate();
              var relative = dete["rel"];
              if (relative === 0) {
                relative = "Both";
              } else if (relative === 1) {
                relative = "Mom";
              } else {
                relative = "Dad";
              }
              var periods = "";
              var periodsData = {
                "1": "Early Pregnancy",
                "2": "Mid Pregnancy",
                "3": "Late Pregnancy",
                "7": "My Body",
                "8": "Breastfeeding",
                "9": "Medicine in Pregnancy",
                "10": "Medical Conditions",
                "11": "Common Questions",
                "12": "Postnatal",
                "14": "Childcare",
                "13": "Pre-Pregnancy"
              };
              periods = periodsData[dete["periods"][0]];
              details.push([
                doc.id,
                dete["name"],
                dete["name_en"],
                dete["name_ms"],
                dete["name_zh"],
                relative,
                dete["imageURL"],
                "",
                periods,
                dete["level"]
              ]);
            });
            response.send({
              qy: qy,
              status: true,
              aaData: details,
              iTotalRecords: size,
              iTotalDisplayRecords: size,
              msg: "Hello from Firebase!"
            });
            // response.send({ data: { status: true, details: details } });
            return true;
          })
          .catch(error => {
            response.send({
              data: { status: false, message: "No data in Article list. " }
            });
            return false;
          }); /* */
        //response.send({data:{status:true,collection:collection}});
        return true;
        // return false;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
  
exports.setArticleDetails = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data;     
           var subcategory = details.subcategory;
           var docId = details.docId;
            var subCat = "";         
            let dataSet = {};
            var refDoc =  "";
            
            /**************************************/
            subcategory.forEach(subcategoryArr => {  
                //console.log(subcategoryArr);
               subCat = subcategoryArr.split(":"); 
               refDoc = "/knowledge_type/"+subcategoryArr.replace(":", "/knowledge_type/")+"/knowledge/";
               let ref = db.collection(refDoc).doc(docId);
               
              var timestamp = admin.firestore.Timestamp.now();
              
              dataSet = {    
                        "_v" : 5,
                        "_typeIds":subCat,
                        image : details.icon_img_url,
                        imageURL :details.icon_storage_url,
                        title : details.ge_title,
                        title_en : details.en_title,
                        title_ms : details.ms_title,
                        title_ta : details.ta_title,
                        title_zh : details.zh_title,
                        content : details.ge_desc,
                        content_en : details.en_desc,
                        content_ms : details.ms_desc,
                        content_ta : details.ta_desc,
                        content_zh : details.zh_desc,
                        intro : details.ge_intro,
                        intro_en : details.en_intro,
                        intro_ms : details.ms_intro,
                        intro_ta : details.ta_intro,
                        intro_zh : details.zh_intro,
                        keyword : details.ge_tags,
                        keyword_en : details.en_tags,
                        keyword_ms : details.ms_tags,
                        keyword_ta : details.ta_tags,
                        keyword_zh : details.zh_tags,
                        order : 0,//details.ar_order,
                        publish : details.publish,
                        rel : details.ar_rel,
                        stage : details.ar_type,
                        campaign_id : details.ar_campaign_id,
                        typeIds:subcategoryArr ,
                        rev_comments:details.comments,
                        locality:details.locality,
                        videoURL:details.videoURL,
                        searchable:details.is_searchable,
                        createdAt:timestamp,
                        commendable:details.is_commendable,
                        visible_on_app:details.is_visible_on_app,
                        visible_on_dashboard:details.is_visible_on_dashboard,
                        reviewArticle:[{"review_by":details.dname,"review_type":"Created","review_on":timestamp,"uid":details.id}]
                        
                    };
                    ref.set(dataSet);
                    
                    var title = "";
                    
 
                for (var i = 0; i < 4; i++) {                   
                  if(i===0){
                    refDoc = "/knowledge_type_en/"+subcategoryArr.replace(":", "/knowledge_type_en/")+"/knowledge_en/";
                    title = details.en_title;
                    content = details.en_desc;
                    intro = details.en_intro;
                    keyword = details.en_tags;
                  }else if(i===1){
                    refDoc = "/knowledge_type_ms/"+subcategoryArr.replace(":", "/knowledge_type_ms/")+"/knowledge_ms/";
                    title = details.ms_title;
                    content = details.ms_desc;
                    intro = details.ms_intro;
                    keyword = details.ms_tags;
                    
                  }else if(i===2){
                    refDoc = "/knowledge_type_zh/"+subcategoryArr.replace(":", "/knowledge_type_zh/")+"/knowledge_zh/";
                    title = details.zh_title;
                    content = details.zh_desc;
                    intro = details.zh_intro;
                    keyword = details.zh_tags;
                  }else{
                    refDoc = "/knowledge_type_ta/"+subcategoryArr.replace(":", "/knowledge_type_ta/")+"/knowledge_ta/";
                    title = details.ta_title;
                    content = details.ta_desc;
                    intro = details.ta_intro;
                    keyword = details.ta_tags;
                  }
                  
                  
                  let ref = db.collection(refDoc).doc(docId);   
              
              dataSet = {    
                        "_v" : 5,
                        "_typeIds":subCat,
                        image : details.icon_img_url,
                        imageURL :details.icon_storage_url,
                        title : title,
                        content : content,
                        intro : intro,
                        keyword : keyword,
                        order : 0,//details.ar_order,
                        publish : details.publish,
                        rel : details.ar_rel,
                        stage : details.ar_type,
                        campaign_id : details.ar_campaign_id,
                        typeIds:subcategoryArr ,
                        rev_comments:details.comments,
                        createdAt:timestamp,
                        videoURL:details.videoURL,
                        locality:details.locality                        
                    };
                    ref.set(dataSet);
                  
                  
                  
                
                }
                
            });
            
            

             response.send({data:{status:true,details:refDoc } });
                return;  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });  
  
  
  
 exports.setCampaignDetails = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data;      
             response.send({data:{status:true,details:details } });
                return;  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 exports.getArticleCatList = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        let db = admin.firestore();
        var details = [];
        await db
          .collectionGroup("knowledge_type")
          .orderBy("createdAt", "desc")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var dete = doc.data();
              details.push([
                doc.id,
                dete["name"],
                dete["name_en"],
                dete["name_ms"],
                dete["name_zh"],
                dete["publish"]
              ]);
            });
            response.send({
              status: true,
              data: details,
              msg: "Article Category listed Successfully!"
            });
            return true;
          })
          .catch(error => {
            response.send({
              data: {
                status: false,
                message: "No data in Article Category list. ",
                error: error
              }
            });
            return false;
          });
        return true;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
 exports.importSampleData = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody); 
        
       
        let db = admin.firestore();
         var details = rawBody.data.data;
        var col = rawBody.data.col;

        //response.send({data:{status:true,dataSet:details,col:col,msg: "sucess"} });
        await db.collection(col).doc().set(details).then(function() {
            
            console.log("Document successfully written!");
            response.send({
              status: true,
              data: col,
              msg: "MileStones Inserted Successfully"
            });

            return "";
          }).catch(error => {
            response.send("Error", error);
            return {
              msg: "error"
            };
          });

        return {
          msg: "Hello from Firebase!"
        };
      });
    } catch (error) {
      response.send("Error", error);
      return {
        msg: "error"
      };
    }
  });
  
  exports.eventsOnCreate = functions.region('asia-northeast1').firestore
  .document("events/{events}")
  .onCreate((snap, context) => {
    timestamp = admin.firestore.Timestamp.now();
    const newValue = {createdAt : timestamp};    
    db.doc("events/" + snap.id + "/").update(newValue); 
     
    return true;
  });
  
  exports.eventsOnUpdate = functions.region('asia-northeast1').firestore
  .document("events/{events}")
  .onUpdate((snap, context) => {
    timestamp = admin.firestore.Timestamp.now();
    const newValue = {updatedAt : timestamp};    
    db.doc("events/" + snap.id + "/").update(newValue); 
     
    return true;
  });
  
  const db = admin.firestore();
  exports.toolsCreateData = functions.region('asia-northeast1').firestore
  .document("tools/{toolsId}")
  .onCreate((snap, context) => {
    timestamp = admin.firestore.Timestamp.now();
    const newValue = {createdAt : timestamp};    
    db.doc("tools/" + snap.id + "/").update(newValue); 
     
    return true;
  });
 exports.eventPoints = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
          var body = JSON.parse(request.rawBody);
          let db = admin.firestore();
          var docData = body.data; 
          var col = docData.col;
          var dete = [];//"eventsPoints"
         
          await db.collection(col).where("status","==",true).get().then(snapshot => {
           snapshot.forEach((docx) => {
               det = docx.data();
             //  console.log(d.dailyLogin);
              /* if(d.dailyLogin != "" && d.dailyLogin != undefined ){
                   dL = d.dailyLogin;
                   console.log("dl",dL);
               }
               if(d.profileCompletion != "" && d.profileCompletion != undefined ){
                   pC = d.profileCompletion;
                   console.log("pC",pC);
               }
               if(d.referencePoint != "" && d.referencePoint != undefined ){
                   rP = d.referencePoint;
                   console.log("rP",rP);
               }
                res = {dailyLogin:dL,referencePoint:rP,profileCompletion:pC}*/
                var name = det.name;
                var point = det.point;
                dete.push([name,point]);  
                 
          }); 
          
          
          var ar = [];
          for(var i =0;i<dete.length;i++){
              ar[dete[i][0]] = dete[i][1];             
          }
          
          var details = JSON.stringify(Object.assign({}, ar));
           var finalData = JSON.parse(details);
            response.send({data:{status:true,details :finalData} });
          return;
        }).catch(reason => {
          response.send({
            error: reason
          });
        });
          
            
            

        return {msg: "Hello from Firebase!"};
      });
    } catch (error) {
      response.send("Error", error);
      return {
        msg: "error"
      };
    }
  });
  exports.importChildMileStonesData = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        var body = JSON.parse(request.rawBody);
        console.log(body);
        let db = admin.firestore();
        var docData = body.data;

        await db
          .collection("childMileStones")
          .doc()
          .set(docData)
          .then(function() {
            console.log("Document successfully written!");
            response.send({
              status: true,
              data: true,
              msg: "MileStones Inserted Successfully"
            });

            return "";
          })
          .catch(error => {
            response.send("Error", error);
            return {
              msg: "error"
            };
          });

        return {
          msg: "Hello from Firebase!"
        };
      });
    } catch (error) {
      response.send("Error", error);
      return {
        msg: "error"
      };
    }
  });
  exports.setChildMileStones = functions.region('asia-northeast1').https.onRequest((request, response) => {
  try {
    return cors(request, response, async () => {
      var rawBody = JSON.parse(request.rawBody);
      var details = rawBody.data;

      let db = admin.firestore();
      let ref = db.collection("childMileStones").doc();
      var id = ref.id;
      await db
        .collection("childMileStones")
        .doc()
        .set(details)
        .then(function() {
          console.log("Document successfully written!");
          response.send({
            data: { status: true, id: id, msg: "Doc inserted successfully!" }
          });
          return { msg: "Doc inserted successfully!" };
        })
        .catch(error => {
          response.send("Error", error);
          return { msg: "error" };
        });

      console.log("Document successfully written!");

      response.send({ data: { status: true, dataSet: details.category } });
      return;
    });
  } catch (error) {
    console.log(error);
    response.send({ data: { status: false } });
    return;
  }
});

exports.childMileStonesOnCreate = functions
  .region("asia-northeast1")
  .firestore.document("childMileStones/{childMileStonesId}")
  .onCreate((snap, context) => {
    const newValue = snap.data();
    
    for (var i = 0; i < 4; i++) {
      let title = "";
      let content = "";
      let keywords = "";
      let dbs = "";
      if (i === 0) {
        title = newValue.en_title;
        content = newValue.en_content;
        keywords = newValue.en_keywords;
        dbs = "childMileStones_en/";
      } else if (i === 1) {
        title = newValue.ms_title;
        content = newValue.ms_content;
        keywords = newValue.ms_keywords;
        dbs = "childMileStones_ms/";
      } else if (i === 2) {
        title = newValue.zh_title;
        content = newValue.zh_content;
        keywords = newValue.zh_keywords;
        dbs = "childMileStones_zh/";
      } else {
        title = newValue.ta_title;
        content = newValue.ta_content;
        keywords = newValue.ta_keywords;
        dbs = "childMileStones_ta/";
      }var timestamp = admin.firestore.Timestamp.now();  
      var dataObj = {
        title: title,
        content: content,
        keywords: keywords,
        months: newValue.months,
        days: newValue.days,
        publish: newValue.publish,
        weeks: newValue.weeks,
        view: newValue.view,
        length: newValue.length,
        weight: newValue.weight,
        image: newValue.image,
        imageUrl: newValue.imageUrl,
        createdAt: timestamp
      };
      db.doc(dbs + snap.id + "/").set(dataObj);
    }
    //db.doc("childMileStones_en/" + snap.id + "/").set(newValue);
    // db.doc("childMileStones_ms/" + snap.id + "/").set(newValue);
    // db.doc("childMileStones_zh/" + snap.id + "/").set(newValue);
    // db.doc("childMileStones_ta/" + snap.id + "/").set(newValue);
    return true;
  });
exports.childMileStonesOnUpdate = functions
  .region("asia-northeast1")
  .firestore.document("childMileStones/{childMileStonesId}")
  .onUpdate((snap, context) => {
    const newValue = snap.after.data();
    var uid = context.params.childMileStonesId; 
    for (var i = 0; i < 4; i++) {
      let title = "";
      let content = "";
      let keywords = "";
      var timestamp = admin.firestore.Timestamp.now();  
      let dbs = "";
      if (i === 0) {
        title = newValue.en_title;
        content = newValue.en_content;
        keywords = newValue.en_keywords;
        dbs = "/childMileStones_en/";
      } else if (i === 1) {
        title = newValue.ms_title;
        content = newValue.ms_content;
        keywords = newValue.ms_keywords;
        dbs = "/childMileStones_ms/";
      } else if (i === 2) {
        title = newValue.zh_title;
        content = newValue.zh_content;
        keywords = newValue.zh_keywords;
        dbs = "/childMileStones_zh/";
      } else {
        title = newValue.ta_title;
        content = newValue.ta_content;
        keywords = newValue.ta_keywords;
        dbs = "/childMileStones_ta/";
      }
      //console.log("Document Update!" , i);
    
    //console.log(newValue.length);
    //console.log(newValue.weight);
      var dataObj = {
        title: title,
        content: content,
        keywords: keywords,
        months: newValue.months,
        days: newValue.days,
        publish: newValue.publish,
        weeks: newValue.weeks,
        view: newValue.view,
        length: newValue.length,
        weight: newValue.weight,
        image: newValue.image,
        imageUrl: newValue.imageUrl,
        updatedAt: timestamp
      };
      db.doc(dbs + uid + "/").set(dataObj);
      
    }
    // db.doc("childMileStones_en/" + snap.id + "/").set(newValue);
    // db.doc("childMileStones_ms/" + snap.id + "/").set(newValue);
    // db.doc("childMileStones_zh/" + snap.id + "/").set(newValue);
    // db.doc("childMileStones_ta/" + snap.id + "/").set(newValue);
    return true;
  });
  exports.getChildMileStones = functions.region('asia-northeast1').https.onRequest((request, response) => {
  try {
    //collection
    return cors(request, response, async () => {
      var db = admin.firestore();
      let data = request.body;
      var limit = parseInt(data.length);
      var offset = parseInt(data.start);
      const datas = [];
      var size = 0;
      await db.collection("childMileStones").get().then(snapshot => {
          snapshot.forEach(doc => {
            size = snapshot.size;
          });
          return;
        })
        .catch(reason => {
          response.send({
            error: reason
          });
        });
        if(limit === -1){            
            limit = size;
        }
        var search = "";
        if(data.search){console.log(data.search);
          search = data.search.value;
        }
       
      var keywords = [];
      if (search !== "") {  
           keywords = search.split(" ");
           console.log("search Key word ",keywords);
      } 
      var en_title = "";var ms_title = "";
            var tn_title = "";var zh_title = "";var ge_title = "";var en_content = "";
            var ms_content = "";var tn_content = ""; var zh_content = ""; var ge_content = "";
            var en_keywords = "";var zh_keywords = ""; var ms_keywords = ""; var tn_keywords = "";
            var ge_keywords = ""; var days = "";  var weeks = ""; var months = ""; var length = "";
            var weight = "";  var publish = ""; var image = ""; var imageUrl = "";
            if (search === "") { 
      await db.collection("childMileStones").orderBy('weeks').offset(offset).limit(limit).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var det = doc.data();
            
             if (det.en_title) {en_title = det.en_title;}
            if (det.ms_title) { ms_title = det.ms_title; }
            if (det.tn_title) { tn_title = det.tn_title; }
            if (det.zh_title) { zh_title = det.zh_title; }
            if (det.ge_title) { ge_title = det.ge_title; }
            if (det.en_content) { en_content = det.en_content; }
            if (det.ms_content) { ms_content = det.ms_content; }
            if (det.tn_content) { tn_content = det.tn_content; }
            if (det.zh_content) { zh_content = det.zh_content; }
            if (det.ge_content) { ge_content = det.ge_content; }
            if (det.en_keywords) { en_keywords = det.en_keywords; }
            if (det.zh_keywords) { zh_keywords = det.zh_keywords; }
            if (det.ms_keywords) { ms_keywords = det.ms_keywords; }
            if (det.tn_keywords) { tn_keywords = det.tn_keywords; }
            if (det.ge_keywords) { ge_keywords = det.ge_keywords; }
            if (det.publish) { publish = det.publish; }
            var weeks = days = months = 0 ;
            if (det.weeks) { weeks = det.weeks; } if (det.days) { days = det.days; } if (det.months) { months = det.months; }
            if (det.length) { length = det.length; }  if (det.weight) { weight = det.weight; } if (det.image) { image = det.image; }
            if (det.imageUrl) {  imageUrl = det.imageUrl; }
            var view = det.view;
            if (view === 0 ) {  view = "Daily"; }
            if (view === 1 ) {  view = "Weekly"; }
            if (view === 2 ) {  view = "Monthly"; }
            var outElement = { id: doc.id, en_title: en_title, ms_title: ms_title, tn_title: tn_title,
              zh_title: zh_title, ge_title: ge_title, en_content: en_content, ms_content: ms_content, tn_content: tn_content,
              zh_content: zh_content, ge_content: ge_content, en_keywords: en_keywords, zh_keywords: zh_keywords, ms_keywords: ms_keywords,
              tn_keywords: tn_keywords, ge_keywords: ge_keywords, days: days,weeks: weeks, months: months, length: length, weight: weight, 
              publish: publish, image: image, imageUrl: imageUrl,view : view 
            };
            datas.push(outElement);
          });
          response.send({
            status: true, 
            aaData: datas,
            iTotalRecords: size,
            iTotalDisplayRecords: size,
            msg: "Hello from Firebase!"
          });
          return;
        }).catch(function(error) {
          response.send({ error: error, status: "false could not found" });
        });
      return { msg: "Hello from Firebase!" };
      
      
        }else{
            
            /*****************Search key*********************/
            
            const p11 = db.collection("childMileStones").where("en_title", "=" , search).orderBy('weeks');
            const p12 = db.collection("childMileStones").where("ms_title", "=" , search).orderBy('weeks');
            const p13 = db.collection("childMileStones").where("tn_title", "=" , search).orderBy('weeks');
            const p14 = db.collection("childMileStones").where("zh_title", "=" , search).orderBy('weeks');
            const p15 = db.collection("childMileStones").where("ge_title", "=" , search).orderBy('weeks');
            return Promise.all([p11.get(), p12.get(), p13.get(), p14.get(), p14.get()]).then(res => {
                            res.forEach(r => {
                              r.forEach(doc => {
            
            
             //await db.collection("childMileStones").offset(offset).limit(limit).get().then(function(querySnapshot) {
          //querySnapshot.forEach(function(doc) {
            var det = doc.data();
            
             if (det.en_title) {en_title = det.en_title;}
            if (det.ms_title) { ms_title = det.ms_title; }
            if (det.tn_title) { tn_title = det.tn_title; }
            if (det.zh_title) { zh_title = det.zh_title; }
            if (det.ge_title) { ge_title = det.ge_title; }
            if (det.en_content) { en_content = det.en_content; }
            if (det.ms_content) { ms_content = det.ms_content; }
            if (det.tn_content) { tn_content = det.tn_content; }
            if (det.zh_content) { zh_content = det.zh_content; }
            if (det.ge_content) { ge_content = det.ge_content; }
            if (det.en_keywords) { en_keywords = det.en_keywords; }
            if (det.zh_keywords) { zh_keywords = det.zh_keywords; }
            if (det.ms_keywords) { ms_keywords = det.ms_keywords; }
            if (det.tn_keywords) { tn_keywords = det.tn_keywords; }
            if (det.ge_keywords) { ge_keywords = det.ge_keywords; }
            if (det.publish) { publish = det.publish; }
            if (det.weeks) { weeks = det.weeks; } if (det.days) { days = det.days; } if (det.months) { months = det.months; }
            if (det.length) { length = det.length; }  if (det.weight) { weight = det.weight; } if (det.image) { image = det.image; }
            if (det.imageUrl) {  imageUrl = det.imageUrl; }
            var outElement = { id: doc.id, en_title: en_title, ms_title: ms_title, tn_title: tn_title,
              zh_title: zh_title, ge_title: ge_title, en_content: en_content, ms_content: ms_content, tn_content: tn_content,
              zh_content: zh_content, ge_content: ge_content, en_keywords: en_keywords, zh_keywords: zh_keywords, ms_keywords: ms_keywords,
              tn_keywords: tn_keywords, ge_keywords: ge_keywords, days: days,weeks: weeks, months: months, length: length, weight: weight, 
              publish: publish, image: image, imageUrl: imageUrl/**/
            };
            datas.push(outElement);
          });
      });
          response.send({
            status: true, 
            aaData: datas,
            iTotalRecords: size,
            iTotalDisplayRecords: size,
            msg: "Hello from Firebase!"
          });
          return;
        }).catch(function(error) {
          response.send({ error: error, status: "false could not found" });
        });
      //return { msg: "Hello from Firebase!" };
      
      
        
      
        }
      
      
      
      
    });
  } catch (error) {
    response.send("Error", error);
  }
});

exports.setpush = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody);
            let dataSet = rawBody.data;
            var Message = dataSet.message;
           // var timestamp = admin.firestore.Timestamp.fromDate(date)
                //let db = admin.firestore();
                console.log(dataSet);
             response.send({data:{status:true,dataSet:dataSet,Message:Message} });
                return;
        });
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });

exports.updateChildMileStones = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        var details = rawBody.data.dataSet;
        let uid = rawBody.data.uid;
        let db = admin.firestore();
        await db.collection("childMileStones").doc(uid).update(details).then(function() {
            console.log("Document Updated successfully!");
            response.send({
              data: { status: true, msg: "Doc updated successfully!" }
            });
            return { msg: "Doc updated successfully!" };
          }).catch(error => {
            response.send("Error", error);
            return { msg: "error" };
          });
      });
    } catch (error) {
      console.log(error);
      response.send({ data: { status: false } });
      return;
    }
  });
  exports.setUserTest = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
             
            let dataSet = rawBody.data.dataSet; 
            let uid = rawBody.data.uid ;
            var date = "";
            var timestamp = null; 
            
            if(dataSet.uid){
                delete dataSet.uid;
            }
              
            if(dataSet.expected !== ""){
                date = new Date(dataSet.expected);
                timestamp = admin.firestore.Timestamp.fromDate(date);
            } 
            if(dataSet.expected === null){                
                timestamp = null;
            } 
            if(timestamp === ""){
                timestamp = null; 
            }
            if(date === ""){
                timestamp = null; 
            }
            
            
                let db = admin.firestore();                         
            //Firestore.instance.collection("user").document(id).updateData(data);
                await db.collection("user").doc(uid).update(dataSet).then(function() {
                    if(date !== ""){
                        db.collection("user").doc(uid).update({
                            userName:dataSet.displayName,
                            expected : timestamp
                        }).then(function() {   
                            console.log("Document successfully written!");
                         response.send({data:{status:true,msg:"Doc updated successfully!"}});
                         return {msg:"Doc updated successfully!"};
                        }).catch(function(error) {
                            // The document probably doesn't exist.
                            console.error({status:true,data:false, msg :error});
                            return true;
                        });
                    }else{
                        console.log("Document successfully written!");
                         response.send({data:{status:true,msg:"Doc updated successfully!"}});
                         return {msg:"Doc updated successfully!"};
                    }
                    
                    
                         return {msg:"Doc updated successfully!"};
                }).catch(error =>{
                    response.send({data:{"Error":error}});
                    return {msg:"error"};
               })
                

             response.send({data:{status:true,dataSet:dataSet} });
                return;  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
});
exports.testLike = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var data = [];
            let db = admin.firestore();
            
            let docRef = db.collection('user').doc('userName');
            return docRef.get().then(snapshot => {
              let startAtSnapshot = db.collection('user')
                .orderBy('userName')
                .startAt('Guest');
        

              data.push(startAtSnapshot.limit(10).get());
               response.send({data:{status:true,details:data} });
                    return true;
            }).catch (error => {
                response.send({data:{"status":false, "message":"user not authenticated.!"}});
                return true;
            });
            /*
            //await db.collection("user").where("isDeviceToken","==",true).get().then(snapshot => {
            let node = await db.collections("user").where("isDeviceToken","==",true).startAt('Guest').endAt('t\uf8ff').once('value').then(snapshot => {
                //snapshot.forEach((doc) => {
                    data.push(snapshot.val());
                    //data.push(doc.data());
               // });
                //if(snapshot.size===0){
                //    response.send({data:{status:false, message:"user not authenticated.!"} });
                //    return true;
               // }else{
                    response.send({data:{status:true,details:data} });
                    return true;
                //}
            }).catch (error => {
                response.send({data:{"status":false, "message":"user not authenticated.!"}});
                return true;
            });*/
        });
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
 
 exports.getArticleListTest = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        let db = admin.firestore();
        var details = [];/* .collection("knowledge")
.where("publishHome", "in", [true, false]) .where("publishHome","in",[true, false])*/
            var i =0;
        await db.collectionGroup("knowledge").orderBy("createdAt", "desc").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var dete = doc.data();
              var ty = dete._typeIds;
              var ty1 = dete.typeIds;
              var uid = doc.id;
                
              console.log(uid);
              if(ty[0] === 'lQcP2DHPppqsbvr9ziae'){
                  details.push([uid]);
                  
              }
             /* var timestamp = admin.firestore.Timestamp.now();  
              if(ty1 === 'lQcP2DHPppqsbvr9ziae:mUnnT5YB70QGfVwyu5cu'){
                console.log(dete.title);
                 //i++;
                doc.ref.update({
                    typeIds : ty[0]+":"+ty[1],
                    updatedAt : timestamp
                }).then(function() {   
                    console.log("Document successfully written!");
                    //response.send({data:{status:true,msg:"Doc updated successfully!"}});
                    //return {msg:"Doc updated successfully!"};
                }).catch(function(error) {
                        // The document probably doesn't exist.
                    console.error({status:true,data:false, msg :error});
                    return true;
                });
            }
               
               
              */
              
              
            });
            response.send({
              status: true,
              data: details,detailsSize : details.length,
              msg: "Article listed Successfully!"
            });
            // response.send({ data: { status: true, details: details } });
            return true;
          })
          .catch(error => {
            response.send({
              data: {
                status: false,
                message: "No data in Article list. ",
                error: error
              }
            });
            return false;
          }); /* */
        //response.send({data:{status:true,collection:collection}});
        return true;
        // return false;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
 
 
 
 
 exports.getArticleList = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        let db = admin.firestore();
        var details = [];
        await db.collectionGroup("knowledge").orderBy("createdAt", "desc").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var dete = doc.data();
      //functions.logger.log(dete);
      console.log(dete);
              var createdAt = "";
               var createdAtDT = typeof(dete.createdAt);
                if(createdAtDT!=="undefined"){
                    if(createdAtDT === "object"){
                        var createdAtObj = (dete.createdAt);
                        if(createdAtObj !== null){
                            createdAt = format('dd-MM-yyyy hh:mm:ss', new Date(createdAtObj['_seconds'] * 1000));
                        }
                    }
                    if(createdAtDT === 'string'){
                        createdAt = (dete.createdAt);
                    } 
               }
               
               var updatedAt = "";
               var updatedAtDT = typeof(dete.updatedAt);
                if(updatedAtDT!=="undefined"){
                    if(updatedAtDT === "object"){
                        var updatedAtObj = (dete.updatedAt);
                        if(updatedAtObj !== null){
                            updatedAt = format('dd-MM-yyyy hh:mm:ss', new Date(updatedAtObj['_seconds'] * 1000));
                        }
                    }
                    if(updatedAtDT === 'string'){
                        updatedAt = dete.updatedAt;
                    } 
               }
            var stage = "Pregnancy";
            var stageDT = typeof(dete.stage);
            if(stageDT!=="undefined"){
                if(dete.stage === 0){
                    stage = "Planning";
                }else if(dete.stage === 1){
                    stage = "Pregnancy";
                }else{
                    stage = "Post Pregnancy";
                }
            }
            var rel = "Both";
            var relDT = typeof(dete.rel);
            if(relDT!=="undefined"){
                if(dete.rel === 0){
                    rel = "Both";
                }else if(dete.rel === 1){
                    rel = "Mom";
                }else{
                    rel = "Dad";
                }
            }
      
      
              details.push([
                  '<a href="editArticle?key='+doc.id+'&typeIds='+dete.typeIds+'" style="color:#7571f9;">'+doc.id+'</a>',
                dete["title"],
                dete["title_en"],
                dete["title_ms"],
                dete["title_zh"], /*
                dete["content"],
                dete["content_en"],
                dete["content_ms"],
                dete["content_zh"], */
                dete["intro"],
                dete["intro_en"],
                dete["intro_ms"],
                dete["intro_zh"], 
                dete["keyword"],
                dete["keyword_en"],
                dete["keyword_ms"],
                dete["keyword_zh"], 
                stage,
                dete["publishHome"],
                dete["publish"],
                rel,
                createdAt,
                updatedAt
              ]);
            });
            response.send({
              status: true,
              data: details,
              msg: "Article listed Successfully!"
            });
            // response.send({ data: { status: true, details: details } });
            return true;
          })
          .catch(error => {
            response.send({
              data: {
                status: false,
                message: "No data in Article list. ",
                error: error
              }
            });
            return false;
          }); /* */
        //response.send({data:{status:true,collection:collection}});
        return true;
        // return false;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
  
 exports.getUserDashboardFullData = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        let db = admin.firestore();
       //var details = [];
        var userDetails = [];
        var monthShortNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
        await db.collection("user").get().then((snapshot) => {
            snapshot.forEach((doc) => {
              var createdAtDT = doc.data().createdAt;
              var t = new Date(createdAtDT["seconds"] * 1000);
              var datee =
                t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
              var m_datee =
                monthShortNames[t.getMonth()] + "-" + t.getFullYear();
              userDetails.push({
                id: doc.id,
                country: doc.data().country,
                date: datee,
                m_date: m_datee,
                stage: doc.data().stage,
                gender: doc.data().gender,
                lang: doc.data().lang,
                status: doc.data().status,
              });
            });
            response.send({
              status: true,
              userDetails: userDetails,
              msg: "Data Listed Successfully",
            });
        return true;
             
          }).catch((reason) => {
            response.send({ error: reason });
            return false;
          });
          
        // return false;
      })
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
exports.getUserDashboardRangeData = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        let fromDate = new Date(rawBody.data.fromDate);
        let toDate = new Date(rawBody.data.toDate);
        let db = admin.firestore();
        var userDetails = [];
        var monthShortNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        await db
          .collection("user")
          .where("createdAt", ">=", fromDate)
          .where("createdAt", "<=", toDate)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              var createdAtDT = doc.data().createdAt;
              var t = new Date(createdAtDT["seconds"] * 1000);
              var datee =
                t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
              var m_datee =
                monthShortNames[t.getMonth()] + "-" + t.getFullYear();
              userDetails.push({
                id: doc.id,
                country: doc.data().country,
                date: datee,
                m_date: m_datee,
                stage: doc.data().stage,
                gender: doc.data().gender,
                lang: doc.data().lang,
                status: doc.data().status,
              });
            });
            return;
          })
          .catch((reason) => {
            response.send({ error: reason });
          });
        console.log("User details fetched written!");
        response.send({ data: { status: true, dataSet: details.category } });
        return;
      });
    } catch (error) {
      console.log(error);
      response.send({ data: { status: false } });
      return;
    }
  });
  
  
exports.loadusers = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var data = [];
            let db = admin.firestore();
            await db.collection("user").where("isDeviceToken","==",true).where("status","==","active").get().then(snapshot => {
                snapshot.forEach((doc) => {
                    data.push(doc.data());
                });
                if(snapshot.size===0){
                    response.send({data:{status:false, message:"user not authenticated.!"} });
                    return true;
                }else{
                    response.send({data:{status:true,details:data} });
                    return true;
                }
            }).catch (error => {
                response.send({data:{"status":false, "message":"user not authenticated.!"}});
                return true;
            });
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });
exports.setUserTestDetails = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
             
            let dataSet = rawBody.data;  
            let test_email = rawBody.data.email; 
            var auth = admin.auth();
            var emailAddress = test_email;
            
            const Employee = {
                firstname: 'John',
                lastname: 'Doe'
              }

              console.log(Employee.firstname);
              // expected output: "John"

              delete Employee.firstname;

              console.log(Employee.firstname);
response.send({data:{status:true,msg:"Doc updated successfully!",dataSet:dataSet}});
                console.log('email sent!');
            return {msg:"Doc updated successfully!"}; 
            /*app.auth().sendPasswordResetEmail(test_email).then((user) => {
                response.send({data:{status:true,msg:"Doc updated successfully!",dataSet:dataSet}});
                console.log('email sent!',user);
            return {msg:"Doc updated successfully!"};  
                 
              }).catch(function(error) {
                // An error happened.
                console.log('email error!',error);
                return;
              });*/
            
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
});

exports.setUserUpdate = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
             
            let dataSet = rawBody.data.dataSet; 
            let uid = rawBody.data.uid ;
            
            var date = new Date(dataSet.expected);
            var timestamp = admin.firestore.Timestamp.fromDate(date);
            let db = admin.firestore();                         
            await db.collection("user").doc(uid).update(dataSet).then(function() {                    
               /**/ 
               db.collection("user").doc(uid).update({
                    expected : timestamp
                }).then(function() {   
                    console.log("Document successfully written!");
                    response.send({data:{status:true,msg:"Doc updated successfully!"}});
                    return {msg:"Doc updated successfully!"};
                }).catch(function(error) {
                        // The document probably doesn't exist.
                    console.error({status:true,data:false, msg :error});
                    return true;
                });
                console.log("Document successfully written!");
                response.send({data:{status:true,msg:"Doc updated successfully!",timestamp:timestamp}});
                    
                return {msg:"Doc updated successfully!"};
                }).catch(error =>{
                    response.send({data:{"Error":error}});
                    return {msg:"error"};
                })/*  */
                response.send({data:{status:true,dataSet:dataSet,uid:uid} });
                return;  
            })
        }catch(error){
            console.log(error);
            response.send({data:{status:false} });
            return;
        }
 });
exports.setCatListTest = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data; 
            let dataSet = {                
                "-v" : 5,
                "_parents":[details.ar_subcat],
                image : details.imageUrl,
                imageURL :details.image,
                imageBanner: details.imageBannerUrl, 
                imageBannerURL: details.imageBanner,
                level : details.ar_level,
                name : details.ge_title,
                name_en : details.en_title,
                name_ms : details.ms_title,
                name_ta : details.tn_title,
                name_zh : details.zh_title,
                parents : details.ar_subcat,
                order : details.ar_order,
                publish : details.ar_publish,
                rel : details.ar_rel,
                periods : details.ar_type
            }
                let db = admin.firestore(); 
                let ref = db.collection("test").doc();
                var id = ref.id ; 
            
            
               
               if(details.ar_subcat === ""){
                await db.collection("test").doc(id).set(dataSet).then(function() {
                    console.log("Document successfully written!");
                     response.send({data:{status:true,id:id,msg:"Doc updated successfully!"}});
                         return {msg:"Doc updated successfully!"};
                }).catch(error =>{
                    response.send("Error",error);
                    return {msg:"error"};
               })
               }else{
                   await db.collection("test").doc(details.ar_subcat).collection("test").doc(id).set(dataSet).then(function() {
                        console.log("Document successfully written!");
                         response.send({data:{status:true,id:id,msg:"Doc updated successfully!"}});
                             return {msg:"Doc updated successfully!"};
                    }).catch(error =>{
                        response.send("Error",error);
                        return {msg:"error"};
                   })
                }

             response.send({data:{status:true,dataSet:dataSet} });
                return;  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });//changeStatus
 exports.changeUserStaus = functions.region('asia-northeast1').https.onRequest((request, response) => {
     
    try{//collection
        return cors(request, response, async () => {   
            var body =  JSON.parse(request.rawBody); 
            var data = body.data;
            
            var uid = data.uid;
            var status = data.status;
            console.log(uid,status);
            let db = admin.firestore();
            await db.collection("user").doc(uid).update({
                        status: status
                    }).then(function() {   
                        response.send({status:true,data:true, msg :body});
                         return {msg:"Doc updated successfully!"};
                    }).catch(function(error) {
                        // The document probably doesn't exist.
                        console.error({status:true,data:false, msg :error});
                        return true;
                    });
            
            response.send({data:{status:true,details:data} });
            
                return true;
            })
    }catch(error){
         response.send("Error",error);
         return false;
    }
     
     
    
});
 //changeStatus
 exports.changeToolsStaus = functions.region('asia-northeast1').https.onRequest((request, response) => {
     
    try{//collection
        return cors(request, response, async () => {   
            var body =  JSON.parse(request.rawBody); 
            var data = body.data; 
            var doc = data.doc;
            var status = data.status; 
            let db = admin.firestore();
            await db.collection("tools").doc(doc).update({
                        visiable: status
                    }).then(function() {   
                        response.send({data:{status:true,details:body, msg :"sucess"}});
                         return {msg:"Doc updated successfully!"};
                    }).catch(function(error) {
                        // The document probably doesn't exist.
                        console.error({status:true,data:false, msg :error});
                        response.send({data:{status:false,error:error, msg :"failed"}});
                        return true;
                    });
             
            
                return true;
            })
    }catch(error){
         response.send("Error",error);
         return false;
    }
     
     
    
});
 exports.getInfoList = functions.region('asia-northeast1').https.onRequest((request, response) => {     
    try{
        return cors(request, response, async () => {   
            var body =  JSON.parse(request.rawBody); 
            response.send({"status":true, "message":"list. "});     return true;
        }).catch (error => { 
              response.send({data:{"status":false, "message":"No data in Article list. "}});         
              return false;
        });
             
          
    }catch(error){
         response.send("Error",error);
         return false;
    }
});
 exports.getList = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
       // var body = JSON.parse(request.rawBody);
        let db = admin.firestore();
        let data = request.body;
        var limit = parseInt(data.length);
        var offset = parseInt(data.start);
        var size = 0;
        var details = []; //.limit(3).where("email" , "==" , email )
       // var collection = body.data.col;
        var i = 0;
        
        var search = "";
        if(data.search.value){
          search = data.search.value;
        }

        var keywords = [];
        if (search !== "") {  
             keywords = search.split(" ");
         }
        
        await db.collection("knowledge_type").get().then(snapshot => {
            snapshot.forEach(doc => {
              size = snapshot.size;
            });
            return;
          }).catch(reason => {
            response.send({error: reason});
          });
          if(limit === -1){
                limit = size;
            }
        //await db.collection(collection).get().then(snapshot => {//.limit(3).orderBy('createdAt', 'desc')
        await db.collection("knowledge_type").orderBy("createdAt", "desc").offset(offset).limit(limit).get().then(snapshot => {
            snapshot.forEach(doc => {
              i++;
              var dete = doc.data();
              //var createdAt = dete['createdAt'].toDate();
              var relative = dete["rel"];
              if (relative === 0) {
                relative = "Both";
              } else if (relative === 1) {
                relative = "Mom";
              } else {
                relative = "Dad";
              }
              var periods = "";
              var periodsData = {"1": "Early Pregnancy","2": "Mid Pregnancy","3": "Late Pregnancy","7": "My Body","8": "Breastfeeding","9": "Medicine in Pregnancy","10": "Medical Conditions","11": "Common Questions","12": "Postnatal","14": "Childcare","13": "Pre-Pregnancy","15": "All about Fertility"};
              periods = periodsData[dete["periods"][0]];
              details.push([
                doc.id,dete["name"], dete["name_en"],dete["name_ms"],
                dete["name_zh"],relative,dete["imageURL"] ,"",periods,dete["level"]
              ]);
            });
            response.send({
              status: true,
              aaData: details,
              iTotalRecords: size,
              iTotalDisplayRecords: size,
              msg: "Hello from Firebase!"
            });
            // response.send({ data: { status: true, details: details } });
            return true;
          }).catch(error => {
            response.send({
              data: { status: false, message: "No data in Article list. " }
            });
            return false;
          }); 
          
        return true;
        
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  
 });
 exports.getCampaignList = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
       // var body = JSON.parse(request.rawBody);
        let db = admin.firestore();
        let data = request.body;
        var limit = parseInt(data.length);
        var offset = parseInt(data.start);
        var size = 0;
        var details = []; 
        var i = 0;
        
        var search = "";
        if(data.search.value){
          search = data.search.value;
        }

        var keywords = [];
        if (search !== "") {  
             keywords = search.split(" ");
         }
        
        await db.collection("campaign").get().then(snapshot => {
            snapshot.forEach(doc => {
              size = snapshot.size;
            });
            return;
          }).catch(reason => {
            response.send({error: reason});
          });
          if(limit === -1){
                limit = size;
            }
            
        await db.collection("campaign").orderBy("createdOn", "desc").offset(offset).limit(limit).get().then(snapshot => {
            snapshot.forEach(doc => {
              i++;
              var dete = doc.data();
              //var createdAt = dete['createdAt'].toDate();
              var relative = dete["rel"];
              if (relative === 0) {
                relative = "Both";
              } else if (relative === 1) {
                relative = "Mom";
              } else {
                relative = "Dad";
              }
              var periods = "";
              periods = dete["stage"][0];
              if (periods === "0") {
                periods = "Pre Pregnancy";
              } else if (periods === "1") {
                periods = "Pregnancy";
              }else if (periods === "2") {
                periods = "Post Pregnancy";
              } else {
                periods = "ALL";
              }
              var link = "-";
              var idDT1 = typeof(dete["link"]);
                if(idDT1 !== "undefined" && dete["link"] !== null){
                    if(dete["link"] !== ""){
                        link = dete["link"] ;
                    }
                }
              
              
              details.push([
                doc.id,dete["title"], dete["title_en"],dete["title_ms"],
                dete["title_zh"],relative,periods,dete["status"],link
              ]);
            });
            response.send({
              status: true,
              aaData: details,
              iTotalRecords: size,
              iTotalDisplayRecords: size,
              msg: "Hello from Firebase!"
            });
            // response.send({ data: { status: true, details: details } });
            return true;
          }).catch(error => {
            response.send({
              data: { status: false, message: "No data in Article list. " }
            });
            return false;
          }); 
          
        return true;
        
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  
 });
exports.getfathersDayList = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
       // var body = JSON.parse(request.rawBody);
        let db = admin.firestore();
        let data = request.body;
        var limit = parseInt(data.length);
        var offset = parseInt(data.start);
        var size = 0;
        var details = []; 
        var i = 0;
        
        var search = "";
        if(data.search.value){
          search = data.search.value;
        }

        var keywords = [];
        if (search !== "") {  
             keywords = search.split(" ");
         }
        
        await db.collection("fatherDayInfo").get().then(snapshot => {
            snapshot.forEach(doc => {
              size = snapshot.size;
            });
            return;
          }).catch(reason => {
            response.send({error: reason});
          });
          if(limit === -1){
                limit = size;
            }
            
        await db.collection("fatherDayInfo").orderBy("updatedDate", "desc").offset(offset).limit(limit).get().then(snapshot => {
            snapshot.forEach(doc => {
              i++;
              var dete = doc.data();
              
              var createdAt = "";
               var createdAtDT = typeof(dete["userCreatedAt"]);
                if(createdAtDT!=="undefined"){
                    if(createdAtDT === "object"){
                        var createdAtObj = (dete["userCreatedAt"]);
                        if(createdAtObj !== null){
                            createdAt = format('dd-MM-yyyy hh:mm:ss', new Date(createdAtObj['_seconds'] * 1000));
                        }
                    }
                    if(createdAtDT === 'string'){
                        createdAt = (dete["userCreatedAt"]);
                    } 
               }
               
               
               var updatedAt = "";
               var updatedDT = typeof(dete["updatedDate"]);
                if(updatedDT!=="undefined"){
                    if(updatedDT === "object"){
                        var updatedObj = (dete["updatedDate"]);
                        if(updatedObj !== null){
                            updatedAt = format('dd-MM-yyyy hh:mm:ss', new Date(updatedObj['_seconds'] * 1000));
                        }
                    }
                    if(updatedDT === 'string'){
                        updatedAt = (dete["userCreatedAt"]);
                    } 
               }
              
              details.push([
                doc.id,dete["firstName"], dete["lastName"],dete["userName"],
                dete["nomineeName"],dete["nomineeNumber"],dete["nomineeRelation"],
                dete["socialMediaPlatform"],dete["socialMediaUrl"],dete["userId"],createdAt,updatedAt]);
            });
            response.send({
              status: true,
              aaData: details,
              iTotalRecords: size,
              iTotalDisplayRecords: size,
              msg: "Hello from Firebase!"
            });
            // response.send({ data: { status: true, details: details } });
            return true;
          }).catch(error => {
            response.send({
              data: { status: false, message: "No data in list. " }
            });
            return false;
          }); 
          
        return true;
        
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  
 });            
exports.getListList = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
       // var body = JSON.parse(request.rawBody);
        let db = admin.firestore();
        let data = request.body;
        var limit = parseInt(data.length);
        var offset = parseInt(data.start);
        var size = 0;
        var details = []; //.limit(3).where("email" , "==" , email )
       // var collection = body.data.col;
        var i = 0;
        
        var search = "";
        /*if(data.search.value){
          //search = data.search.value;
        }*/

        var keywords = [];
        if (search !== "") {  
             keywords = search.split(" ");
         }
        
        await db.collection("knowledge_type").get().then(snapshot => {
            snapshot.forEach(doc => {
              size = snapshot.size;
            });
            return;
          }).catch(reason => {
            response.send({error: reason});
          });
          if(limit === -1){
                limit = size;
            }
        //await db.collection(collection).get().then(snapshot => {//.limit(3).orderBy('createdAt', 'desc')
        await db.collection("knowledge_type").orderBy("createdAt", "desc").offset(offset).limit(limit).get().then(snapshot => {
            snapshot.forEach(doc => {
              i++;
              var dete = doc.data();
              //var createdAt = dete['createdAt'].toDate();
              var relative = dete["rel"];
              if (relative === 0) {
                relative = "Both";
              } else if (relative === 1) {
                relative = "Mom";
              } else {
                relative = "Dad";
              }
              var periods = "";
              var periodsData = {"1": "Early Pregnancy","2": "Mid Pregnancy","3": "Late Pregnancy","7": "My Body","8": "Breastfeeding","9": "Medicine in Pregnancy","10": "Medical Conditions","11": "Common Questions","12": "Postnatal","14": "Childcare","13": "Pre-Pregnancy"};
              periods = periodsData[dete["periods"][0]];
              details.push([
                doc.id,dete["name"], dete["name_en"],dete["name_ms"],
                dete["name_zh"],relative,dete["imageURL"] ,"",periods,dete["level"]
              ]);
            });
            response.send({
              status: true,
              aaData: details,
              iTotalRecords: size,
              iTotalDisplayRecords: size,
              msg: "Hello from Firebase!"
            });
            // response.send({ data: { status: true, details: details } });
            return true;
          }).catch(error => {
            response.send({
              data: { status: false, message: "No data in Article list. " }
            });
            return false;
          }); 
          
        return true;
        
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });

exports.listArticle = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try{//collection
        return cors(request, response, async () => {
         var body = JSON.parse(request.rawBody);
         var details=[];//.limit(3).where("email" , "==" , email )
         var collection = body.col;
         var i = 0;
         const promise = admin.firestore().collection(collection).orderBy('createdAt', 'desc').get().then(snapshot => {
             snapshot.forEach((doc) => {                 
                   i++;
                    var dete = doc.data();
                    var content = dete.content;
                   
                    //var createdAt = dete['createdAt'].toDate(); 
                    
                    var relative = dete['rel'];
                    if(relative === 0 ){
                        relative = 'Both';
                    }else if(relative === 1 ){
                        relative = 'Mom';
                    }else{
                        relative = 'Dad';
                    }
                    details.push( ["<a href='?hd="+doc.id+"'> "+doc.id+" </a> " , dete['name'] , dete['name_en']  , dete['name_ms']  , dete['name_zh'], "", relative,"<img src='"+dete['imageURL']+"' />","", dete['periods'][0], dete['level']]);                      
                  });
                  response.send({"status":true, "message":"Article listed successfully","data" : details, "details" : details} );
                 
            
             return "";
         }).catch (error => { 
              response.json({"status":false, "message":"No data in Article list. "});         
              return "";
        });
         
        });
     }catch(er){
         response.send("Error",er);
         return "";
     } 
 });

exports.setArticle = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try{//collection
        return cors(request, response, async () => {
            var body = JSON.parse(request.rawBody);
            
            response.send(body);
        })
    }catch(error){
         response.send("Error",er);
    }
});
/*
exports.setArticleCat = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        var details = rawBody.data;
        let uid = details.parents;
        let db = admin.firestore();
        var qy =
          "knowledge_type/" +
          uid.replace(":", "/knowledge_type/") +
          "/knowledge_type";
        timestamp = admin.firestore.Timestamp.now();
        let dataSet = {
          "-v": 5,
          _parents: [details.parents],
          image: details.imageUrl,
          imageURL: details.image,
          imageBanner: details.imageBanner,
          imageBannerURL: details.imageBannerUrl,
          level: details.level,
          name: details.name,
          name_en: details.name_en,
          name_ms: details.name_ms,
          name_ta: details.name_ta,
          name_zh: details.name_zh,
          parents: details.parents,
          order: details.order,
          publish: details.publish,
          rel: details.rel,
          periods: details.periods,
          createdAt: timestamp
        };
        await db
          .doc(qy)
          .set(dataSet)
          .then(function() {
            console.log("Document added successfully!");
            response.send({
              data: {
                status: true,
                msg: "Article Category added successfully!"
              }
            });
            return { msg: "Article Category successfully!" };
          })
          .catch(error => {
            response.send("Error", error);
            return { msg: "error" };
          });
      });
    } catch (error) {
      console.log(error);
      response.send({ data: { status: false } });
      return;
    }
  });*/
exports.setArticleCat = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        var details = rawBody.data;
        let uid = details.parents;
        let db = admin.firestore();
        var qy = "";
        if(uid !==""){
            qy =
              "knowledge_type/" +
              uid.replace(":", "/knowledge_type/") +
              "/knowledge_type";
        }else{
            qy ="knowledge_type/";
        }
        timestamp = admin.firestore.Timestamp.now();
        let dataSet = {
          "-v":2,
          _parents: [details.parents],
          image: details.imageUrl,
          imageURL: details.image,
          imageBanner: details.imageBanner,
          imageBannerURL: details.imageBannerUrl,
          level: details.level,
          name: details.name,
          name_en: details.name_en,
          name_ms: details.name_ms,
          name_ta: details.name_ta,
          name_zh: details.name_zh,
          parents: details.parents,
          order: details.order,
          publish: details.publish,
          rel: details.rel,
          periods: details.periods,
          createdAt: timestamp
        };
        
        var newStr = outStr =  "";
    var arr =["A","B","C", "D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z" ];
    //PIbr68b
    //NCkoylpRsHtDzSo2KtXV
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 6));
            outStr += Math.floor(Math.random() * 9);
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 3));
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 7));
        
         
        var randId = "P"+outStr;
        console.log(JSON.stringify(randId));
        await db.collection(qy).doc(randId).set(dataSet)
          .then(function() {
              for (var i = 0; i < 4; i++) {
                  var qy = name = "";
          if(i===0){
              if(uid !==""){
                  qy = "knowledge_type_en/" + uid.replace(":", "/knowledge_type_en/") + "/knowledge_type_en";
              }else{
                  qy ="knowledge_type_en/";
              }
              name = details.name_en;
          }else if(i===1){
              if(uid !==""){
                  qy = "knowledge_type_ms/" + uid.replace(":", "/knowledge_type_ms/") + "/knowledge_type_ms";
              }else{
                  qy ="knowledge_type_ms/";
              }
              name = details.name_ms;
          }else if(i===2){
              if(uid !==""){
                  qy = "knowledge_type_zh/" + uid.replace(":", "/knowledge_type_zh/") + "/knowledge_type_zh";
              }else{
                  qy ="knowledge_type_zh/";
              }
              name = details.name_zh;
          }else{
              if(uid !==""){
                  qy = "knowledge_type_ta/" + uid.replace(":", "/knowledge_type_ta/") + "/knowledge_type_ta";
              }else{
                  qy ="knowledge_type_ta/";
              }
              name = details.name_ta;
          }
        
        let dataSet = {
          "-v":2,
          _parents: [details.parents],
          image: details.imageUrl,
          imageURL: details.image,
          imageBanner: details.imageBanner,
          imageBannerURL: details.imageBannerUrl,
          level: details.level,
          name: name,
          parents: details.parents,
          order: details.order,
          publish: details.publish,
          rel: details.rel,
          periods: details.periods,
          createdAt: timestamp
        };
         db.collection(qy).doc(randId).set(dataSet);
          
              }
              
              
              
              
            console.log("Document added successfully!");
            response.send({
              data: {
                status: true,
                msg: "Article Category added successfully!"
              }
            });
            return { msg: "Article Category successfully!" };
          })
          .catch(error => {
            response.send("Error", error);
            return { msg: "error" };
          });
      });
    } catch (error) {
      console.log(error);
      response.send({ data: { status: false } });
      return;
    }
  });
  exports.knowledgeOnCreate = functions.region("asia-northeast1").firestore.document("/knowledge_type/{knowledge_type_id}/knowledge/{id}").onCreate((snap, context) => {
      
     console.log("knowledgeOnCreate");
            
            var details = snap.data();
            db.settings({ ignoreUndefinedProperties: true });
console.log("details : ",details);
           var subcategory = details.subcategory;
           var docId = details.docId;
            var subCat = "";         
            let dataSet = {};
            var refDoc =  "";
            
            /**************************************/
            subcategory.forEach(subcategoryArr => {
                
                for (var i = 0; i < 4; i++) {
        let title = content = intro = keyword ="";
        
       
        let db = admin.firestore(); 
        subCat = subcategoryArr.split(":"); 
        
        
        if(i===0){          
            title = details.en_title;
            content = details.en_content;
            intro = details.en_intro;
            keyword = details.en_tags;
            refDoc = "/knowledge_type_en/"+subcategoryArr.replace(":", "/knowledge_type_en/")+"/knowledge_en/";
        }else if(i===1){
          
            title = details.ms_title;
            content = details.ms_content;
            intro = details.ms_intro;
            keyword = details.ms_tags;
            dbs ="knowledge_ms/"; 
            refDoc = "/knowledge_type_ms/"+subcategoryArr.replace(":", "/knowledge_type_ms/")+"/knowledge_ms/";
        }else if(i===2){
            title = details.zh_title;
            content = details.zh_content;
            intro = details.zh_intro;
            keyword = details.zh_tags;  
            refDoc = "/knowledge_type_zh/"+subcategoryArr.replace(":", "/knowledge_type_zh/")+"/knowledge_zh/";
        }else if(i===3){
            title = details.ta_title;
            content = details.ta_content;
            intro = details.ta_intro;
            keyword = details.ta_tags;
            refDoc = "/knowledge_type_ta/"+subcategoryArr.replace(":", "/knowledge_type_ta/")+"/knowledge_ta/";
        }
                
               //db.doc(refDoc + snap.id + "/").set(dataSet); 
                
               
               //let ref = db.collection(refDoc).doc(docId);
               
              
              
              dataSet = {    
                        "-v" : 5,
                        "_typeIds":subCat,
                        image : details.icon_img_url,
                        imageURL :details.icon_storage_url,
                        title : title,
                        content : content,
                        intro : intro,
                        keyword : keyword,
                        order : 0,
                        publish : details.publish,
                        rel : details.ar_rel,
                        stage : details.ar_type,
                        campaign_id : details.ar_campaign_id,
                        typeIds:subcategoryArr ,
                        rev_comments:details.comments,
                        locality:details.locality,
                        searchable:details.is_searchable,
                        commendable:details.is_commendable,
                        visible_on_app:details.is_visible_on_app,
                        visible_on_dashboard:details.is_visible_on_dashboard
                        
                    };
                    //ref.set(dataSet);
                    db.doc(refDoc + snap.id + "/").set(dataSet); 
 
          }
                
            });
            
            
 
                 
     
      
      
  return true;    
  });
  exports.knowledgeTypeOnCreate = functions.region("asia-northeast1").firestore.document("knowledge_type/{id}").onCreate((snap, context) => {
      
      
      var details = snap.data();
  
db.settings({ ignoreUndefinedProperties: true });
 
    var timestamp = admin.firestore.Timestamp.now();  
    for (var i = 0; i < 4; i++) {
        let title = "";
        let dbs = "";
        let uid = details.parents;
        let db = admin.firestore();   
        
        if(i===0){
            title = details.name_en;
            if(uid !==""){
                dbs =
                  "knowledge_type_en/" +
                  uid.replace(":", "/knowledge_type_en/") +
                  "/knowledge_type_en";
            }else{
                dbs ="knowledge_type_en/";
            }
        }else if(i===1){
            title = details.name_ms;
            if(uid !==""){
                dbs =
                  "knowledge_type_ms/" +
                  uid.replace(":", "/knowledge_type_ms/") +
                  "/knowledge_type_ms";
            }else{
                dbs ="knowledge_type_ms/";
            }
        }else if(i===2){
            title = details.name_zh;
            if(uid !== ""){
                dbs =
                  "knowledge_type_zh/" +
                  uid.replace(":", "/knowledge_type_zh/") +
                  "/knowledge_type_zh";
            }else{
                dbs ="knowledge_type_zh/";
            }
        }else if(i===3){
            title = details.name_ta;
            if(uid !==""){
                dbs =
                  "knowledge_type_ta/" +
                  uid.replace(":", "/knowledge_type_ta/") +
                  "/knowledge_type_ta";
            }else{
                dbs ="knowledge_type_ta/";
            }
        }
        
        var image = "";
        var imgDT1 = typeof(details.image);
        if(imgDT1 !== "undefined"){
           image = details.image;
        }  
        
        var imageURL = "";
        var imageURLDT1 = typeof(details.imageURL);
        if(imageURLDT1 !== "undefined"){
           imageURL = details.imageURL;
        } 
        
        
        let dataSet = {
          "-v": 5,
          _parents: [details.parents],
          image: image,
          imageURL: imageURL,
          imageBanner: details.imageBanner,
          imageBannerURL: details.imageBannerUrl,
          level: details.level,
          name: title,
          parents: details.parents,
          order: details.order,
          publish: details.publish,
          rel: details.rel,
          periods: details.periods,
          createdAt: timestamp
        };
        
        console.log("DBS : ",dbs ," : ",snap.id);
        db.doc(dbs + snap.id + "/").set(dataSet);
        console.log(" created successfully");
        console.log("dataSet : ",dataSet);
    }
         
        return true;/**/
  });
  exports.knowledgeSubTypeOnCreate = functions.region("asia-northeast1").firestore.document("knowledge_type/{subId}").onCreate((snap, context) => {
      
      console.log("knowledgeSubTypeOnCreate");
      var details = snap.data();
  
db.settings({ ignoreUndefinedProperties: true });
 
    var timestamp = admin.firestore.Timestamp.now();  
    for (var i = 0; i < 4; i++) {
        let title = "";
        let dbs = "";
        let uid = details.parents;
        let db = admin.firestore();   
        
        if(i===0){
            title = details.name_en;
            if(uid !==""){
                dbs =
                  "knowledge_type_en/" +
                  uid.replace(":", "/knowledge_type_en/") +
                  "/knowledge_type_en";
            }else{
                dbs ="knowledge_type_en/";
            }
        }else if(i===1){
            title = details.name_ms;
            if(uid !==""){
                dbs =
                  "knowledge_type_ms/" +
                  uid.replace(":", "/knowledge_type_ms/") +
                  "/knowledge_type_ms";
            }else{
                dbs ="knowledge_type_ms/";
            }
        }else if(i===2){
            title = details.name_zh;
            if(uid !== ""){
                dbs =
                  "knowledge_type_zh/" +
                  uid.replace(":", "/knowledge_type_zh/") +
                  "/knowledge_type_zh";
            }else{
                dbs ="knowledge_type_zh/";
            }
        }else if(i===3){
            title = details.name_ta;
            if(uid !==""){
                dbs =
                  "knowledge_type_ta/" +
                  uid.replace(":", "/knowledge_type_ta/") +
                  "/knowledge_type_ta";
            }else{
                dbs ="knowledge_type_ta/";
            }
        }
        
        var image = "";
        var imgDT1 = typeof(details.image);
        if(imgDT1 !== "undefined"){
           image = details.image;
        }  
        
        var imageURL = "";
        var imageURLDT1 = typeof(details.imageURL);
        if(imageURLDT1 !== "undefined"){
           imageURL = details.imageURL;
        } 
        
        
        let dataSet = {
          "-v": 5,
          _parents: [details.parents],
          image: image,
          imageURL: imageURL,
          imageBanner: details.imageBanner,
          imageBannerURL: details.imageBannerUrl,
          level: details.level,
          name: title,
          parents: details.parents,
          order: details.order,
          publish: details.publish,
          rel: details.rel,
          periods: details.periods,
          createdAt: timestamp
        };
        
        console.log("DBS : ",dbs ," : ",snap.id);
        db.doc(dbs + snap.id + "/").set(dataSet);
        console.log(" created successfully");
        console.log("dataSet : ",dataSet);
    }
         
        return true;/**/
  });
  
  
  
exports.getAuth = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try{//collection
        return cors(request, response, async () => {   
            var body = JSON.parse(request.rawBody); 
            console.log(body);
            let db = admin.firestore();
            ///knowledge_type/lQcP2DHPppqsbvr9ziae/knowledge_type/mUnnT5YB70QGfVwyu5cu/knowledge/xzKBjsSKUu2NpDsTVQcX
             /*
               db.collection("knowledge_type").doc("lQcP2DHPppqsbvr9ziae").collection("knowledge_type").doc("mUnnT5YB70QGfVwyu5cu").collection("knowledge").get().then(snapshot => {
                snapshot.forEach((doc) => {               
                  
                    var id = doc.id;
                    console.log("Log id : ",id);
                    let finalData =  db.collection("knowledge_type").doc("lQcP2DHPppqsbvr9ziae").collection("knowledge_type").doc("mUnnT5YB70QGfVwyu5cu").collection("knowledge").doc(id).update({
                        publishHome: true 
                    }).then(function() {                    
                         console.log(id);
                        response.send({status:true,data:id, msg :body});
                         return {msg:"Doc updated successfully!"};
                    }).catch(function(error) {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });
                    
                
                console.log("Document successfully written!");
                 return {msg:"Hello from Firebase!"};
                })
                   
                    
                    response.send({status:true,data:body.data, msg :"body.col"});
            return {msg:"Hello from Firebase!"};
                    
                    
            }).catch(error =>{
                response.send("Error",error);
                return {msg:"error"};
           })
            
             */
            
            
           response.send({status:true,data:body.data, msg :"body.col"});
            return {msg:"Hello from Firebase!"};
        })
    }catch(error){
         response.send("Error",error);
         return {msg:"error"};
    }
}); 
exports.getToolDietList = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        let db = admin.firestore();
var details = [];
var i=0;
        await db
          .collection("constraint_type")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              i++;
              var dete = doc.data();
              details.push([
                doc.id,
                dete["title"],
                dete["title_en"],
                dete["icon"],
                dete["iconURL"],
              ]);
            });
            response.send({
              status: true,
              data: details,
              msg: "Tool Diet Listing",
            });
            return true;
          })
          .catch((error) => {
            response.send({
              data: { status: false, message: "No data in Tool Diet list. " },
            });
            return false;
          }); /* */
        //response.send({data:{status:true,collection:collection}});
        return true;
        // return false;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });exports.importData = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try{//collection
        return cors(request, response, async () => {   
            var body = JSON.parse(request.rawBody); 
            let db = admin.firestore();
            var docData = body.data;
            let ref = db.collection("knowledge_type").doc();
            var categoryArr = docData.typeIds;
            var id = ref.id ; 
            var docId = docData.docId;
           var refDoc = "/knowledge_type/"+categoryArr.replace(":", "/knowledge_type/")+"/knowledge/"; 
            //let ref1 = db.collection(refDoc).doc(id);
            
            //await db.collection("test").doc("35y4OL0EPBetXB6VpJt4").collection("test").doc("0QvnNrznIPVDPYnrtHmT").collection("test").doc(id).set(docData).then(function() {
                await db.collection(refDoc).doc(docId).set(docData).then(function() {
            console.log("Document successfully written!");
                    
                    
                   // let finalData =  db.collection("test").doc("35y4OL0EPBetXB6VpJt4").collection("test").doc("0QvnNrznIPVDPYnrtHmT").collection("test").doc(id).update({
                                    
                     let finalData = db.collection(refDoc).doc(docId).update({
                    locality: {
                                th : {"0" : true,"1":true,"2":true,"3":true,"5":true,"99":true},
                                id : {"0" : true,"1":true,"2":true,"3":true,"5":true,"99":true},
                                my : {"0" : true,"1":true,"2":true,"3":true,"5":true,"99":true},
                                ph : {"0" : true,"1":true,"2":true,"3":true,"5":true,"99":true},
                                vn : {"0" : true,"1":true,"2":true,"3":true,"5":true,"99":true},
                                sg : {"0" : true,"1":true,"2":true,"3":true,"5":true,"99":true}
                              }
                    }).then(function() {                    
                        
                        response.send({status:true,data:true, msg :body,"id":refDoc});
                         return {msg:"Doc updated successfully!"};
                    }).catch(function(error) {
                        // The document probably doesn't exist.
                        console.error({status:true,data:false, msg :error});
                    });
                    
                    
                    
                    return "";
                }).catch(error =>{
                response.send("Error",error);
                return {msg:"error"};
           })
            console.log(id);
           response.send({status:true,data:id, msg :body});
            return {msg:"Hello from Firebase!"};
        })
    }catch(error){
         response.send("Error",error);
         return {msg:"error"};
    }
}); 


exports.importReferalDataTest = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try{//collection
        return cors(request, response, async () => {   
            var body = JSON.parse(request.rawBody); 
            //let db = admin.firestore();
            var docData = body.data; 
            var docId = docData.docId;
            var timestamp = admin.firestore.Timestamp.now();
            let data = {};
            console.log(docData);
            var date = new Date(docData.created);
            var created = admin.firestore.Timestamp.fromDate(date);
            
            data = {"createdAt" : created , "updatedAt" : timestamp };
            
             let db = admin.firestore();
            await db.collection("user").doc(docId).update(data).then(function() {
                 
                response.send({
                  data: { status: true, msg: "user updated successfully!","docData":data , "docId":docId }
                });
                return { msg: "User updated successfully!" };
              }).catch(error => {
                response.send("Error", error);
                return { msg: "error" };
              });
               
        })
    }catch(error){
         response.send("Error",error);
         return {msg:"error"};
    }
}); 
exports.importReferalData = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try{//collection
        return cors(request, response, async () => {   
            var body = JSON.parse(request.rawBody); 
            //let db = admin.firestore();
            var docData = body.data; 
            var docId = docData.docId;
            var timestamp = admin.firestore.Timestamp.now();
            let data = {};
            console.log(docData);
            //var date = new Date(docData.created);
            //var created = admin.firestore.Timestamp.fromDate(date);
            
            data = {"referralCode" : docData.referralCode , "referBy" : docData.referBy , "updatedAt" : timestamp };
            
            /*response.send({
                  data: { status: true, msg: "user updated successfully!","docData":data , "docId":docId }
                });
                return { msg: "User updated successfully!" };
             */
             let db = admin.firestore();
            await db.collection("user").doc(docId).update(data).then(function() {
                 
                response.send({
                  data: { status: true, msg: "user updated successfully!","docData":data , "docId":docId }
                });
                return { msg: "User updated successfully!" };
              }).catch(error => {
                response.send("Error", error);
                return { msg: "error" };
              });
               
        })
    }catch(error){
         response.send("Error",error);
         return {msg:"error"};
    }
}); 
 
async function createRefCode() { 
  var outStr = "",newStr;
 
    var select = Math.floor(Math.random() * 10);
    var arr =["A","B","C", "D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z" ];
    
    switch(select) {
        case 1:
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
            outStr += Math.floor(Math.random() * 9);
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
          break;
        case 2:
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += Math.floor(Math.random() * 9);
          break;
        case 3:
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += Math.floor(Math.random() * 9);
          break;
          
        case 4:
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
          break; 
         case 5:
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += Math.floor(Math.random() * 9);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
          break; 
        case 6:
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += Math.floor(Math.random() * 9);
            outStr += Math.floor(Math.random() * 9);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
          break; 
          case 7:
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += arr[Math.floor(Math.random() * arr.length)];
          break; 
         case 8:
            newStr = Math.random().toString(36).slice(2);
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 2));            
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
          break; 
      
        case 9:
            newStr = Math.random().toString(36).slice(2);           
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += Math.floor(Math.random() * 9);
            break;
        case 10:
            newStr = Math.random().toString(36).slice(2);           
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += arr[Math.floor(Math.random() * arr.length)];
            break;
        default:	
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += arr[Math.floor(Math.random() * arr.length)];
            outStr += arr[Math.floor(Math.random() * arr.length)];
			 
      }
      outStr = outStr.toUpperCase();
  return outStr;
}
async function checkRefCode(code, docId) {
    var newCode = code.toUpperCase();
  await admin.firestore().collection("user").where("referralCode", "==", newCode).get().then(function (snapshot) {
      var size = snapshot.size;
      var timestamp = admin.firestore.Timestamp.now();
        if (size > 0) {
        var len = 4; var outStr = "";
          var arr =["A","B","C", "D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z" ];
          outStr += arr[Math.floor(Math.random() * arr.length)];
          newStr = "";
            while (outStr.length < len) {
              newStr = Math.random().toString(36).slice(2);
              outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
            }
          outStr += arr[Math.floor(Math.random() * arr.length)];
          outStr += arr[Math.floor(Math.random() * arr.length)];
          
          outStr = outStr.toUpperCase();
         
        newCode = outStr.toUpperCase();     
        checkRefCode(newCode, docId);
        return true;
      } else {
        let dataSet = {
          createdAt: timestamp,
          referralCode: newCode,
          status : "pending"/*,
          data: dataDetails*/
        };
        admin.firestore().doc("user/" + docId + "/").update(dataSet);
        return true;
      }
      
    }).catch((error) => {
      console.log("error");
      return false;
    });
}
async function checkRefCodeUpdate(code,referBy, docId) {
    var code1 = code.toString();
    var newCode = code1.toUpperCase();
  await admin.firestore().collection("user").where("referralCode", "==", newCode).get().then(function (snapshot) {
      var size = snapshot.size;
      var timestamp = admin.firestore.Timestamp.now();
        if (size > 0) {
        /*  var len = 6; var outStr = "";
          newStr = "";
        while (outStr.length < 6) {
          newStr = Math.random().toString(36).slice(2);
          outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
        }
         ****************************/
         return new Promise(function(resolve,success){
            const code = createRefCode();
            code.then(function(result){   
                var code1 = result.toUpperCase();
                     
                checkRefCodeUpdate(code1,referBy, docId);
                return;
            }).catch((reason) => {
                return;
            }); 
        });
          
          
          /****************************
        
        return true;*/
      } else {
        let dataSet = {
          referBy:referBy,
          updatedAt: timestamp,
          referralCode: newCode
        };
        admin.firestore().doc("user/" + docId + "/").update(dataSet);
        return true;
      }
      
    }).catch((error) => {
      console.log("error");
      return false;
    });
}
exports.onCreateUserJS = functions.region("asia-northeast1").firestore.document("user/{user}").onCreate(async (snap) => {
    var code = await createRefCode();
    
    //var dataSet = JSON.stringify(snap.data());
    await checkRefCode(code, snap.id);
    return true;
  });

exports.onUpdateUserJS = functions.region("asia-northeast1").firestore.document("user/{user}").onUpdate((snap, context) => {
    const newValue = snap.after.data();
    var uid = context.params.user; 
    var referralCode = "";
    var referralCodeDT1 = typeof(newValue.referralCode);
    if(referralCodeDT1 !== "undefined"){
       referralCode = newValue.referralCode;
    }   
    var referBy = newValue.referBy;
    console.log("referBy : ",newValue);
    var referByUpdate = "";
    var referByDT = typeof(newValue.referBy);
    if(referByDT !== "undefined"){
        if(referBy !== ""){
            if(referBy !== null){
                referByUpdate = referBy.toUpperCase();
            }
        }
    }
    //var referralCodeDT = typeof(referralCode);
                
    //var timestamp = admin.firestore.Timestamp.now(); 
    if(referralCode === null){
        return new Promise(function(resolve,success){
            const code = createRefCode();
            code.then(function(result){   
                var code1 = result.toUpperCase();
               // console.log("referByUpdate : ",code1,referByUpdate, uid );
                checkRefCodeUpdate(code1,referByUpdate, uid );
                return;
            }).catch((reason) => {
                return;
            }); 
        });
    }else if( ( referralCode.length !== 6)|| (referralCode === "") ){// || (referralCodeDT === "undefined" )
        
        return new Promise(function(resolve,success){
            const code = createRefCode();
            code.then(function(result){   
                var code1 = result.toUpperCase();
               // console.log("referByUpdate : ",code1,referByUpdate, uid );
                checkRefCodeUpdate(code1,referByUpdate, uid );
                return;
            }).catch((reason) => {
                return;
            }); 
        });
        
        
        //var code = createRefCode();
        //console.log(code);
        //var code1 = code.toUpperCase();
        
    }else{
        console.log("referByUpdate : ",referByUpdate);
        /*
        
        
        */
        var newCode = referralCode.toUpperCase();
        if(  referralCode !== newCode ){
            let dataSet = {
              referBy:referByUpdate,
              updatedAt: timestamp,
              referralCode: newCode
            };
            admin.firestore().doc("user/" + uid + "/").update(dataSet);
        }
    }
    
     
    //var code = await createRefCode();
    
    //var dataSet = JSON.stringify(snap.data());
    //await checkRefCode(code, snap.id);
    return true;
  });
  
  exports.onUpdateArticleJS = functions.region("asia-northeast1").firestore.document('knowledge_type/{knowledge_type_id}/knowledge/{id}').onUpdate((change, context) => {
      console.log("onUpdateArticleJS");
//    console.log('change?', context);
//    const record = change.after.data();
//   
//    const id = context.params.id;
//    console.log('updated Article', id, record);
     
     
    return true;
});
  
  
exports.addRole = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        var details = rawBody.data;
        await db
          .collection("user_roles")
          .doc()
          .set(details)
          .then(function () {
            console.log("Role successfully written!");
            response.send({
              data: { status: true, msg: "Role added successfully!" },
            });
            return { msg: "Role added successfully!" };
          })
          .catch((error) => {
            response.send("Error", error);
            return { msg: "error" };
          });
        response.send({
          data: { status: true, msg: "Role added successfully" },
        });
        return true;
        // return false;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });


exports.genCode = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
          
          var len = 4; var outStr = "";
          var arr =["A","B","C", "D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z" ];
          outStr += arr[Math.floor(Math.random() * arr.length)];
          newStr = "";
            while (outStr.length < len) {
              newStr = Math.random().toString(36).slice(2);
              outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
            }
          outStr += arr[Math.floor(Math.random() * arr.length)];
          outStr += arr[Math.floor(Math.random() * arr.length)];
          
          outStr = outStr.toUpperCase();
           response.send({
              data: { status: true, msg: outStr },
            });
          return { msg: "Hello from Firebase!" };
      });
    } catch (error) {
      response.send("Error", error);
    }
  });
exports.getRolesList = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        var db = admin.firestore();
        let data = request.body;
        var limit = parseInt(data.length);
        var offset = parseInt(data.start);
        const datas = [];
        var size = 0;
        await db
          .collection("user_roles")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              size = snapshot.size;
            });
            return;
          })
          .catch((reason) => {
            response.send({
              error: reason,
            });
          });
        await db
          .collection("user_roles")
          .offset(offset)
          .limit(limit)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              var det = doc.data();
              var title = "";
              var value = "";
              if (det.title) {
                title = det.title;
              }
              if (det.value) {
                value = det.value;
              }
              var outElement = {
                id: doc.id,
                title: title,
                value: value,
              };
              datas.push(outElement);
            });
            response.send({
              status: true,
              aaData: datas,
              iTotalRecords: size,
              iTotalDisplayRecords: size,
              msg: "Hello from Firebase!",
            });
            return;
          })
          .catch(function (error) {
            response.send({ error: error, status: "false could not found" });
          });
        return { msg: "Hello from Firebase!" };
      });
    } catch (error) {
      response.send("Error", error);
    }
  });
exports.getRandomList = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
            //var code = await createRefCodeTest(); 
            var len = 6;
  var outStr = "",
    newStr;
    var select = Math.floor(Math.random() * 10);
    
    switch(select) {
        case 1:
            newStr = Math.random().toString(36).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 3)).toUpperCase();
          break;
        case 2:
            newStr = Math.random().toString(36).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, 2)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
            outStr += newStr.slice(0, Math.min(newStr.length, 1)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
          break;
        case 3:
            newStr = Math.random().toString(36).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, 1)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
            outStr += newStr.slice(0, Math.min(newStr.length, 1)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
          break;
          
        case 4:
            newStr = Math.random().toString(36).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, 3)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
          break; 
         case 5:
            newStr = Math.random().toString(36).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, 3)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
          break; 
        case 6:
            newStr = Math.random().toString(36).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, 3)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1));
          break; 
          case 7:
            newStr = Math.random().toString(36).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, 3)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 2));
          break; 
         case 8:
            newStr = Math.random().toString(36).slice(2);
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 3));            
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 1)).toUpperCase();
          break; 
        default:
            newStr = Math.random().toString(36).slice(2);            
            outStr += Math.floor(Math.random() * 9);
            outStr += newStr.slice(0, Math.min(newStr.length, 2)).toUpperCase();
            outStr += newStr.slice(0, Math.min(newStr.length, 2)).toUpperCase();
            outStr += Math.floor(Math.random() * 9);
      }

   
        response.send({data:{status:true,code:newStr,outStr:outStr,select:select}});
        return true;
        
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
//exports.exportCsv = functions.region('asia-northeast1').firestore.document("employee/{reportId}").onCreate((event) => {
exports.exportCsv = functions.region('asia-northeast1').https.onRequest((request, response) => {
     //collection
        const fs = require('fs-extra');
    try{//collection
        return cors(request, response, async () => {
         
         var body = JSON.parse(request.rawBody); 
             var email = body.email;  
             
             
             var bucket = admin.storage().bucket();

            //cloud functions can only write to the temporary directory
            const tempFilePath = path.join(os.tmpdir(), "test.csv");

            //creates and writes the file to the local temporary directory 
            //and then retrieves the newly created file for uploading
            fs.write(tempFilePath, function (err, stats) {
                      if (err) {
                          console.error(err);
                      }  else {
                          console.log("File written.");
                          fs.readFile(tempFilePath, function (err, data) {
                            if (err) {
                              throw err;
                            }
                            var uploadTask = bucket.upload(tempFilePath, 
                           { destination: "imgTest/test.csv"});
                       })
                   }
               })
                           
                     
              response.json({"status":true, "message":"bucket","data":"storageRef"});
              return "";
              /*
           admin.auth().getUserByEmail(email).then(user => {//
              var uid = user.uid;
              
              // Get a reference to the storage service, which is used to create references in your storage bucket
            var storage = admin.storage();
            // Create a storage reference from our storage service
            var storageRef = storage.ref();
            
            response.json({"status":true, "message":"bucket","data":"data"}); 
            // Create a child reference
            var imagesRef = storageRef.child('images');
            // imagesRef now points to 'images'
            // Child references can also take paths delimited by '/'
            var spaceRef = storageRef.child('/user/U1oaMujQaeVs8qCQckeVJPOBJET2/photo/Image 23.png');
            // spaceRef now points to "images/space.jpg"
            // imagesRef still points to "images"
                console.log(JSON.stringify(spaceRef));
            //  var storageRef = admin.app().storage("gs://mamanet-pregnancy-my.appspot.com");
              var filePath = "Image 11.png";
              const fileName = path.basename(filePath);
            //  console.log(JSON.stringify(storageRef.appInternal.options));
              const bucket = admin.storage().bucket(storageRef);
              console.log({"file!": "1","bucket" : bucket});
              response.json({"status":true, "message":bucket}); 
            
             /* response.json({"status":false, "message":bkt}); 
               const bucket = admin.storage().bucket(storageRef);
                const tempFilePath = path.join(os.tmpdir(), fileName);
                
                 const thumbFileName = `thumb_${fileName}`;
                const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
                // Uploading the thumbnail.
                 bucket.upload(tempFilePath, {
                  destination: thumbFilePath
                });*/
                // Create a reference to 'images/mountains.jpg'
               // var mountainImagesRef = storageRef.child('imgTest/photo1.png');
//console.log(mountainImagesRef); 
             /*   // use the Blob or File API
                var fileupload = mountainImagesRef.put(file).then(function(files) {
                  console.log('Uploaded a blob or file!');
                  response.json({"status":true, "message":files}); 
                  return "";
                }).catch (error => { 
                    response.json({"status":false, "message":"mountainImagesRef"});         
                    return "";
              });
             response.json({"status":false, "message":bkt});    
              return "";
                
         }).catch (error => { 
              response.json({"status":false, "message":error});         
              return "";
        });
          */
             
     })

        
    }catch(error){
         response.send({"status":true,"details":error});
    }
});
// Blurs the given image located in the given bucket using ImageMagick.
  
 exports.webOncall = functions.region('asia-northeast1').https.onRequest((request, response) => {
    try{//collection
        return cors(request, response, async () => {   
            var body = JSON.parse(request.rawBody); 
            
            console.log(body);
             
           let db = admin.firestore();
            var docData = body.data;
            var data = body.data.data;
            var cate = body.data.cat;
            
            var catlength= body.data.cat.length;  
            
            for(var i=0;i<catlength;i++){
                console.log(cate[i]);
                var catId = cate[i] ;
            }
            
            /****************************************************/
            let ref = db.collection("test").doc();
            var id = ref.id ; 
            
            let fdetails = db.collection("test").doc(id).set(data).then(function() {
                    console.log("Document successfully written!");
                    response.send({status:true,data:id, msg :body});
            return {msg:"Hello from Firebase!"};
            }).catch(error =>{
                response.send("Error",error);
                return {msg:"error"};
           })
             
            
             
            /****************************************************/  
            console.log(docData);
           response.send({status:true,data:{details:data,category:cate,length : {cat:catlength,catId:catId}} });
            return {msg:"Hello from Firebase!"};
        })
    }catch(error){
         response.send("Error",error);
         return {msg:"error"};
    }
});
    exports.getXl = functions.region('asia-northeast1').https.onCall((request, response) => {
    try{//collection
        return cors(request, response, async () => {   
            var body = JSON.parse(request.rawBody); 
            
            
           response.send({status:true,data:body , msg :"Hello from Firebase!"});
            return {msg:"Hello from Firebase!"};
        })
    }catch(error){
         response.send("Error",error);
    }
}); 
exports.getPostTest = functions.region('asia-northeast1').https.onRequest((request, response) => {
  try {
    //collection
    return cors(request, response, async () => {
      let data = request.body;
      console.log("Name ",data);
      var draw = data.draw;
      var limit = parseInt(data.length);  
      var offset = parseInt(data.start);
      var search = "";
      if(data.search.value){
        search = data.search.value;
      }
       
      var keywords = [];
      if (search !== "") {  
           keywords = search.split(" ");
          // console.log("search Key word ",keywords);
      } 
      var stuff=[];
      var size = 0;
      var db = admin.firestore();
      if (search === "") {  
        await db.collection("user").get().then(snapshot => {
            snapshot.forEach(doc => {
                size = snapshot.size;
               // console.log(size);
            });
            return;
        }).catch(reason => {
            response.send({error:reason});
          });
      }
        if (search !== "") {  
            await db.collection("user").where("firstName","in",keywords).get().then(snapshot => {
            snapshot.forEach(doc => {
                size = snapshot.size;
                //console.log(size);
            });
            
            return;
      }).catch(reason => {
          response.send({error:reason});
        });
        
        /*
            const p1 = await db.collection("user").where("firstName", "in" , keywords);
            const p2 = await db.collection("user").where("lastName", "in" , keywords);
            const p3 = await db.collection("user").where("displayName", "in" , keywords);
          
            letPromise1 =  new Promise([p1.get(), p2.get(), p3.get()]).then(res => {
                            res.forEach(r => {
                              r.forEach(doc => {
                               size = doc.size;
                              }); 
                          });
                          return;
                    }).catch(reason => {
                        response.send({error:reason});
                      });
        */
      }
        
      
      if(search === ""){
          if(limit === -1){
              offset = 0;
              limit = size;
          }
        await db.collection("user").offset(offset).limit(limit).get().then(snapshot => {
            snapshot.forEach(doc => {

               var det = doc.data();
               var status = '';
               /*if(det.status === "active"){
                   status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</button>";                               
               }else{
                   status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm cS' id='userDetails'>Inactive</button>";                               
               }*/
               if(det.status === "active"){
                   status = "<a class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</a>";                               
               }else{
                   status = "<a class='btn mb-1 btn-rounded btn-success btn-sm cS' id='userDetails'>Inactive</a>";                               
               }
                  var language = "";
              if(det.lang){
                  language = det.lang;
                  if(language === 'en'){
                      language = 'English';
                  }
                  if(language === 'zh'){
                      language = 'Chinese';
                  }
                  //en zh

              }
              var country = "";
              if(det.country){
                  country = det.country;
                  if(country === 'my'){
                      country = 'Malaysia';
                  }
                  if(country === 'sg'){
                      country = 'Singapore';
                  }
                  if(country === 'id'){
                      country = 'India';
                  }
              }
              var gender = "";
              if(det.gender){
                  if(parseInt(det.gender)===1){
                      gender = "Female";
                  }
                  if(parseInt(det.gender)===2){
                      gender = "Male";
                  }
              }             
              var identity = "";
              if(det.identity){
                  identity = det.identity;
              }

              var referBy = "";
              if(det.referBy){
                  referBy = det.referBy;
              }

              var referralCode = "";
              if(det.referralCode){
                  referralCode = det.referralCode;
              }
              var email = "";
              if(det.email){
                  email = det.email;
              }
              var photoURL = "";
              if(det.photoURL){
                  photoURL = det.photoURL;
              }
              var displayName = "";
              if(det.displayName){
                  displayName = det.displayName;
              }
              var firstName = "";
              if(det.firstName){
                  firstName = det.firstName;
              }
              var lastName = "";
              if(det.lastName){
                  lastName = det.lastName;
              }
              
              var mobile = "";
              if(det.mobile){
                  mobile = det.mobile;
              }
              
              
              var userStatus = "";
              if(det.userStatus){
                  userStatus = det.status;
              }
              var expected = "";
              var expectedDT = typeof(det.expected);
                if(expectedDT!=="undefined"){
                    if(expectedDT === "object"){
                        var expectedObj = (det.expected);
                        if(expectedObj !== null){
                            expected = format('dd-MM-yyyy', new Date(expectedObj['_seconds'] * 1000));
                        }
                    }
                    if(expectedDT === 'string'){
                        expected = (det.expected);
                    } 
               }
              
              var birthday = "";
              var birthdayDT = typeof(det.birthday);
                if(birthdayDT!=="undefined"){
                    if(birthdayDT === "object"){
                        var birthdayObj = (det.birthday);
                        if(birthdayObj !== null){
                            birthday = format('dd-MM-yyyy', new Date(birthdayObj['_seconds'] * 1000));
                        }
                    }
                    if(birthdayDT === 'string'){
                        birthday = (det.birthday);
                    } 
               }
               //birthday = (det.birthday);
               var createdAt = "";
               var createdAtDT = typeof(det.createdAt);
                if(createdAtDT!=="undefined"){
                    if(createdAtDT === "object"){
                        var createdAtObj = (det.createdAt);
                        if(createdAtObj !== null){
                            createdAt = format('dd-MM-yyyy hh:mm:ss', new Date(createdAtObj['_seconds'] * 1000));
                        }
                    }
                    if(createdAtDT === 'string'){
                        createdAt = (det.createdAt);
                    } 
               }
               
               var updatedAt = "";
               var updatedAtDT = typeof(det.updatedAt);
                if(updatedAtDT!=="undefined"){
                    if(updatedAtDT === "object"){
                        var updatedAtObj = (det.updatedAt);
                        if(updatedAtObj !== null){
                            updatedAt = format('dd-MM-yyyy hh:mm:ss', new Date(updatedAtObj['_seconds'] * 1000));
                        }
                    }
                    if(updatedAtDT === 'string'){
                        updatedAt = det.updatedAt;
                    } 
               }
              
              
              
              
              var newelement = {
                id: doc.id,
                displayName: displayName,
                firstName:firstName,
                lastName:lastName,
                mobile:mobile,
                expected:expected,
                lang:language,
                country:country,
                gender:gender,
                identity:identity,
                referral:referBy,              
                referralCode:referralCode,
                email:email,
                birthday:birthday,
                photoURL:photoURL,
                status:status,
                userStatus:userStatus,
                createdOn:createdAt,
                updatedOn:updatedAt

              };
              stuff.push(newelement);
            });
            response.send({
              status: true,
              draw:draw,
              iTotalRecords:size,
              iTotalDisplayRecords:size,
              aaData: stuff,
              msg: "Data Listed Successfully"
            });
            return;
          }).catch(reason => {
            response.send({error:reason});
          });
        return { msg: "Hello from Firebase!" };
      
  }else{
      
      /**************************Search By******************************
      
            const p1 = await db.collection("user").where("firstName", "in" , keywords);
            const p2 = await db.collection("user").where("lastName", "in" , keywords);
            const p3 = await db.collection("user").where("displayName", "in" , keywords);
          
            return Promise.all([p1.get(), p2.get(), p3.get()]).then(res => {
                            res.forEach(r => {
                              r.forEach(doc => {
                               size = doc.size;
                              }); 
                          });
                          return;
                    }).catch(reason => {
                        response.send({error:reason});
                      });
      */
      
            const p11 = db.collection("user").where("firstName", "in" , keywords);
            const p12 = db.collection("user").where("lastName", "in" , keywords);
            const p13 = db.collection("user").where("displayName", "in" , keywords);
          //.offset(offset).limit(limit)
      
      /*************************Search By********************************/
      //await db.collection("user").where("firstName", "in" , keywords).offset(offset).limit(limit).get().then(snapshot => {
          //snapshot.forEach(doc => {
    return Promise.all([p11.get(), p12.get(), p13.get()]).then(res => {
                            res.forEach(r => {
                              r.forEach(doc => {
              
             var det = doc.data();
             console.log("Data : ",det);
             var status = '';
             /*if(det.status === "active"){
                 status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</button>";                               
             }else{
                 status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm cS' id='userDetails'>Inactive</button>";                               
             }*/
             if(det.status === "active"){
                   status = "<a class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</a>";                               
               }else{
                   status = "<a class='btn mb-1 btn-rounded btn-success btn-sm cS' id='userDetails'>Inactive</a>";                               
               }
                var language = "";
            if(det.lang){
                language = det.lang;
            }
            var country = "";
            if(det.country){
                country = det.country;
            }
            var gender = "";
            if(det.gender){
                if(parseInt(det.gender)===1){
                    gender = "Female";
                }
                if(parseInt(det.gender)===2){
                    gender = "Male";
                }
            }             
            var identity = "";
            if(det.identity){
                identity = det.identity;
            }
            
            var referral = "";
            if(det.referral){
                referral = det.referral;
            }
            
            var referralCode = "";
            if(det.referralCode){
                referralCode = det.referralCode;
            }
            var email = "";
            if(det.email){
                email = det.email;
            }
            var photoURL = "";
            if(det.photoURL){
                photoURL = det.photoURL;
            }
            var newelement = {
              id: doc.id,
              displayName: det.displayName,
              firstName:det.firstName,
              lastName:det.lastName,
              mobile:det.mobile,
              expected:det.expected,
              lang:language,
              country:country,
              gender:gender,
              identity:identity,
              referral:referral,              
              referralCode:referralCode,
              email:email,
              photoURL:photoURL,
              status:status,
              userStatus:det.status,
              createdOn:det.createdAt,
              updatedOn:det.updatedAt
              
            };
            stuff.push(newelement);
            });
          });
          response.send({
            data:keywords,
            status: true,
            offset:offset,
            limit:limit,
            draw:draw,
            iTotalRecords:size,
            iTotalDisplayRecords:size,
            aaData: stuff,
            msg: "Data Listed Successfully"
          });
          return;
        }).catch(reason => {
          response.send({error:reason});
        });
  }
  });
    } catch (error) {
      response.send("Error", error);
    }
});

exports.getuserCountList = functions.region('asia-northeast1').https.onRequest((request, response) => {
  try {
    //collection
    return cors(request, response, async () => {
        
        
    });

 } catch (error) {
      response.send("Error", error);
    }
});
exports.getPendingUser = functions.region('asia-northeast1').https.onRequest((request, response) => {
  try {
      return cors(request, response, async () => {
          var stuff=[];
        
         await db.collection("user").get().then(snapshot => {//.where("mobile", "==" , "")
            snapshot.forEach(doc => {             
               var uid = doc.id;
               var det = doc.data(); 
               //userName
               if(uid === "mBfEP4fwyaaMe7pqASSjaJrpKZd2"){
                   if(det.userName === undefined){
                       console.log("user ",det.userName);
               }
               }/**/
              //
              if(( det.firstName === "" || det.firstName === undefined || det.firstName === null || det.lastName === "" || det.lastName === undefined || det.lastName === null || det.userName === "" || det.userName === undefined || det.userName === null) && det.status !== "pending" ){ //null || det.firstName === null && det.lastName === null
              //if(det.firstName !== "" && det.lastName !== "" && det.userName !== "" && det.status === "pending" && (det.email === "" || det.mobile === "") ){
                //if(det.status !== "pending" && det.email === "" ){
                    var dataSet = {status : "pending"};
                    //var dataSet = {status : "active"};
                    doc.ref.update(dataSet);
                    stuff.push(doc.id);
                }
                
                
                
               //db.collection("user").doc(uid).update(dataSet);
              
            });
         
           /******************************
          await db.collection("user").where("referBy", "==" , data.code).get().then(snapshot => {
            snapshot.forEach(doc => {
               var uid = doc.id;
               var det = doc.data(); 
                stuff.push(uid); 
              
              
            });*/
            response.send({data:{status:true,details:stuff}});
            
            return { msg: "Hello from Firebase!" };
          }).catch(reason => {
            response.send({error:reason});
            return;
          }); 
      })
    }catch (error) {
        response.send("Error", error);
    }
      
      });
exports.getuserList = functions.region('asia-northeast1').https.onRequest((request, response) => {
  try {
    //collection
    return cors(request, response, async () => {
      let data = request.body;
      console.log("Name ",data);
      var draw = data.draw;
      var limit = parseInt(data.length);  
      var offset = parseInt(data.start);
      var search = "";
      if(data.search.value){
        search = data.search.value;
      }
       
      var keywords = [];
      if (search !== "") {  
           keywords = search.split(" ");
          // console.log("search Key word ",keywords);
      } 
      var stuff=[];
      var size = 0;
      var db = admin.firestore();
      if (search === "") {  
        await db.collection("user").get().then(snapshot => {
            snapshot.forEach(doc => {
                size = snapshot.size;
               // console.log(size);
            });
            return;
        }).catch(reason => {
            response.send({error:reason});
          });
      }
        if (search !== "") {  
            await db.collection("user").where("firstName","in",keywords).get().then(snapshot => {
            snapshot.forEach(doc => {
                size = snapshot.size;
                //console.log(size);
            });
            
            return;
      }).catch(reason => {
          response.send({error:reason});
        });
        
       
      }
        
      
      if(search === ""){
          if(limit === -1){
              offset = 0;
              limit = size;
          }
        await db.collection("user").offset(offset).limit(limit).orderBy('createdAt', 'desc').get().then(snapshot => {
            snapshot.forEach(doc => {

               var det = doc.data();
               var status = '';
               /*if(det.status === "active"){
                   status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</button>";                               
               }else{
                   status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm cS' id='userDetails'>Inactive</button>";                               
               }
                        
                         
                         **/
               if(det.status === "active"){
                   status = "<a class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</a>";                               
               }else if(det.status === "inactive"){
                   status = "<a class='btn mb-1 btn-rounded btn-danger btn-sm cS' id='userDetails'>Inactive</a>";                               
               }else if(det.status === "pending"){
                   status = "<a class='btn mb-1 btn-rounded btn-warning btn-sm cS' id='userDetails'>Pending</a>";                               
               }else{
                   status = "";                               
               }
                  var language = "";
              if(det.lang){
                  language = det.lang;
                  if(language === 'en'){
                      language = 'English';
                  }
                  if(language === 'zh'){
                      language = 'Chinese';
                  }
                  //en zh

              }
              var country = "";
              if(det.country){
                  country = det.country;
                  if(country === 'my'){
                      country = 'Malaysia';
                  }
                  if(country === 'sg'){
                      country = 'Singapore';
                  }
                  if(country === 'id'){
                      country = 'India';
                  }
              }
              var gender = "";
              if(det.gender){
                  if(parseInt(det.gender)===1){
                      gender = "Female";
                  }
                  if(parseInt(det.gender)===2){
                      gender = "Male";
                  }
              }             
              var identity = "";
              if(det.identity){
                  identity = det.identity;
              }

              var referBy = "";
              if(det.referBy){
                  referBy = det.referBy;
              }

              var referralCode = "";
              if(det.referralCode){
                  referralCode = det.referralCode;
              }
              var email = "";
              if(det.email){
                  email = det.email;
              }
              var photoURL = "";
              if(det.photoURL){
                  photoURL = det.photoURL;
              }
              var displayName = "";
              if(det.displayName){
                  displayName = det.displayName;
              }
              var userName = "";
               var userNameDT = typeof(det.userName);
                if(userNameDT!=="undefined"){                    
                    if(det.userName){
                        userName = det.userName;
                    }
                }
              var firstName = "";
              if(det.firstName){
                  firstName = det.firstName;
              }
              var lastName = "";
              if(det.lastName){
                  lastName = det.lastName;
              }
              
              var mobile = "";
              if(det.mobile){
                  mobile = det.mobile;
              }
              
              
              var userStatus = "";
              if(det.userStatus){
                  userStatus = det.status;
              }
              var expected = "";
              var expectedDT = typeof(det.expected);
                if(expectedDT!=="undefined"){
                    if(expectedDT === "object"){
                        var expectedObj = (det.expected);
                        if(expectedObj !== null){ 
                            expected = format('dd-MM-yyyy', new Date(expectedObj['_seconds'] * 1000));
                        }
                    }
                    if(expectedDT === 'string'){
                        expected = (det.expected);
                    } 
               }
              
              var birthday = "";
              var birthdayDT = typeof(det.birthday);
                if(birthdayDT!=="undefined"){
                    if(birthdayDT === "object"){
                        var birthdayObj = (det.birthday);
                        if(birthdayObj !== null){
                            birthday = format('dd-MM-yyyy', new Date(birthdayObj['_seconds'] * 1000));
                        }
                    }
                    if(birthdayDT === 'string'){
                        birthday = (det.birthday);
                    } 
               }
               //birthday = (det.birthday);
               var createdAt = "";
               var createdAtDT = typeof(det.createdAt);
                if(createdAtDT!=="undefined"){
                    if(createdAtDT === "object"){
                        var createdAtObj = (det.createdAt);
                        if(createdAtObj !== null){
                            createdAt = format('yyyy-MM-dd hh:mm', new Date(createdAtObj['_seconds'] * 1000));
                            //createdAt = new Date(createdAt);
                        }
                    }
                    if(createdAtDT === 'string'){
                        createdAt = new Date(det.createdAt);
                         
                    } 
               }
               var createdAt1 = "";
               var createdAtDT1 = typeof(det.createdAt);
                if(createdAtDT1!=="undefined"){
                    if(createdAtDT1 === "object"){
                        var createdAtObj1 = (det.createdAt);
                        if(createdAtObj1 !== null){
                            createdAt1 = format('yyyy/MM/dd', new Date(createdAtObj1['_seconds'] * 1000));
                            //createdAt1 = new Date(createdAt1);
                        }
                    }
                    if(createdAtDT1 === 'string'){
                        createdAt1 = new Date(det.createdAt);
                    } 
               }
               
              
              
               var updatedAt = "";
               var updatedAtDT = typeof(det.updatedAt);
                if(updatedAtDT!=="undefined"){
                    if(updatedAtDT === "object"){
                        var updatedAtObj = (det.updatedAt);
                        if(updatedAtObj !== null){
                            updatedAt = format('yyyy-MM-dd hh:mm', new Date(updatedAtObj['_seconds'] * 1000));
                            //updatedAt = new Date(updatedAt);
                        }
                    }
                    if(updatedAtDT === 'string'){
                        updatedAt = new Date(det.updatedAt);
                    } 
               }
               var updatedAt1 = "";
               var updatedAtDT1 = typeof(det.updatedAt);
                if(updatedAtDT1!=="undefined"){
                    if(updatedAtDT1 === "object"){
                        var updatedAtObj1 = (det.updatedAt);
                        if(updatedAtObj1 !== null){
                            updatedAt1 = format('yyyy/MM/dd', new Date(updatedAtObj1['_seconds'] * 1000));
                            //updatedAt1 = new Date(updatedAt1);
                        }
                    }
                    if(updatedAtDT1 === 'string'){ 
                        updatedAt1 = new Date(det.updatedAt);
                    } 
               }
              
              
              
              
              var newelement = {
                id: doc.id,
                displayName: displayName,
                userName: userName,
                firstName:firstName,
                lastName:lastName,
                mobile:mobile,
                expected:expected,
                lang:language,
                country:country,
                gender:gender,
                identity:identity,
                referral:referBy,              
                referralCode:referralCode,
                email:email,
                birthday:birthday,
                photoURL:photoURL,
                status:status,
                userStatus:userStatus,
                createdOn:createdAt,
                updatedOn:updatedAt,
                createdOn1:createdAt1,
                updatedOn1:updatedAt1

              };
              stuff.push(newelement);
            });
            response.send({
              status: true,
              draw:draw,
              iTotalRecords:size,
              iTotalDisplayRecords:size,
              aaData: stuff,
              msg: "Data Listed Successfully"
            });
            return;
          }).catch(reason => {
            response.send({error:reason});
          });
        return { msg: "Hello from Firebase!" };
      
  }else{
      
      /**************************Search By******************************
      
            const p1 = await db.collection("user").where("firstName", "in" , keywords);
            const p2 = await db.collection("user").where("lastName", "in" , keywords);
            const p3 = await db.collection("user").where("displayName", "in" , keywords);
          
            return Promise.all([p1.get(), p2.get(), p3.get()]).then(res => {
                            res.forEach(r => {
                              r.forEach(doc => {
                               size = doc.size;
                              }); 
                          });
                          return;
                    }).catch(reason => {
                        response.send({error:reason});
                      });
      */
      
            const p11 = db.collection("user").where("firstName", "in" , keywords).orderBy('createdAt', 'desc');
            const p12 = db.collection("user").where("lastName", "in" , keywords).orderBy('createdAt', 'desc');
            const p13 = db.collection("user").where("displayName", "in" , keywords).orderBy('createdAt', 'desc');
            const p14 = db.collection("user").where("userName", "in" , keywords).orderBy('createdAt', 'desc');
          //.offset(offset).limit(limit)
      
      /*************************Search By********************************/
      //await db.collection("user").where("firstName", "in" , keywords).offset(offset).limit(limit).get().then(snapshot => {
          //snapshot.forEach(doc => {
    return Promise.all([p11.get(), p12.get(), p13.get(), p14.get()]).then(res => {
                            res.forEach(r => {
                              r.forEach(doc => {
              
             var det = doc.data();
             console.log("Data : ",det);
             var status = '';
             /*if(det.status === "active"){
                 status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</button>";                               
             }else{
                 status = "<button type='button' class='btn mb-1 btn-rounded btn-success btn-sm cS' id='userDetails'>Inactive</button>";                               
             }*/
             if(det.status === "active"){
                   status = "<a class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</a>";                               
               }else if(det.status === "inactive"){
                   status = "<a class='btn mb-1 btn-rounded btn-danger btn-sm cS' id='userDetails'>Inactive</a>";                               
               }else if(det.status === "pending"){
                   status = "<a class='btn mb-1 btn-rounded btn-warning btn-sm cS' id='userDetails'>Pending</a>";                               
               }else{
                   status = "";                               
               }
                  var language = "";
              if(det.lang){
                  language = det.lang;
                  if(language === 'en'){
                      language = 'English';
                  }
                  if(language === 'zh'){
                      language = 'Chinese';
                  }
                  //en zh

              }
              var country = "";
              if(det.country){
                  country = det.country;
                  if(country === 'my'){
                      country = 'Malaysia';
                  }
                  if(country === 'sg'){
                      country = 'Singapore';
                  }
                  if(country === 'id'){
                      country = 'India';
                  }
              }
              var gender = "";
              if(det.gender){
                  if(parseInt(det.gender)===1){
                      gender = "Female";
                  }
                  if(parseInt(det.gender)===2){
                      gender = "Male";
                  }
              }             
              var identity = "";
              if(det.identity){
                  identity = det.identity;
              }

              var referBy = "";
              if(det.referBy){
                  referBy = det.referBy;
              }

              var referralCode = "";
              if(det.referralCode){
                  referralCode = det.referralCode;
              }
              var email = "";
              if(det.email){
                  email = det.email;
              }
              var photoURL = "";
              if(det.photoURL){
                  photoURL = det.photoURL;
              }
              var displayName = "";
              if(det.displayName){
                  displayName = det.displayName;
              }
              var userName = "";
               var userNameDT = typeof(det.userName);
                if(userNameDT!=="undefined"){                    
                    if(det.userName){
                        userName = det.userName;
                    }
                }
              var firstName = "";
              if(det.firstName){
                  firstName = det.firstName;
              }
              var lastName = "";
              if(det.lastName){
                  lastName = det.lastName;
              }
              
              var mobile = "";
              if(det.mobile){
                  mobile = det.mobile;
              }
              
              
              var userStatus = "";
              if(det.userStatus){
                  userStatus = det.status;
              }
              
              var expected = "";
              var expectedDT = typeof(det.expected);
                if(expectedDT!=="undefined"){
                    if(expectedDT === "object"){
                        var expectedObj = (det.expected);
                        if(expectedObj !== null){
                            expected = format('dd-MM-yyyy', new Date(expectedObj['_seconds'] * 1000));
                        }
                    }
                    if(expectedDT === 'string'){
                        expected = (det.expected);
                    } 
               }
              
              var birthday = "";
              var birthdayDT = typeof(det.birthday);
                if(birthdayDT!=="undefined"){
                    if(birthdayDT === "object"){
                        var birthdayObj = (det.birthday);
                        if(birthdayObj !== null){
                            birthday = format('dd-MM-yyyy', new Date(birthdayObj['_seconds'] * 1000));
                        }
                    }
                    if(birthdayDT === 'string'){
                        birthday = (det.birthday);
                    } 
               }
               //birthday = (det.birthday);
               var createdAt = "";
               var createdAtDT = typeof(det.createdAt);
                if(createdAtDT!=="undefined"){
                    if(createdAtDT === "object"){
                        var createdAtObj = (det.createdAt);
                        if(createdAtObj !== null){
                            createdAt = format('yyyy-MM-dd hh:mm', new Date(createdAtObj['_seconds'] * 1000));
                            //createdAt = new Date(createdAt);
                        }
                    }
                    if(createdAtDT === 'string'){
                        createdAt = new Date(det.createdAt);
                    } 
               }
               var updatedAt = "";
               var updatedAtDT = typeof(det.updatedAt);
                if(updatedAtDT!=="undefined"){
                    if(updatedAtDT === "object"){
                        var updatedAtObj = (det.updatedAt);
                        if(updatedAtObj !== null){
                            updatedAt = format('yyyy-MM-dd hh:mm', new Date(updatedAtObj['_seconds'] * 1000));
                            //updatedAt = new Date(updatedAt);
                        }
                    }
                    if(updatedAtDT === 'string'){ 
                        updatedAt = new Date(det.updatedAt);
                    } 
               }
               var createdAt1 = "";
               var createdAtDT1 = typeof(det.createdAt);
                if(createdAtDT1!=="undefined"){
                    if(createdAtDT1 === "object"){
                        var createdAtObj1 = (det.createdAt);
                        if(createdAtObj1 !== null){
                            createdAt1 = format('yyyy/MM/dd', new Date(createdAtObj1['_seconds'] * 1000));
                            //createdAt1 = new Date(createdAt1);
                        }
                    }
                    if(createdAtDT1 === 'string'){
                        createdAt1 = new Date(det.createdAt);
                    } 
               }
               var updatedAt1 = "";
               var updatedAtDT1 = typeof(det.updatedAt);
                if(updatedAtDT1!=="undefined"){
                    if(updatedAtDT1 === "object"){
                        var updatedAtObj1 = (det.updatedAt);
                        if(updatedAtObj1 !== null){
                            updatedAt1 = format('yyyy/MM/dd', new Date(updatedAtObj['_seconds'] * 1000));
                            //updatedAt1 = new Date(updatedAt1);
                        }
                    }
                    if(updatedAtDT1 === 'string'){
                        updatedAt1 = new Date(det.updatedAt);
                    } 
               }
              
              
               
              
              var newelement = {
                id: doc.id,
                displayName: displayName,
                userName:userName,
                firstName:firstName,
                lastName:lastName,
                mobile:mobile,
                expected:expected,
                lang:language,
                country:country,
                gender:gender,
                identity:identity,
                referral:referBy,              
                referralCode:referralCode,
                email:email,
                birthday:birthday,
                photoURL:photoURL,
                status:status,
                userStatus:userStatus,
                createdOn:createdAt,
                updatedOn:updatedAt,
                createdOn1:createdAt1,
                updatedOn1:updatedAt1

              };
              stuff.push(newelement);
            });
          });
          response.send({
            data:keywords,
            status: true,
            offset:offset,
            limit:limit,
            draw:draw,
            iTotalRecords:size,
            iTotalDisplayRecords:size,
            aaData: stuff,
            msg: "Data Listed Successfully"
          });
          return;
        }).catch(reason => {
          response.send({error:reason});
        });
  }
  });
    } catch (error) {
      response.send("Error", error);
    }
});
exports.getAdminUsers = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        // let db = admin.firestore();
        // var details = [];
        var userDetails = [];
        var ind = 0;
        admin.auth().listUsers(1000).then(function(listUsersResult) {
            listUsersResult.users.forEach(function(userRecord) {
                ind++;
                userDetails.push(userRecord.toJSON());
             /* if(userRecord.providerData.length !== 0){
                        var providerData =  userRecord.providerData[0]['providerId'];
                        var newelement = { uid: userRecord.uid , providerData : providerData , ind :ind };
                        userDetails.push(newelement);//userRecord.toJSON()
                    }else{
                        var providerData = "anonymous";
                        var newelement = { uid: userRecord.uid , providerData : providerData , ind :ind };
                        userDetails.push(newelement);
                    }*/
            });
           // console.log("Token");
            console.log(listUsersResult.pageToken);
            if (listUsersResult.pageToken) {
              admin.auth().listUsers(1000, listUsersResult.pageToken)
                .then(function(listUsersResult) {
                  listUsersResult.users.forEach(function(userRecord) {
                      userDetails.push(userRecord.toJSON());
                    /*if(userRecord.providerData.length !== 0){
                        var providerData =  userRecord.providerData[0]['providerId'];
                        var newelement = { uid: userRecord.uid , providerData : providerData , ind :ind };
                        userDetails.push(newelement);//userRecord.toJSON()
                    }else{
                        var providerData = "anonymous";
                        var newelement = { uid: userRecord.uid , providerData : providerData , ind :ind};
                        userDetails.push(newelement);
                    }*/
                    console.log("Page Token",userRecord.uid);
                  });
                  return true;
                }).catch(function(error) {
                  response.send({
                    status: false,
                    msg: "Data Listed failed"
                  });
                  console.log("Error listing users:", error);
                });
            }
            response.send({
              status: true,
              userDetails: userDetails,
              msg: "Data Listed Successfully"
            });
            return true;
          })
          .catch(function(error) {
            response.send({
              status: false,
              msg: "Data Listed failed"
            });
            console.log("Error listing users:", error);
          });
        // return false;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
exports.getUserDashboardData = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        let db = admin.firestore();
        var details = [];
        var userDetails = [];
        var userCountryWise = [];
        var userLangWise = [];
        var user_total_count = 0;
        var user_active_count = 0;
        var new_user_count = 0;
        var month_user_count = 0;
        var guest_user_count = 0;
        var mother_total_count = 0;
        var mother_active_count = 0;
        var father_total_count = 0;
        var father_active_count = 0;
        await db
          .collection("user")
          .get()
          .then((snapshot) => {
            user_total_count = snapshot.size;
            snapshot.forEach((doc) => {
              userDetails.push({
                id: doc.id,
                country: doc.data().country,
                lang: doc.data().lang,
              });
            });
            return;
          })
          .catch((reason) => {
            response.send({ error: reason });
          });
        //active count
        await db
          .collection("user")
          .where("status", "==", "active")
          .get()
          .then((snapshot) => {
            user_active_count = snapshot.size;
            return;
          })
          .catch((reason) => {
            response.send({ error: reason });
          });
        //guest user count
        await db
          .collection("user")
          .where("isGuest", "==", true)
          .get()
          .then((snapshot) => {
            guest_user_count = snapshot.size;
            return;
          })
          .catch((reason) => {
            response.send({ error: reason });
          });
        //new user count
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        await db.collection("user").where("createdAt", ">=", firstDay).where("createdAt", "<=", lastDay).get().then((snapshot) => {
            new_user_count = snapshot.size;
            return;
          }).catch((reason) => {
            response.send({ error: reason });
          });
        await db.collection("user").where("status", "==", "active").where("createdAt", ">=", firstDay).where("createdAt", "<=", lastDay).get().then((snapshot) => {
            month_user_count = snapshot.size;
            return;
          })
          .catch((reason) => {
            response.send({ error: reason });
          });
        //mother count
        await db.collection("user").where("gender", "==", 1).get().then((snapshot) => {
            mother_total_count = snapshot.size;
            return;
          }).catch((reason) => {
            response.send({ error: reason });
          });
        await db.collection("user").where("gender", "==", 1).where("status", "==", "active").get().then((snapshot) => {
            mother_active_count = snapshot.size;
            return;
          }).catch((reason) => {
            response.send({ error: reason });
          });
        //father count
        await db.collection("user").where("gender", "==", 2).get().then((snapshot) => {
            father_total_count = snapshot.size;
            return;
          }).catch((reason) => {
            response.send({ error: reason });
          });
        await db
          .collection("user")
          .where("gender", "==", 2)
          .where("status", "==", "active")
          .get()
          .then((snapshot) => {
            father_active_count = snapshot.size;
            return;
          })
          .catch((reason) => {
            response.send({ error: reason });
          });
        // user one week data
        var first_day = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        var last_day = new Date(Date.now());
        var oneWeekUsers = [];
        await db
          .collection("user")
          .where("createdAt", ">=", first_day)
          .where("createdAt", "<=", last_day)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              oneWeekUsers.push({
                id: doc.id,
                date: doc.data().createdAt.toDate(),
                stage: doc.data().stage,
              });
            });
            return;
          })
          .catch((reason) => {
            response.send({ error: reason });
          });
        response.send({
          status: true,
          oneWeekUsers: oneWeekUsers,
          userDetails: userDetails,
          totalUser: user_total_count,
          activeUser: user_active_count,
          inActiveUser: user_total_count - user_active_count,
          newUser: new_user_count,
          guestUser: guest_user_count,
          monthlyUser: month_user_count,
          father: {
            total: father_total_count,
            active: father_active_count,
          },
          mother: {
            total: mother_total_count,
            active: mother_active_count,
          },
          msg: "Data Listed Successfully",
        });
        return true;
        // return false;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
exports.getUserFilterData = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        var rawBody = request.body;
        var limit = parseInt(rawBody.length);
        var offset = parseInt(rawBody.start);
        var userType = rawBody.userType;
        var userStatus = rawBody.userStatus;
        var fromDate = rawBody.fromDate;
        var toDate = rawBody.toDate;
        let db = admin.firestore();
        var query = db.collection("user");
        var query1 = db.collection("user");
        if (userType) {
          console.log("userType", userType);
          query = query.where(userType, "==", true);
          query1 = query1.where(userType, "==", true);
        }
        if (userStatus) {
          console.log("userStatus", userStatus);
          query = query.where("status", "==", "'" + userStatus + "'");
          query1 = query1.where("status", "==", userStatus);
        }
        if (fromDate) {
          fromDate = new Date(fromDate);
          fromDate.setHours(0, 0, 0, 0);
          console.log("from date", fromDate);
          query = query.where("createdAt", ">=", fromDate);
          query1 = query1.where("createdAt", ">=", fromDate);
        }
        if (toDate) {
          toDate = new Date(toDate);
          toDate.setHours(23, 59, 59, 0);
          console.log("toDate date", toDate);
          query = query.where("createdAt", "<=", toDate);
          query1 = query1.where("createdAt", "<=", toDate);
        }
        var stuff = [];
        query1
          .get()
          .then(function (snapshot) {
            var size = snapshot.size;
            return;
          })
          .catch(function (error) {
            response.send({ error: error });
          });
        query
          .get()
          .then(function (snapshot) {
            snapshot.forEach((doc) => {
              var det = doc.data();
              var status = "";
              if (det.status === "active") {
                status =
                  "<a class='btn mb-1 btn-rounded btn-success btn-sm Cs' id='userDetails'>Active</a>";
              } else {
                status =
                  "<a class='btn mb-1 btn-rounded btn-success btn-sm cS' id='userDetails'>Inactive</a>";
              }
              var language = "";
              if (det.lang) {
                language = det.lang;
                if (language === "en") {
                  language = "English";
                }
                if (language === "zh") {
                  language = "Chinese";
                }
                //en zh
              }
              var country = "";
              if (det.country) {
                country = det.country;
                if (country === "my") {
                  country = "Malaysia";
                }
                if (country === "sg") {
                  country = "Singapore";
                }
                if (country === "id") {
                  country = "India";
                }
              }
              var gender = "";
              if (det.gender) {
                if (parseInt(det.gender) === 1) {
                  gender = "Female";
                }
                if (parseInt(det.gender) === 2) {
                  gender = "Male";
                }
              }
              var identity = "";
              if (det.identity) {
                identity = det.identity;
              }
              var referBy = "";
              if (det.referBy) {
                referBy = det.referBy;
              }
              var referralCode = "";
              if (det.referralCode) {
                referralCode = det.referralCode;
              }
              var email = "";
              if (det.email) {
                email = det.email;
              }
              var photoURL = "";
              if (det.photoURL) {
                photoURL = det.photoURL;
              }
              var displayName = "";
              if (det.displayName) {
                displayName = det.displayName;
              }
              var firstName = "";
              if (det.firstName) {
                firstName = det.firstName;
              }
              var lastName = "";
              if (det.lastName) {
                lastName = det.lastName;
              }
              var mobile = "";
              if (det.mobile) {
                mobile = det.mobile;
              }
              var userStatus = "";
              if (det.userStatus) {
                userStatus = det.status;
              }
              //birthday = (det.birthday);
              var createdAt = "";
              var createdAtDT = typeof det.createdAt;
              if (createdAtDT !== "undefined") {
                if (createdAtDT === "object") {
                  var createdAtObj = det.createdAt;
                  if (createdAtObj !== null) {
                    createdAt = format(
                      "dd-MM-yyyy hh:mm:ss",
                      new Date(createdAtObj["_seconds"] * 1000)
                    );
                  }
                }
                if (createdAtDT === "string") {
                  createdAt = det.createdAt;
                }
              }
              var updatedAt = "";
              var updatedAtDT = typeof det.updatedAt;
              if (updatedAtDT !== "undefined") {
                if (updatedAtDT === "object") {
                  var updatedAtObj = det.updatedAt;
                  if (updatedAtObj !== null) {
                    updatedAt = format(
                      "dd-MM-yyyy hh:mm:ss",
                      new Date(updatedAtObj["_seconds"] * 1000)
                    );
                  }
                }
                if (updatedAtDT === "string") {
                  updatedAt = det.updatedAt;
                }
              }
              var newelement = {
                id: doc.id,
                displayName: displayName,
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                lang: language,
                country: country,
                gender: gender,
                identity: identity,
                referral: referBy,
                referralCode: referralCode,
                email: email,
                photoURL: photoURL,
                status: status,
                userStatus: userStatus,
                createdOn: createdAt,
                updatedOn: updatedAt,
              };
              stuff.push(newelement);
            });
            response.send({
              status: true,
              iTotalRecords: size,
              iTotalDisplayRecords: size,
              aaData: stuff,
              msg: "Data Listed Successfully",
            });
            return;
          })
          .catch(function (error) {
            response.send({ error: error });
            return { msg: "error" };
          });
      });
    } catch (error) {
      console.log(error);
      response.send({ data: { status: false } });
      return;
    }
  });
  
  /*
   * exports.addMessage = functions.https.onCall((data, context) => {
  // ...
});
   */
  
  exports.editRolePrivileges = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        console.log(rawBody);
        var details = rawBody.data.dataSet;
        let roleName = rawBody.data.roleName;
        //delete all data in role based menus database
        let db = admin.firestore();
        await db
          .collection("role_based_menus")
          .where("role", "==", roleName)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              db.collection("role_based_menus")
                .doc(doc.id)
                .delete()
                .then(function () {return;})
                .catch(function (error) {
                  console.error("Error removing document: ", error);
                });
            });
            return;
          })
          .catch((error) => {
            // response.send("Error", error);
            return { msg: "error" ,error:error};
          });
        details.forEach(function(item){
          admin.firestore().collection("role_based_menus")
          .doc()
          .set(item)
          .then(function () {
            // response.send({
            //   data: { status: true, msg: "User Privileges successfully!" },
            // });
            return { msg: "User Privileges successfully!" };
          })
          .catch((error) => {
            // response.send("Error", error);
            return { msg: "error" ,error:error};
          });
        });
        response.send({ data: { status: true } });
        return;
      });
    } catch (error) {
      console.log(error);
      response.send({ data: { status: false } });
      return;
    }
  });
  exports.getReferralNumber = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
         try {
            return cors(request, response, async () => {
                let data2 =  JSON.parse(request.rawBody)
            let code = data2.data.code ; 
               console.log("code ",data2);
               let count = 0;
               const collection = 'user';
               var data = [];
                const colRef = admin.firestore().collection(`${collection}`).where('referBy', '==', code);    
                await colRef.get().then((querySnapshot) => {                    
                    if (!querySnapshot.empty) {
                        count = querySnapshot.size;                        
                    }
                    
                     data['count'] = count;
                     console.log("count ",data);
                      response.send({ data: data, count:count}); 
                    return {
                            data: data,
                            count:count
                          }
                }).catch((reason) => {
                    response.send({ error: reason, count:count});
                    return {count:count}
                  });      
                
             
        });
            
        } catch (error) {
        console.log(error);
         
        return{ status: false};
      }
         
});
  exports.getReferralNumberTest = functions.region("asia-northeast1").https.onRequest((request, response) => {
         try {
            return cors(request, response, async () => {
                
                let data = JSON.parse(request.rawBody);
                console.log("getReferralNumberTest")
               
                let  count = 0;  
               // var res = []; var res1 = [];
                
                console.log(data);
                 
                let code = data.code ; 
             
               /* response.send({"data":{"count":code}});   
                    return;
              */
               const colRef = admin.firestore().collection("user").where('referBy', '==', code).get().then((querySnapshot) => {                    
                    if (!querySnapshot.empty) {
                        count = querySnapshot.size;                        
                    }
                   
                    response.send({count:count});   
                    return;
                }).catch((reason) => {
                    response.send({ error: reason, count:count});return ;
                  });   
     
              /*  const colRef = await admin.firestore().collection("user");//.offset(offset).limit(limit);    
                colRef.get().then((querySnapshot) => { 
                    console.log("querySnapshot");
                    if (!querySnapshot.empty) {
                        console.log("Snapshot : ",querySnapshot);
                        count = querySnapshot.size;  
                       // console.log(count);
                        querySnapshot.forEach(doc => {
                            cnt++;
                            
                            var  uid = doc.id;
                            var data = doc.data();
                            
                             var codeUpdate =  "";
                            var referralCodeDT = typeof(data.referralCode);
                            if(referralCodeDT!=="undefined" && data.referralCode !== null){                                
                                code = (data.referralCode).toString();
                                codeUpdate =  code.toUpperCase();
                            }
                            var referBy = referByUpdate = "";
                            var referByDT = typeof(data.referBy);
                             if(referByDT!=="undefined" && data.referBy !== null){
                                referBy = (data.referBy).toString();
                                referByUpdate =  referBy.toUpperCase();
                            }                            
                           
                            
                            
                            
                                    res.push(uid);
                                    
                                    var dataSet = {referralCode : codeUpdate , referBy : referByUpdate};
                                    doc.ref.update(dataSet);
                                    console.log("dataSet : ",dataSet);
                               
                           
                            
                        });
                    }
                    response.send({data: {count:cnt,upd:res1,details:res}});   
                    return;
                }).catch((reason) => {
                    response.send({ error: reason, count:count});
                    return ;
                  });   
                  */
                              
                
            });
        } catch (error) {
        console.log(error);
        response.send({ status: false});
        return;
      }
         
});
 

exports.checkUpperCase = functions.region("asia-northeast1").https.onRequest((request, response) => {
         try {
            return cors(request, response, async () => {
                
                 
                let data = JSON.parse(request.rawBody);
                   
                let code = data.code ; 
                let da = code !== code.toUpperCase();
               console.log(code);
               response.send({data:code,da:da});   
            });
        } catch (error) {
        console.log(error);
        response.send({ status: false});
        return;
      }
         
});


  
/*export const onCreateUser = functions.region("asia-northeast1").firestore.document('user/{user}').onCreate(async (snap, context): Promise<any> => {
      console.log('oncreate', snap)
      // const record = snap.data() || {}
      // console.log('records??', records)
      const uid = context.params.user
      
      let text = '';
      var length = 6;
      
    const possible = 'ABCD123EFGHIJKL567MNPQR678STUVWXYZ789';
    const possibleNmber = '123456789';
    const len = length - 1;

    for (let i = 0; i < (len/2); i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      text += possible.charAt(Math.floor(Math.random() * possibleNmber.length));

    for (let i = 0; i < (len/2); i++)
         text += possible.charAt(Math.floor(Math.random() * possible.length));

      let now = new Date()
      now = new Date(now.toUTCString())
      const ref = admin.firestore().doc('user/' + uid)
      await ref.update({
        createdAt: now,
        referralCode: makeFriendlyRandomCaseInsentitiveAplhaNumeric(10)
      })
      return //wait for retrigger for update
      // await ensureAuthUser(uid, record)
      // return true
    });*/
 

exports.dateList = functions.region("asia-northeast1").https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        //var rawBody = JSON.parse(request.rawBody);
        //var details = rawBody.data;
        var res = [];
        var text = "";
        const possible = 'ABCD123EFGHIJKL567MNPQR678STUVWXYZ789';
        const possibleNmber = '123456789';
        const len = 6 - 1;

        for (let i = 0; i < 2; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

          text += possible.charAt(Math.floor(Math.random() * possibleNmber.length));

        for (let i = 0; i < 3; i++)
             text += possible.charAt(Math.floor(Math.random() * possible.length));
       /* await db.collection("user").get().then(snapshot => {
            snapshot.forEach(doc => {
                
               var birthday = "";
               var birthdayDT = typeof(doc.data().birthday);
                if(birthdayDT!=="undefined"){
                    if(birthdayDT === "object"){
                        var birthdayObj = (doc.data().birthday);
                        if(birthdayObj !== null){
                            birthday = format('dd-MM-yyyy', new Date(birthdayObj['_seconds'] * 1000));
                        }
                    }
                    if(birthdayDT === 'string'){
                        birthday = (doc.data().birthday);
                    } 
               }
               
                
               
               res.push([birthdayDT,birthday]);
               
           })
            response.send({data: { status: true, msg: "Event added successfully!",details:res }});
         return true;
       }).catch(error => {
            response.send("Error", error);
            return { msg: "error" };
          });*/
        response.send({data: { status: true, msg: "text Listed successfully!",details:text }});
         return true;
       
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
        
        
        
        
exports.addEvent = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      //collection
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        var details = rawBody.data;
        await db
          .collection("events")
          .doc()
          .set(details)
          .then(function() {
            console.log("Event successfully written!");
            response.send({
              data: { status: true, msg: "Event added successfully!" }
            });
            return { msg: "Event added successfully!" };
          })
          .catch(error => {
            response.send("Error", error);
            return { msg: "error" };
          });
        response.send({
          data: { status: true, msg: "Event added successfully" }
        });
        return true;
        // return false;
      });
    } catch (error) {
      response.send("Error", error);
      return false;
    }
  });
  exports.editEvent = functions.region("asia-northeast1").https.onRequest((request, response) => {
  try {
    return cors(request, response, async () => {
      var rawBody = JSON.parse(request.rawBody);
      var details = rawBody.data.dataSet;
      let uid = rawBody.data.uid;
      let db = admin.firestore();
      await db
        .collection("events")
        .doc(uid)
        .update(details)
        .then(function() {
          console.log("Event Updated successfully!");
          response.send({
            data: { status: true, msg: "Event updated successfully!" }
          });
          return { msg: "Event updated successfully!" };
        })
        .catch(error => {
          response.send("Error", error);
          return { msg: "error" };
        });
      console.log("Event successfully written!");
      response.send({ data: { status: true, dataSet: details.category } });
      return;
    });
  } catch (error) {
    console.log(error);
    response.send({ data: { status: false } });
    return;
  }
});
exports.editRole = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    try {
      return cors(request, response, async () => {
        var rawBody = JSON.parse(request.rawBody);
        var details = rawBody.data.dataSet;
        let uid = rawBody.data.uid;
        let db = admin.firestore();
        await db
          .collection("user_roles")
          .doc(uid)
          .update(details)
          .then(function () {
            console.log("Role Updated successfully!");
            response.send({
              data: { status: true, msg: "Role updated successfully!" },
            });
            return { msg: "Role updated successfully!" };
          })
          .catch((error) => {
            response.send("Error", error);
            return { msg: "error" };
          });
        console.log("Role successfully written!");
        response.send({ data: { status: true, dataSet: details.category } });
        return;
      });
    } catch (error) {
      console.log(error);
      response.send({ data: { status: false } });
      return;
    }
  });
  exports.getEventsList = functions.region("asia-northeast1").https.onRequest((request, response) => {
  try {
    //collection
    return cors(request, response, async () => {
      var db = admin.firestore();
      let data = request.body;
      var limit = parseInt(data.length);
      var offset = parseInt(data.start);
      const datas = [];
      var size = 0;
      await db
        .collection("events")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            size = snapshot.size;
          });
          return;
        })
        .catch(reason => {
          response.send({
            error: reason
          });
        });
      await db
        .collection("events")
        .offset(offset)
        .limit(limit)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            var det = doc.data();
            var name = "";
            var is_multiple = "";
            var status = "";
            var point;
            if (det.name) {
              name = det.name;
            }
            if (det.is_multiple) {
              is_multiple = det.is_multiple;
            }
            if (det.status) {
              status = det.status;
            }
            if (det.point) {
              point = det.point;
            }
            var outElement = {
              id: doc.id,
              name: name,
              is_multiple: is_multiple,
              status: status,
              point: point
            };
            datas.push(outElement);
          });
          response.send({
            status: true,
            aaData: datas,
            iTotalRecords: size,
            iTotalDisplayRecords: size,
            msg: "Hello from Firebase!"
          });
          return;
        })
        .catch(function(error) {
          response.send({ error: error, status: "false could not found" });
        });
      return { msg: "Hello from Firebase!" };
    });
  } catch (error) {
    response.send("Error", error);
  }
});
exports.postTestApi = functions.region('asia-northeast1').https.onRequest((request, response) => {     
    try{//collection
        return cors(request, response, async () => {   
            var timestamp = admin.firestore.Timestamp.now(); 
            var createdAt = c = d = n = "";
               var createdAtDT = typeof(timestamp);
                if(createdAtDT!=="undefined"){
                    if(createdAtDT === "object"){
                        var createdAtObj = (timestamp);
                        if(createdAtObj !== null){
                            createdAt = format('dd-MM-yyyy hh:mm:ss', new Date(createdAtObj['_seconds'] * 1000));
                            var utc = createdAtObj['_seconds'];//createdAtObj;1594795835
                            //console.log(createdAtObj['_seconds']);
                            n = moment.unix( utc ).format('DD-MM-YYYY HH:mm:ss');
                            c = moment.unix( utc ).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
                            d = moment.unix( utc ).tz('Asia/Singapore').format('DD-MM-YYYY HH:mm:ss');
                        }
                    }
               }
            response.send({data: { status: true, timestamp:timestamp,server : createdAt, Normal : d , Kolkata : c , Singapore : d }});//,toDate : timestamp.toDate()
         return true;
            
    })
    }catch(error){
         response.send("Error",error);
    }
});



exports.deleteArticleDetails = functions.region('asia-northeast1').https.onRequest((request, response) => {
     try {
        return cors(request, response, async () => {
            var rawBody = JSON.parse(request.rawBody); 
            var details = rawBody.data;
            
            var typesIds = details.typeIds; 
            var docId = details.docId; 
            var path = "/knowledge_type/"+typesIds.replace(":", "/knowledge_type/")+"/knowledge/";
            console.log("rawBody :",path);
            if(path !== "" && docId !== "" ){
                //var docId = details.docId;
                //let db = admin.firestore();            
                //let collectionRef = db.collection(path).doc(docId).delete();
                response.send({data:{status:true,details:path } });
                return; 
            }else{
                response.send({data:{status:false,details:"some data missing" } });
                return;
            }
  
        })
     }catch(error){
         console.log(error);
         response.send({data:{status:false} });
                return;
     }
 });  
    