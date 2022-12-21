const express = require("express");
const router = express.Router();
const model = require("../DB/Services");
const login = require("../DB/login");
const holi = require("../DB/holiday");
const poolser = require("../DB/poolser");
const ID = require("nodejs-unique-numeric-id-generator");

router.get("/windowlist", async (req, res) => {
  // let user = new User(req.body);
  // let result = await user.save();
  // result = result.toObject();
  // delete result.password;
  //res.status(500).json({ meaaage: Error });
  let win = await model.find({}).select("windo_no");
  //console.log(win)
  res.send(win);
});

router.get("/servicelist/:wid", async (req, res) => {
  const wid = req.params.wid;
  let win = await model.find({ windo_no: wid }).select("services");

  res.send(win);
});

//**** */make new window
router.post("/windo", async (req, res) => {
  const id = req.body.windo_no;
  //    let Model = new model({"windo_no":"2"});
  console.log(id);
  let Model = new model({ windo_no: id });
  const result = await Model.save();
  res.send("hello from wino");
});

//****login */
router.post("/login", async (req, res) => {
  const password1 = req.body.password;
  const username1 = req.body.username;
  const phone1 = req.body.phone;
  console.log(req.body, password1, username1, phone1);

  let login1 = new login({
    password: password1,
    username: username1,
    phone: phone1,
  });
  let result = await login1.save();
  console.log(result);
  res.status(201).send("done");
});

router.get("/signup", async (req, res) => {
  const password1 = req.body.password;
  const username1 = req.body.username;
  const phone1 = req.phone;

  let result = await login.findOne({
    username: username1,
    password: password1,
  });
  if (result) {
    console.log(result);
    console.log(password1);
    res.status(201).send("password ready che");
  } else {
    res.status(500).send("wronge credential");
  }
});

//****holiday declaration */
router.post("/holiday", async (req, res) => {
  const holi_date1 = req.body.holi_date;
  const holi_reason1 = req.body.holi_reason;

  console.log(req.body);

  let holi1 = new holi({ holi_date: holi_date1, holi_reason: holi_reason1 });
  let result = await holi1.save();
  console.log(result);
  res.status(201).send(" holiday inserted done");
});

//********************* services */

//*->insert services in given window
router.post("/addses/:no", async (req, res) => {
  const id = req.params.no;
  const sid = req.body.services.services_id;
  console.log(id);
  let result = await model.updateOne(
    { windo_no: id },
    {
      $push: { services: req.body.services },
    }
  );
  //update it in pool services
  let result2 = await poolser.updateOne(
    { s_no: sid },
    {
      $push: { winows_id: id },
    }
  );
  res.status(201).send();
});

//*->delete services in given window
router.post("/addses/:no/:sid", async (req, res) => {
  const id = req.params.no;
  const sid = req.params.sno;
  console.log(id);
  let result = await model.deleteOne(
    { windo_no: id, services_id: sid }
    //what is del....
  );
  //update it in pool services
  let result2 = await poolser.deleteOne({ s_no: sid, winows_id: id });
  res.status(201).send();
});

//***perticular window ma perticular servecies no time change karwa */
router.post("/addses/:wid/:sid", async (req, res) => {
  console.log("result");
  const wid = req.params.wid;
  const sid = req.params.sid;
  const time = req.body.services_time;
  console.log(wid, sid, time);
  let result = await model.findOneAndUpdate(
    { windo_no: wid },
    { $set: { "services.$[elem].services_time": time } },
    { new: true, arrayFilters: [{ "elem.services_id": sid }] }
  );
  console.log({ result });
  res.status(201).send();
});

// for add date regularly and set current_time=starttime
router.post("/adddate", async (req, res) => {
  let result = await model.updateMany(
    {},
    {
      $push: { date: { date: "2022-06-10" } },
    }
  );
  let result2 = await model.updateMany({}, [
    { $set: { "time.current_time": "$time.start_time" } },
  ]);

  res.status(201).send(result2);
  //holiday check
});

// ????????????????????????????????????????????????????get token id
router.get("/gtoken/:sid/:slot", async (req, res) => {
  // //holiday
  var ndate = new Date();
  const fdate = `${ndate.getUTCFullYear()}-${ndate.getUTCMonth()}-${ndate.getUTCDate()} 14:48 UTC`;
  var today = new Date(fdate);
  console.log(typeof today.toISOString().slice(0, 10));
  const date = today.toISOString().slice(0, 10);
  let result = await holi.find({ holi_date: date });
 // console.log(result[0])
 if(result[0]){console.log("done")}
  if ((result[0])) {
    res.status(500).send("it's holiday");
  } 
  else {
    //get window no ,things to bring,services
    const sid = req.params.sid;
    const slot = req.params.slot;
    let windowslist = await poolser.find({ s_no: sid });
    console.log(windowslist[0].winows_id)
  

    

if(slot==1){
  var finalwindow = await model
      .findOne({
        windo_no: { $in: windowslist[0].winows_id },
 //       "time.end_time.hours": { $gte: "$time.current_time.hours" },
        $expr:{$gt:["$time1.end_time.hours", "$time1.current_time.hours"]}
      })
      .select("windo_no");
      console.log(finalwindow)
}
else if(slot==2){var finalwindow = await model
  .findOne({
    windo_no: { $in: windowslist[0].winows_id },
//       "time.end_time.hours": { $gte: "$time.current_time.hours" },
    $expr:{$gt:["$time2.end_time.hours", "$time2.current_time.hours"]}
  })
  .select("windo_no");
  console.log(finalwindow)
}
else {
  var finalwindow = await model
      .findOne({
        windo_no: { $in: windowslist[0].winows_id },
 //       "time.end_time.hours": { $gte: "$time.current_time.hours" },
        $expr:{$gt:["$time3.end_time.hours", "$time3.current_time.hours"]}
      })
      .select("windo_no");
      console.log(finalwindow.windo_no)
}



    if (finalwindow !== null) {
      const m_no = req.body.m_number;
      const tokenid = ID.generate(new Date().toJSON());

      let timeupdate = await model
        .find({ 
          windo_no: finalwindow.windo_no, 
        "services.services_id": sid 
        }
    //  ,{new: true, arrayFilters: [{ "services.services_id": sid }] }
        )
      
        if(slot==1){ 
          var hour = timeupdate[0].time1.current_time.hours;
          var minutes = timeupdate[0].time1.current_time.minutes;
          var postminutes=minutes
          var posthour=hour}
        else if(slot==2){ var hour = timeupdate[0].time2.current_time.hours;
          var minutes = timeupdate[0].time2.current_time.minutes;
          var postminutes=minutes
          var posthour=hour}
        else{ var hour = timeupdate[0].time3.current_time.hours;
          var minutes = timeupdate[0].time3.current_time.minutes;
          var postminutes=minutes
          var posthour=hour}
     

      let services_time =5
   
      // timeupdate.services_time;
      console.log(hour)

    
//       //add into db
      let finalresult = await model.findOneAndUpdate(
        { windo_no: finalwindow.windo_no, "date.date": "2022-09-09" },
        {
          $push: {
            // "date.allocation.allocated_time.hours": hour,
            // "date.allocation.allocated_time.hours": hour,
            "date.$[elem].allocation": {"tokenid": tokenid,"m_number": m_no,"allocated_time.hours":hour,"allocated_time.minutes":minutes,"services_id":sid},
           // "date.$[elem].allocation.m_number": m_no,
            // "date.$[elem].allocation": {sid,hour,minutes},
            // "date.$[elem].allocation": {hour,minutes},
            // "date.$[elem].allocation": {minutes},
            // "date.allocation.m_number": m_no,
            // "date.allocation.services_id": sid,
            // "date.allocation.allocated_time.hours": hour,
            // "date.allocation.allocated_time.minutes": minutes,
          },
         
        }, { new: true, arrayFilters: [{ "elem.date": "2022-09-09" }] }
      );

      if (minutes + services_time > 59) {
        hour = hour + 1;
        minutes = minutes + services_time - 60;
      } else {
        minutes = minutes + services_time;
      }
      console.log(finalresult)



if(slot==1){ let timeupdate2 = await model.findOneAndUpdate(
  { windo_no: finalwindow.windo_no, 
//       "services.services_id": sid 
  },
  {
    $set: {
      "time1.current_time.hours": hour,
      "time1.current_time.minutes": minutes,
    },
  }
);}
else if (slot==2){ let timeupdate2 = await model.findOneAndUpdate(
  { windo_no: finalwindow.windo_no, 
//       "services.services_id": sid 
  },
  {
    $set: {
      "time2.current_time.hours": hour,
      "time2.current_time.minutes": minutes,
    },
  }
);}
else{ let timeupdate2 = await model.findOneAndUpdate(
  { windo_no: finalwindow.windo_no, 
//       "services.services_id": sid 
  },
  {
    $set: {
      "time3.current_time.hours": hour,
      "time3.current_time.minutes": minutes,
    },
  }
);}



  //     let timeupdate2 = await model.findOneAndUpdate(
  //       { windo_no: finalwindow.windo_no, 
  //  //       "services.services_id": sid 
  //       },
  //       {
  //         $set: {
  //           "time1.current_time.hours": hour,
  //           "time1.current_time.minutes": minutes,
  //         },
  //       }
  //     );
      res.status(201).send({'tokenid':tokenid,"minutes":postminutes,"hours":posthour,"bring":windowslist[0].s_bring,"sname":windowslist[0].s_name,"windono":finalwindow.windo_no});
    }
    else{
      res.status(500).send("token is not available");}
  }
});

//sum
//add

//where

//****get services for user side which have 1 or more window */
router.get("/poolclient", async (req, res) => {
  let result = await poolser.find({
    winows_id: { $exists: true, $not: { $size: 0 } },
  }).select("s_name");
  res.status(201).send(result);
 
  var result2= result.filter(result => {
    //return result.s_name
    console.log(result.s_name)
  })

  
});

// get servicesfor admin//window wise services
//name,sno ,bring,windows,give all
router.get("/poolclient", async (req, res) => {
  let result = await poolser.find();
  res.status(201).send(result);
  
});

//**post add servicesinto pool */
router.post("/addpool", async (req, res) => {
  //name,number and what to bring
  let result = new poolser(req.body);
  let added = await result.save();
  res.status(201).send(added);
});


//*** add or change window time and window */
router.post("/wtime/:wid", async (req, res) => {
  const wid = req.params.wid;
  const st = req.body.start_time;
  const ct = req.body.current_time;
  const et = req.body.end_time;
  let result = await model.updateOne(
    { windo_no: wid },
    {$set: {
        "time2.start_time.hours": st.hours,
        "time2.start_time.minutes": st.minutes,
        "time2.end_time.hours": et.hours,
        "time2.end_time.minutes": et.minutes,
        "time2.current_time.hours": ct.hours,
        "time2.current_time.minutes": ct.minutes,
      },
    }
  );
  console.log(result)
});


//***get details of users*/
router.get("/wtime/:wid", async (req, res) => {
  let wid = req.params.wid;
  var ndate = new Date();
  const fdate = `${ndate.getUTCFullYear()}-${ndate.getUTCMonth()}-${ndate.getUTCDate()} 14:48 UTC`;
  var today = new Date(fdate);
  console.log(typeof today.toISOString().slice(0, 10));
  const date = today.toISOString().slice(0, 10);
  // let result = await model.find({ $and:[{windo_no: wid},{}]})
 // let result = await model.find({ windo_no: wid,}).select("date");
 console.log(wid)
  let result = await model.aggregate([
    {
      $match: {
        windo_no: 2,
      }
    },
    {
      $unwind: '$date'
    },
    {
      $match: {
        'date.date': "2022-09-09"
      }
    }
  ]);
  res.send(result);
});

module.exports = router;