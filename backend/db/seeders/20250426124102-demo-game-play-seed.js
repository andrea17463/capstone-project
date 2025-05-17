'use strict';

const { User, GamePlay } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'username']
            });

            if (users.length < 6) {
                console.error('Not enough users found in the database for seeding game plays');
                return;
            }

            const user1 = users[0];
            const user2 = users[1];
            const user3 = users[2];
            const user4 = users[3];
            const user5 = users[4];
            const user6 = users[5];

            await GamePlay.bulkCreate([
                {
                    user_1_id: user1.id,
                    user_2_id: user2.id,
                    traitCategory: 'Conversation Style and Humor',
                    traitName: 'Casual Talker',
                    interactionType: 'guessing',
                    guessedValue: null,
                    isCorrect: null,
                    user_id: user1.id,
                    status: 'active',
                    // gamePlayId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    user_1_id: user2.id,
                    user_2_id: user3.id,
                    traitCategory: 'Conversation Style and Humor',
                    traitName: 'Talks About Feelings',
                    interactionType: 'roasts',
                    guessedValue: null,
                    isCorrect: null,
                    user_id: user3.id,
                    status: 'active',
                    // gamePlayId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    user_1_id: user3.id,
                    user_2_id: user4.id,
                    traitCategory: 'Food and Drink Preferences',
                    traitName: 'Spicy food lover',
                    interactionType: 'guessing',
                    guessedValue: null,
                    isCorrect: null,
                    user_id: user4.id,
                    status: 'active',
                    // gamePlayId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    user_1_id: user5.id,
                    user_2_id: user6.id,
                    traitCategory: 'Conversation Style and Humor',
                    traitName: 'Sarcastic',
                    interactionType: 'guessing',
                    guessedValue: null,
                    isCorrect: null,
                    user_id: user5.id,
                    status: 'active',
                    // gamePlayId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ], { validate: true });
        } catch (error) {
            console.error('Error seeding game plays:', error);
        }
    },

    async down(queryInterface, Sequelize) {
        options.tableName = 'GamePlays';
        try {
            if (process.env.NODE_ENV === 'production') {
                const tableExists = await queryInterface.sequelize.query(
                    `SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = '${process.env.SCHEMA}'
                    AND table_name = 'GamePlays'
                  );`,
                    { type: Sequelize.QueryTypes.SELECT }
                );

                if (!tableExists[0].exists) {
                    console.log('GamePlays table does not exist, skipping deletion');
                    return;
                }
            }

            const Op = Sequelize.Op;
            return queryInterface.bulkDelete(options, {
                [Op.or]: [
                    { traitName: 'Casual Talker' },
                    { traitName: 'Talks About Feelings' },
                    { traitName: 'Spicy food lover' },
                    { traitName: 'Sarcastic' }
                ]
            }, {});
        } catch (error) {
            console.log('Error in game plays seeder down method:', error.message);
        }
    }
};