import { getRabbitMQChannel } from "../loaders/init.js"
import { NOTIFICATION_QUEUE, USER_EMAIL_VERIFICATION_REQUESTED } from "../constants/rabbitmq.constants.js";

export function startNotificationConsumer() {
    const channel = getRabbitMQChannel();

    channel.consume(NOTIFICATION_QUEUE, async (message) => {
        if (!message) return;

        const event = JSON.parse(
            message.content.toString()
        );

        switch (message.fields.routingKey) {
            case USER_EMAIL_VERIFICATION_REQUESTED:
                console.log(event);
                break;
        }

        // channel.ack(message);
    });
}