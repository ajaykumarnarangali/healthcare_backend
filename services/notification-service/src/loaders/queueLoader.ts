import amqp from "amqplib";
import * as rabbitmq from "../constants/rabbitmq.constants.js";

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
            rabbitmq.RABBITMQ_EXCHANGE,
            "topic",
            { durable: true }
        );

        await rabbitChannel.assertQueue(
            rabbitmq.NOTIFICATION_QUEUE,
            { durable: true }
        );

        await rabbitChannel.bindQueue(
            rabbitmq.NOTIFICATION_QUEUE,
            rabbitmq.RABBITMQ_EXCHANGE,
            rabbitmq.USER_EMAIL_VERIFICATION_REQUESTED
        );

        console.log("RabbitMQ exchange and queue initialized");
    } catch (error) {
        console.error("Failed to initialize RabbitMQ:", error);
        throw error;
    }
}