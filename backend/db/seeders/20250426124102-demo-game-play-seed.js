'use strict';

const { GamePlay } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await GamePlay.bulkCreate([
            {
                user_1_id: 1,
                user_2_id: 2,
                traitName: 'Casual Talker',
                traitDescription: 'Their idea of a deep conversation is about what\'s for lunch.',
                interactionType: 'guessing',
                guessedValue: 'Philosophical',
                isCorrect: false,
                user_id: 1,
                promptText: 'What made you choose that card?',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_1_id: 2,
                user_2_id: 3,
                traitName: 'Talks About Feelings',
                traitDescription: 'Has a mental breakdown over a TV commercial but refuses to talk about it until later.',
                interactionType: 'roasts',
                guessedValue: 'Talks About Feelings',
                isCorrect: true,
                user_id: 3,
                promptText: 'Aw, cute. You guessed me right. Finally, someone gets me… kind of.',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_1_id: 3,
                user_2_id: 4,
                traitName: 'Spicy food lover',
                traitDescription: 'Their taste buds are basically fireproof.',
                interactionType: 'guessing',
                guessedValue: 'Mild food lover',
                isCorrect: false,
                user_id: 4,
                promptText: 'What made you choose that card?',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_1_id: 5,
                user_2_id: 6,
                traitName: 'Sarcastic',
                traitDescription: 'Their sincerity setting is permanently broken.',
                interactionType: 'guessing',
                guessedValue: 'Sarcastic',
                isCorrect: true,
                user_id: 5,
                promptText: 'Have people told you this about yourself before?',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        options.tableName = 'GamePlays';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            [Op.or]: [
                { traitName: 'Casual Talker' },
                { traitName: 'Talks About Feelings' },
                { traitName: 'Spicy food lover' },
                { traitName: 'Sarcastic' }
            ]
        }, {});
    }
};