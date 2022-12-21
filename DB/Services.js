const mongoose = require('mongoose');
const service=new mongoose.Schema({
        services_id:Number,
        services_name:String,
        services_time:Number,
        
})

const winSchema = new mongoose.Schema( {
    windo_no:Number,

    services:[service],



    time1:{
        start_time:  {hours: {
            type: Number, min: 0, max: 23
          },
         minutes: {
            type: Number,  min: 0, max: 59
          }
         },

        current_time:  {hours: {
            type: Number,  min: 0, max: 23
        },
        minutes: {
            type: Number,  min: 0, max: 59
        }},
        
        end_time:  {hours: {
            type: Number,  min: 0, max: 23
        },
        minutes: {
            type: Number,  min: 0, max: 59
        }},
   
    },
    time2:{
        start_time:  {hours: {
            type: Number, min: 0, max: 23
          },
         minutes: {
            type: Number,  min: 0, max: 59
          }
         },

        current_time:  {hours: {
            type: Number,  min: 0, max: 23
        },
        minutes: {
            type: Number,  min: 0, max: 59
        }},
        
        end_time:  {hours: {
            type: Number,  min: 0, max: 23
        },
        minutes: {
            type: Number,  min: 0, max: 59
        }},
   
    },
    time3:{
        start_time:  {hours: {
            type: Number, min: 0, max: 23
          },
         minutes: {
            type: Number,  min: 0, max: 59
          }
         },

        current_time:  {hours: {
            type: Number,  min: 0, max: 23
        },
        minutes: {
            type: Number,  min: 0, max: 59
        }},
        
        end_time:  {hours: {
            type: Number,  min: 0, max: 23
        },
        minutes: {
            type: Number,  min: 0, max: 59
        }},
   
    },

    date:[{
        date:String ,
        holiday:Boolean,
        allocation:[{
            tokenid:Number,
            compelte:{
                type: Boolean,
                default: false
            },
            m_number:Number,
            services_id:Number,
            allocated_time:{hours: {
                type: Number,  min: 0, max: 23
            },
            minutes: {
                type: Number, min: 0, max: 59
            }},

        }]
    




    }]

});

module.exports = mongoose.model('Window', winSchema)