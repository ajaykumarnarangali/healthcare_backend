import grpc from "@grpc/grpc-js";
import { loadProto } from "../loaders/proto.loader.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";

function getCertificate() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const CERT_PATH = path.resolve(
        __dirname,
        '../../../infrastructure/certificates'
    );

    const clientCert = fs.readFileSync(
        path.join(CERT_PATH, 'auth-service/server.crt')
    );

    const clientKey = fs.readFileSync(
        path.join(CERT_PATH, 'auth-service/server.key')
    );

    const caCert = fs.readFileSync(
        path.join(CERT_PATH, 'ca/ca.crt')
    );

    return { clientCert, clientKey, caCert };
}

function generateUserClient() {
    const hospitalProto = loadProto('hospital.proto') as any;
    const { clientCert, clientKey, caCert } = getCertificate();

    // for client in this way
    const credentials = grpc.credentials.createSsl(
        caCert,
        clientKey,
        clientCert
    );

    const hospitalClient = new hospitalProto.hospital.HospitalService(
        process.env.HOSPITAL_GRPC_URL || 'hospital-service:50052',
        credentials
    );

    return hospitalClient;
}

const hospitalClient = generateUserClient();

export default hospitalClient;