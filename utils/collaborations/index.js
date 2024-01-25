const { notes } = require("../../models/notes")

const handleCollaboration = (socketInstance) => {
    socketInstance.on("connection", socket => {
        socket.on("get-note-content", async (note_id) => {
            const note = await notes.findById(note_id);
            socket.join(note_id);
            socket.emit("load-note-content", {data: JSON.parse(note?.data), title: note?.title})

            socket.on('send-note-changes', (note_data) => {
                socket.broadcast.to(note_id).emit("receive-note-changes", note_data)
            })
    
            // socket.on("save-note-changes", async (note_data) => {
            //     console.log(note_data, note_id)
            //     // await notes.findByIdAndUpdate(note_id, { data: note_data })
            // })
        })


      
    })
}

module.exports = {handleCollaboration}