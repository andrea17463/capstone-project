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
                attributes: ['id', 'username'],
                limit: 6
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
                    // user_1_id: 1,
                    // user_2_id: 2,
                    user_1_id: user1.id,
                    user_2_id: user2.id,
                    traitName: 'Casual Talker',
                    traitDescription: 'Their idea of a deep conversation is about what\'s for lunch.',
                    interactionType: 'guessing',
                    guessedValue: 'Philosophical',
                    isCorrect: false,
                    // user_id: 1,
                    user_id: user1.id,
                    promptText: 'What made you choose that card?',
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    // user_1_id: 2,
                    // user_2_id: 3,
                    user_1_id: user2.id,
                    user_2_id: user3.id,
                    traitName: 'Talks About Feelings',
                    traitDescription: 'Has a mental breakdown over a TV commercial but refuses to talk about it until later.',
                    interactionType: 'roasts',
                    guessedValue: 'Talks About Feelings',
                    isCorrect: true,
                    // user_id: 3,
                    user_id: user3.id,
                    promptText: 'Aw, cute. You guessed me right. Finally, someone gets me… kind of.',
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    // user_1_id: 3,
                    // user_2_id: 4,
                    user_1_id: user3.id,
                    user_2_id: user4.id,
                    traitName: 'Spicy food lover',
                    traitDescription: 'Their taste buds are basically fireproof.',
                    interactionType: 'guessing',
                    guessedValue: 'Mild food lover',
                    isCorrect: false,
                    // user_id: 4,
                    user_id: user4.id,
                    promptText: 'What made you choose that card?',
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    // user_1_id: 5,
                    // user_2_id: 6,
                    user_1_id: user5.id,
                    user_2_id: user6.id,
                    traitName: 'Sarcastic',
                    traitDescription: 'Their sincerity setting is permanently broken.',
                    interactionType: 'guessing',
                    guessedValue: 'Sarcastic',
                    isCorrect: true,
                    // user_id: 5,
                    user_id: user5.id,
                    promptText: 'Have people told you this about yourself before?',
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                // ], {});
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
                // }, {});
            }, {});
        } catch (error) {
            console.log('Error in game plays seeder down method:', error.message);
        }
    }
};