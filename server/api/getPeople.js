const getPeople = async (user, db) => {
    const [rows, fields] = await db.execute('SELECT * FROM user ' +
        'WHERE user_id NOT IN (SELECT swipee FROM user_swiped_left_on WHERE swiper = ?) \n' +
        'AND user_id NOT IN (SELECT swipee FROM user_swiped_right_on WHERE swiper = ?) \n' +
        'AND user_id <> ? \n' +
        'AND (? = -1 OR gender = ? OR gender = 2) \n' +
        'AND (gender_preference = -1 OR gender_preference = ? OR ? = 2 )', [user.user_id, user.user_id, user.user_id,
        user.gender_preference, user.gender_preference, user.gender, user.gender])

    for (let i = 0; i < rows.length; i++) {
        const [interests, fields] = await db.execute("SELECT interest FROM user_interests WHERE user_id = ?", [rows[i].user_id])
        rows[i].interests = interests
    }
    return rows
}

async function getMatchedUsers(user_id, db) {
    const [rows, fields] = await db.execute('select swipee from user_swiped_right_on where swiper = ?' +
        ' and swipee in (select swiper from user_swiped_right_on where swipee = ?)',
        [user_id, user_id])
    const matchedUsers = []
    for (let i = 0; i < rows.length; ++i) {
        const [users] = await db.execute('select * from user where user_id = ?', [rows[i].swipee])
        delete users[0].password
        matchedUsers.push(users[0])
    }
    return matchedUsers;
}

module.exports = {getPeople, getMatchedUsers}
