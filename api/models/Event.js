import mongoose , { Schema} from 'mongoose';

const EventShema = new Schema({
  name: { type : String , required : true},
  start: { type : Date , required : true},
  end: { type : Date , required : true},
  event_type: { type : String , required : true , enum : ['virtual' , 'location'] , default : 'virtual'},
  location: { type : String },
  meeting_link: { type : String },
  description: { type : String },
  unlimited_capacity: { type : Boolean , default : true},
  capacity: {type : Number , default : 50},
  require_approval: { type : Boolean , default : false} ,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Event = mongoose.model('Event', EventShema);
export default Event