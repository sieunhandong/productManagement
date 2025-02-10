const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require('./routes');
const bodyParser = require("body-parser");
// Import Swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// app.get('/', (req, res) => {
//     res.send('Hello world')
// })
// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Product Management API",
            version: "1.0.0",
            description: "API quản lý sản phẩm và người dùng"
        },
        servers: [
            {
                url: "http://localhost:3001"
            }
        ]
    },
    apis: ["./routes/*.js"] // Chỉ định file chứa API docs (Cần tạo Swagger trong `routes`)
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json())

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect DB success!')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log('Server is running in port: ', + port)
})