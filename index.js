const express = require("express")
const mqtt = require("mqtt")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT

const client_id = `server_${ Math.random().toString().slice(3) }`
const mqtt_url = `mqtt://broker.emqx.io:1883`
const mqtt_topic = "/esp32/led"

const client_mqtt = mqtt.connect(
    mqtt_url,
    {
        clientId: client_id,
        clean: true,
        connectTimeout: 4000,
        username: "",
        password: "",
        reconnectPeriod: 1000
    }
)

client_mqtt.on("connect", () => {
    console.log(`Connnected to ${ mqtt_url }`)

    client_mqtt.subscribe([mqtt_topic], () => {
        console.log(`Subscribe to topic ${ mqtt_topic }`)
    })
})

client_mqtt.on("message", (topic, payload) => {
    console.log(`Receiver message from ${ topic }, message: ${ payload }`)
})

app.post(
    "/api/led",
    (req, res) => {
        if(!client_mqtt.connected) return res.status(402).json({ status: false, message: "MQTT not Connected" })

        if(req.body.state === undefined) return res.status(402).json({
            status: false,
            message: "state is required."
        })

        client_mqtt.publish(
            mqtt_topic,
            JSON.stringify({
                "state": req.body.state
            }),
            {
                qos: 0,
                retain: false
            },
            (error) => {
                if(error) {
                    console.log(error)
                }
            }
        )

        return res.status(200).json({
            status: true,
            message: "Success"
        })
    }
)

app.listen(PORT, (error) => {
    if(error) {
        console.log(error)
    }

    console.log(`Server is running on localhost:${ PORT }`)
})
