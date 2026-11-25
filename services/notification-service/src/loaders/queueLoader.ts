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

        // Main notification queue
        await rabbitChannel.assertQueue(
            rabbitmq.NOTIFICATION_QUEUE,
            { durable: true }
        );

        // Dead letter queue
        await rabbitChannel.assertQueue(
            rabbitmq.NOTIFICATION_DLQ,
            { durable: true }
        );

        const routingKeys = [
            rabbitmq.RABBITMQ_ROUTING_KEYS.USER_EMAIL_VERIFICATION_REQUESTED,
            rabbitmq.RABBITMQ_ROUTING_KEYS.USER_HOSPITAL_ADMIN_INVITATION_REQUESTED,
        ];

        await Promise.all(
            routingKeys.map((routingKey) =>
                rabbitChannel.bindQueue(
                    rabbitmq.NOTIFICATION_QUEUE,
                    rabbitmq.RABBITMQ_EXCHANGE,
                    routingKey
                )
            )
        );

        console.log("RabbitMQ exchange and queue initialized");
    } catch (error) {
        console.error("Failed to initialize RabbitMQ:", error);
        throw error;
    }
}