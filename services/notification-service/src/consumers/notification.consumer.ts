import { getRabbitMQChannel } from "../loaders/init.js"
import {
    RABBITMQ_EXCHANGE,
    NOTIFICATION_QUEUE,
    NOTIFICATION_DLQ,
    RABBITMQ_ROUTING_KEYS
} from "../constants/rabbitmq.constants.js";
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
                case RABBITMQ_ROUTING_KEYS.USER_EMAIL_VERIFICATION_REQUESTED:
                    await emailService.sendVerificationEmail({
                        email: event.email,
                        userId: event.userId,
                        verificationToken: event.verificationToken
                    });
                    await processedEventRepository.markAsProcessed(event.eventId);
                    logger.info(
                        {
                            email: event.email,
                            eventId: event.eventId,
                            routingKey: message.fields.routingKey,
                        },
                        "Email verification notification processed successfully"
                    );
                    break;
                case RABBITMQ_ROUTING_KEYS.USER_HOSPITAL_ADMIN_INVITATION_REQUESTED:
                    await emailService.sendHospitalAdminInvitationEmail({
                        email: event.email,
                        name: event.name,
                        token: event.token
                    });

                    await processedEventRepository.markAsProcessed(event.eventId);

                    logger.info(
                        {
                            eventId: event.eventId,
                            routingKey: message.fields.routingKey
                        },
                        "Hospital admin invitation email processed successfully"
                    );
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

            const headers = message.properties.headers ?? {};
            const retryCount = Number(headers["x-retry-count"] ?? 0);
            if (retryCount < 3) {
                channel.publish(
                    RABBITMQ_EXCHANGE,
                    message.fields.routingKey,
                    message.content,
                    {
                        persistent: true,
                        headers: {
                            ...headers,
                            "x-retry-count": retryCount + 1
                        }
                    }
                );
            } else {
                channel.sendToQueue(
                    NOTIFICATION_DLQ,
                    message.content,
                    {
                        persistent: true,
                        headers: {
                            ...headers,
                            "x-retry-count": retryCount
                        }
                    }
                );
            }
            channel.ack(message);
        }
    });
}