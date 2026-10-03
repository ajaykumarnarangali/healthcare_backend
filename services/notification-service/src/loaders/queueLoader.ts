import amqp from "amqplib";
import {
    RABBITMQ_EXCHANGE,
    NOTIFICATION_QUEUE
} from "../constants/rabbitmq.constants";

let connection: amqp.ChannelModel;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
    connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
}

export function getRabbitMQChannel() {
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }
    return channel;
}

export async function initRabbitMQ() {
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
}