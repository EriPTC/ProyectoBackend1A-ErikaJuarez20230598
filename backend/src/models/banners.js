import {Schema, model} from "mongoose"

const bannerSchema = new Schema({
    title: {type: String},
    subtitle: {type: String},
    image: {type: String},
    public_id: {type: String}
}, 
{
    timestamps: true,
    strict: false
})

export default model("Banners", bannerSchema)