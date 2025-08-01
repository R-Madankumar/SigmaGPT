import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js"

const router = express.Router();

// test
router.post("/test", async(req,res)=>{
    try{
        const thread = new Thread({
            threadId:"abc",
            title:"testing Thread 2",
        });
        const response = await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to save in DB"});
    }
})

//Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({
      updatedAt: -1
    });
    //descending order of updatedAt...most recent data on top
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to fetch threads"
    });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const {threadId} = req.params;

  try {
    let thread = await Thread.findOne({threadId});

    if (!thread) {
      res.status(404).json({
        error: "Thread not found"
      });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({error: "Failed to fetch chat"});
  }
});


router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;
    try{
        const deletedThread=await Thread.findOneAndDelete({threadId});

        if(!deletedThread){
            res.status(404).json({error:"Thread not found"});
        }

        res.status(200).json({success:"Thread deleted successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({erro:"Failed to delete thread"})
    }
})




router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({
      error: "Missing required fields"
    });
  }

  try {
    let existingThread = await Thread.findOne({ threadId });

    if (!existingThread) {
      existingThread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }]
      });
    } else {
      existingThread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);

    existingThread.messages.push({ role: "model", content: assistantReply });
    existingThread.updatedAt = new Date();

    await existingThread.save();
    res.json({ reply: assistantReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong"
    });
  }
});


export default router;  