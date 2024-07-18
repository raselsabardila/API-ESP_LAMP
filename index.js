const express = require("express")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT
let lampp_state = false

app.get(
    "/api/lampp",
    (req, res) => {
        return res.status(200).json({
            data: lampp_state,
            status: true
        })
    }
)

app.patch(
    "/api/lampp",
    (req, res) => {
        if(req.body.state == null) return res.status(400).json({ status: false, message: "Something Wrong." })
        
        lampp_state = req.body.state

        return res.status(200).json({
            status: true,
            data: lampp_state
        })
    }
)

app.listen(PORT, (error) => {
    if(error) {
        console.log(error)
    }

    console.log(`Server is running on localhost:${ PORT }`)
})
