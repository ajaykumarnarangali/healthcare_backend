import amqp from "amqplib";

let connection: amqp.ChannelModel;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL!);
        channel = await connection.createChannel();

        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        throw error;
    }
}

export function getRabbitMQChannel() {
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }
    return channel;
}

