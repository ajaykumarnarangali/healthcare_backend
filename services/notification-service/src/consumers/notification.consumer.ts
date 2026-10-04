import { getRabbitMQChannel } from "../loaders/init.js"
import { NOTIFICATION_QUEUE, USER_EMAIL_VERIFICATION_REQUESTED } from "../constants/rabbitmq.constants.js";
import * as processedEventRepository from "../repositories/processed-event.repository.js";
import * as emailService from "../services/email.service.js";
import { logger } from "../utils/logger.js";

export function startNotificationConsumer() {
    const channel = getRabbitMQChannel();

    channel.consume(NOTIFICATION_QUEUE, async (message) => {
        if (!message) return;

        try {
            const event = JSON.parse(
                message.content.toString()
            );

            logger.info(
                {
                    eventId: event.eventId,
                    routingKey: message.fields.routingKey,
                },
                "Notification event received"
            );

            const alreadyProcessed =
                await processedEventRepository.exists(event.eventId);

            if (alreadyProcessed) {
                logger.info(
                    { eventId: event.eventId },
                    "Event already processed, skipping"
                );

                channel.ack(message);
                return;
            }

            switch (message.fields.routingKey) {
                case USER_EMAIL_VERIFICATION_REQUESTED:
                    await emailService.sendVerificationEmail({
                        email: event.email,
                        userId: event.userId,
                        verificationToken: event.verificationToken
                    });
                    await processedEventRepository.markAsProcessed(event.eventId);
                    break;
                default:
                    throw new Error(
                        `Unsupported notification event: ${message.fields.routingKey}`
                    );
            }

            channel.ack(message);

        } catch (error) {
            logger.error(
                { err: error },
                "Failed to process notification event"
            );

            channel.nack(message, false, true);
        }
    });
}