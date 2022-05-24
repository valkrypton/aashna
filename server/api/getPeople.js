const getPeople = async (user, db) => {
     const [rows,fields] = await db.execute('SELECT * FROM user ' +
         'WHERE user_id NOT IN (SELECT swipee FROM user_swiped_left_on WHERE swiper = ?) \n' +
         'AND user_id NOT IN (SELECT swipee FROM user_swiped_right_on WHERE swiper = ?) \n' +
         'AND user_id <> ? \n' +
         'AND (? = -1 OR gender = ? OR gender = 2) \n' +
         'AND (gender_preference = -1 OR gender_preference = ? OR ? = 2 )', [user.user_id, user.user_id, user.user_id,
        user.gender_preference, user.gender_preference, user.gender, user.gender])

    for(let i = 0; i < rows.length; i++){
        const [interests, fields] = await db.execute("SELECT interest FROM user_interests WHERE user_id = ?",[rows[i].user_id])
        rows[i].interests = interests
    }
    return rows
}
module.exports = getPeople
