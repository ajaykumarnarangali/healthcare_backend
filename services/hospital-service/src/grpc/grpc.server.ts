import grpc from '@grpc/grpc-js';
import { loadProto } from './loaders/proto.loader.js';
import * as hospitalHandler from './handlers/hospital.handler.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";


function getCertificate() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const CERT_PATH = path.resolve(
        __dirname,
        '../../infrastructure/certificates'
    );

    const serverCert = fs.readFileSync(
        path.join(CERT_PATH, 'hospital-service/server.crt')
    );

    const serverKey = fs.readFileSync(
        path.join(CERT_PATH, 'hospital-service/server.key')
    );

    const caCert = fs.readFileSync(
        path.join(CERT_PATH, 'ca/ca.crt')
    );

    return { serverCert, serverKey, caCert };
}

function registerGrpcService(server: grpc.Server): void {
    const hospitalProto = loadProto('hospital.proto');

    server.addService(
        (hospitalProto.hospital as any).HospitalService.service,
        {
            ValidateHospitalAdminAssignment: hospitalHandler.validateHospitalAdminAssignment,
            AssignHospitalAdmin:hospitalHandler.assignHospitalAdmin
        }
    );
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

    const GRPC_PORT = process.env.GRPC_PORT || 50052;
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