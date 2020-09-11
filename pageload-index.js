// Web server section.
const express = require('express');
const app = express();
const port = 3000;

// Connecting to PostgreSQL.

const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/sample3', {
    dialect: 'postgres',
    protocol: 'postgres'
    // Only use the following for SSL connections:
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }
});

// Define PageLoads variable which will be assigned the model for the page_loads table.
let PageLoads;

sequelize.authenticate().then(() =>{
    console.log('Connection has been established successfully.');
    PageLoads = sequelize.define('page_loads', {
        userAgent: Sequelize.STRING,
        time: Sequelize.DATE
    });
}).catch(err =>{
    console.error('Unable to connect to the database: ', err);
});



// Starting the HTTP endpoints.
app.use(express.json());
app.get('/', async (req, res) => {
    // get user agent and current time
    const userAgent = req.get('user-agent');
    const time = new Date().getTime();
    try{
        // insert the record
        await PageLoads.create({ userAgent, time });
        // Send response.
        //res.send('Inserted!');

        // Show all loads.
        const messages = await PageLoads.findAll();
        res.send(messages);
    } catch(e){
        console.log('Error inserting data. ', e);
    }
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));