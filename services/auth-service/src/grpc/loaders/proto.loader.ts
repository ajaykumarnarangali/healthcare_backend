import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from "url";

/**
 * Loads a .proto contract file and converts its service
 * and message definitions into JavaScript gRPC definitions.
 *
 * @param fileName - Name of the .proto file to load.
 * @returns Loaded gRPC package definitions.
 */

export const loadProto = (fileName: string) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const PROTO_PATH = path.join(
        __dirname,
        '../protos',
        fileName
    );

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    return grpc.loadPackageDefinition(packageDefinition);
};