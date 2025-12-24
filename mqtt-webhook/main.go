package main

import (
    "bytes"
    "crypto/tls"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"

    mqtt "github.com/eclipse/paho.mqtt.golang"
    "github.com/joho/godotenv"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using system environment")
    }

    MQTTBroker := os.Getenv("MQTT_BROKER")
    MQTTPort := os.Getenv("MQTT_PORT")
    MQTTUsername := os.Getenv("MQTT_USERNAME")
    MQTTPassword := os.Getenv("MQTT_PASSWORD")
    MQTTTopicSub := os.Getenv("MQTT_TOPIC_SUB")
    WebhookURL := os.Getenv("WEBHOOK_URL")

    opts := mqtt.NewClientOptions()
    opts.AddBroker(fmt.Sprintf("tls://%s:%s", MQTTBroker, MQTTPort)) 
    opts.SetUsername(MQTTUsername)
    opts.SetPassword(MQTTPassword)
    opts.SetTLSConfig(&tls.Config{
        InsecureSkipVerify: true,
    })

    opts.OnConnect = func(c mqtt.Client) {
        log.Println("Connected to MQTT broker")
        token := c.Subscribe(MQTTTopicSub, 0, mqttMessageHandler(WebhookURL))
        token.Wait()
        if token.Error() != nil {
            log.Println("Subscribe error:", token.Error())
        } else {
            log.Println("Subscribed to", MQTTTopicSub)
        }
    }

    opts.OnConnectionLost = func(c mqtt.Client, err error) {
        log.Println("Connection lost:", err)
    }

    client := mqtt.NewClient(opts)
    if token := client.Connect(); token.Wait() && token.Error() != nil {
        log.Fatal("MQTT connect error:", token.Error())
    }

    select {}
}

func mqttMessageHandler(webhookURL string) mqtt.MessageHandler {
    return func(client mqtt.Client, msg mqtt.Message) {
        payload := msg.Payload()
        go func() {
            ts := time.Now().Format(time.RFC3339)
            data := map[string]string{
                "topic":   msg.Topic(),
                "payload": string(payload),
                "ts":      ts,
            }
            body, _ := json.Marshal(data)

            resp, err := http.Post(webhookURL, "application/json", bytes.NewBuffer(body))
            if err != nil {
                log.Println("Forward error:", err)
                return
            }
            resp.Body.Close()
            log.Println("Forwarded")
            /* log.Println("Forwarded:", string(payload)) */
        }()
    }
}
