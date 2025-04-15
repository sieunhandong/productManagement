const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require('./routes');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors')
// Import Swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
dotenv.config()

const app = express()
const port = process.env.PORT || 9999

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
    apis: ["./src/routes/*.js"] // Chỉ định file chứa API docs (Cần tạo Swagger trong `routes`)
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors({
    origin: 'http://localhost:3000',  // Chỉ định frontend
    credentials: true                 // Cho phép gửi cookie
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve ảnh
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