const leftSwipe = async (swiper, swipee, db) => {
    await db.execute("INSERT INTO user_swiped_left_on VALUES(?, ?, ?)", [swiper, swipee, new Date()])
    return true;
}

const rightSwipe = async (swiper, swipee, db) => {
    await db.execute("INSERT INTO user_swiped_right_on VALUES(?, ?, ?)", [swiper, swipee, new Date()])
    return true;
}

module.exports = {leftSwipe, rightSwipe};
