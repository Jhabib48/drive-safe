import  express from "express";
import bodyParser from "body-parser";
import cors from 'cors'; 
import { User } from "./model/user.js";
import { Rental } from "./model/rent.js";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 
app.use(cors());
// app.use(express.static("public"));

const port = process.env.PORT || 5000; 
app.set("port", port);

const url = `mongodb://localhost:27017/usersDb`;

///////STORING RENTAL TIME//////////////
app.post("/api/addReservation", async (req, res)=>{
    try{

        const{location, pickUpDate, dropOfDate, pickUpTime, dropOfTime, contactNumber} = req.body; 
        const reservation = new Rental({location, pickUpDate, dropOfDate, pickUpTime, dropOfTime, contactNumber});
        
        await mongoose.connect(url); 
        try{
            const savedReso = await reservation.save(); 
            console.log(`Document saved successfully`); 
            res.send(JSON.stringify(savedReso));
        }
        catch(error){
            console.log(`Error while: ${error}`)
        }
        finally{
            mongoose.disconnect(); 
        }

    }
    catch(error){
        console.log(`Error while connecting to database: ${error}`);
    }
})



////////////////////////FOR STORING USER///////////////////////
//Get all user from mongo
app.get("/api/getAllUsers", async(req, res)=>{

    try{

        await mongoose.connect(url); 
        console.log("Connected to database");

        try{
            //all the users in the database
            const data = await User.find(); 
            res.send(JSON.stringify(data)); 
            mongoose.disconnect(); 
        }
        catch(error){
            console.log(`Error while connecting to database: ${error}`);
            res.send(`Error while finding: ${error}`);
        }

    }
    catch(error){
        console.log(`Error whiling conneceting to database FOR GETTING ALL USERS: ${error}`);
    }
})

app.get("/api/getAllUsers/:id", async(req, res)=>{

    try{

        let _id = (req.params.id).trim();
        _id = new mongoose.Types.ObjectId(_id);

        await mongoose.connect(url); 
        console.log("Connected to database");
        try{
            const user = await User.findOne({_id});
            console.log(`Found User: ${user}`);
            res.send(user);
            mongoose.connection.close();
        }
        catch(error){
            console.log(`ERROR in finding: ${error}`);
            res.send(`ERROR in finding: ${error}`)
        }

    }
    catch(error){
        console.log(`Error while connecting to database FOR SPECFIC USER: ${error}`);
    }

})

//add user to mongo
app.post("/api/addUser", async (req, res)=>{
    
    try{
        //create new user 
        const { firstName, lastName, email, password } = req.body; 
        console.log(firstName, lastName, email, password);

        const user = new User({firstName, lastName, email, password});

        //connect to moogonse 
        await mongoose.connect(url); 
        console.log("Connected to database");

        try{
            const createUser = await user.save(); 
            console.log(`Document saved successfully.`);
            res.send(createUser);
            mongoose.disconnect(); 
        }
        catch(error){
            console.log(`Error while CREATING User: ${error}`);
        }
   
    }
    catch(error){
        console.log(`Error while connecting to database FOR ADDING NEW USER: ${error}`);
    }
});

//Deleting From Database
app.delete("/api/delete/:id", async (req, res)=>{

    try{

        let _id = req.params.id; 
        _id = new mongoose.Types.ObjectId(_id);

        await mongoose.connect(url); 
        console.log("Connected to database");
        const filter = {_id}; 

        try{

            const result = await User.deleteOne(filter);
            if(result.deletedCount === 1){
                console.log(`Successfully deleted ${result.deletedCount} from database`);
                res.send(`Successfully deleted ${result.deletedCount} from database`);
            }else{
                console.log(`Could not find data to delete`);
                res.send(`Could not find data to delete`);
            }

        }
        catch(error){
            console.log(`Error while DELETING from database: ${error}`);
        }
        finally{
            mongoose.disconnect(); 
        }
    }
    catch(error){
        console.log(`Error while Connecting to database FOR DELETING USER: ${error}`);
    }

});

//Updating user
app.put("/api/updateUser/:id", async (req, res)=>{
    try{

        //get id
        let _id = (req.params.id).trim();
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send("Invalid ID format");
          }        _id = new mongoose.Types.ObjectId(_id);
        
        //create new user
        console.log(_id);
        const {firstName, lastName, email, password} = req.body; 
        const update = {firstName, lastName, email, password};

        await mongoose.connect(url); 
        console.log("Connected to database");
        
        try{
            const updatedUser = await User.findByIdAndUpdate({_id}, update, {new: true})
            if(updatedUser){
                res.send(updatedUser);
            }else{
                console.log("No Matching data was found");
                res.send("No Matching data was found");
            }
            mongoose.disconnect(); 
        }
        catch(error){
            console.log(`ERROR in Updating: ${error}`);
            res.send(`ERROR in Updating: ${error}`)        
        }
    
    }
    catch(error){
        console.log(`Error while connecting to database FOR UPDATING USER: ${error}`);
    }
});


app.listen(port, ()=>{
    console.log(`The server is listening on Port ${port}`);
});
