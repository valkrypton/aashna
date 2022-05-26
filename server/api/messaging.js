const retrieve_messages = async (sender, receiver, db) => {
    try {
        const [rows, fields] = await db.execute("SELECT * " +
            "                                    FROM msgs" +
            "                                    WHERE (sender = ? AND reciever = ?) " +
            "                                    OR (sender = ? AND reciever = ?) " +
            "                                    ORDER BY timestamp ASC",
                                                 [sender, receiver, receiver, sender]);
        return rows;
    }
    catch (err){
        console.log(err)
        return false;
    }
}

const log_message = async (sender, receiver, message, db) => {
    try{
        return await db.execute("INSERT INTO msgs VALUES(null, ?, ?, ?, ?)", [sender, receiver, message, new Date()]);
    }
    catch (err){
        return false;
    }
}

const get_last_message = async (sender, receiver, db) => {
    try{
        [rows, fields] = await db.execute("SELECT * FROM msgs WHERE (sender = ? AND reciever = ?) OR (sender = ? AND reciever = ?) ORDER BY timestamp DESC LIMIT 1",[sender, receiver, receiver, sender]);
        return rows;
    }
    catch (err){
        console.log(err);
        return false;
    }
}
module.exports = {retrieve_messages, log_message, get_last_message};