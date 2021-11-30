const faker = require('faker');
const db = require('../config/db');

const controller = {
    generateFakeCarReviews: async(req, res) => {
        try {

            const allUsers = await db.collection('users').get();
            const allCars = await db.collection('cars').get();
            const userIds = allUsers.docs.map(doc => doc.id);
            const carIds = allCars.docs.map(doc => doc.id);
            const amount = req.params.reviews_amount;
            for (let i = 0; i < amount; i++) {
                const fakeReview = {
                    message: faker.lorem.sentences(faker.random.number({ min: 2, max: 6 })),
                    rating: faker.random.number({ min: 1, max: 5 }),
                    userId: faker.random.arrayElement(userIds)
                };
                await db.collection('cars').doc(faker.random.arrayElement(carIds)).collection('reviews').add(fakeReview);
            }
            res.status(201).send({ message: "Cars Data generated!" });
        } catch (err) {
            res.status(500).send({ message: `Server error: ${err}` });
        }
    },

    getAllReviewsByCar: async(req, res) => {
        try {
            const allReviewsSnapshot = await db.collection('cars').doc(req.params.car_id).collection('reviews').get();
            const reviews = [];
            allReviewsSnapshot.forEach(doc => {
                reviews.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            res.status(200).send(reviews);
        } catch (err) {
            res.status(500).send({ message: `Server error: ${err}` });
        }
    }
};

module.exports = controller;