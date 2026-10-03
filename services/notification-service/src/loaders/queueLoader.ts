import amqp from "amqplib";
import {
    RABBITMQ_EXCHANGE,
    NOTIFICATION_QUEUE
} from "../constants/rabbitmq.constants.js";

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

export async function initRabbitMQ() {
    try {
        const rabbitChannel = getRabbitMQChannel();

        await rabbitChannel.assertExchange(
            RABBITMQ_EXCHANGE,
            "topic",
            { durable: true }
        );

        await rabbitChannel.assertQueue(
            NOTIFICATION_QUEUE,
            { durable: true }
        );

        console.log("RabbitMQ exchange and queue initialized");
    } catch (error) {
        console.error("Failed to initialize RabbitMQ:", error);
        throw error;
    }
}