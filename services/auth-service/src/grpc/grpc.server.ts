import grpc from '@grpc/grpc-js';
import { loadProto } from './loaders/proto.loader.js';
import * as userHandler from './handlers/user.handler.js';
import path from 'path';
import fs from 'fs';

function registerGrpcService(server: grpc.Server): void {
    const userProto = loadProto('user.proto');

    server.addService(
        (userProto.user as any).UserService.service,
        {
            GetUser: userHandler.getUser,
        }
    );
}

function getCertificate() {
    const CERT_PATH = path.resolve(
        __dirname,
        '../../infrastructure/certificates'
    );

    const serverCert = fs.readFileSync(
        path.join(CERT_PATH, 'server/server.crt')
    );

    const serverKey = fs.readFileSync(
        path.join(CERT_PATH, 'server/server.key')
    );

    const caCert = fs.readFileSync(
        path.join(CERT_PATH, 'ca/ca.crt')
    );

    return { serverCert, serverKey, caCert };
}

export function initGrpcServer(): grpc.Server {
    const server = new grpc.Server();

    registerGrpcService(server);

    const { caCert, serverCert, serverKey } = getCertificate();

    const credentials = grpc.ServerCredentials.createSsl(
        caCert,
        [
            {
                cert_chain: serverCert,
                private_key: serverKey,
            },
        ],
        true
    );

    const GRPC_PORT = process.env.GRPC_PORT || 50051;
    server.bindAsync(
        `0.0.0.0:${GRPC_PORT}`,
        credentials,
        (error, port) => {
            if (error) {
                console.error('gRPC server failed:', error);
                return;
            }

            console.log(`gRPC server running on port ${port}`);
        }
    );

    return server;
}